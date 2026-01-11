const Bid = require('../models/Bid');
const Gig = require('../models/Gig');
const Notification = require('../models/Notification');
const mongoose = require('mongoose');

const createBid = async (req, res) => {
  const { gigId, message, price } = req.body;

  try {
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    if (gig.status !== 'open') {
        return res.status(400).json({ message: 'Gig is not open for bidding' });
    }

    if (gig.ownerId.toString() === req.user._id.toString()) {
        return res.status(400).json({ message: 'Owner cannot bid on their own gig' });
    }

    const bid = new Bid({
      gigId,
      freelancerId: req.user._id,
      message,
      price,
    });

    const createdBid = await bid.save();
    res.status(201).json(createdBid);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const getBidsByGigId = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.gigId);
    
    if (!gig) {
        return res.status(404).json({ message: 'Gig not found' });
    }

    // Only owner can see bids
    if (gig.ownerId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to view bids' });
    }

    const bids = await Bid.find({ gigId: req.params.gigId }).populate('freelancerId', 'name email');
    res.json(bids);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const hireFreelancer = async (req, res) => {
    const { bidId } = req.params;
    
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const bid = await Bid.findById(bidId).session(session);
        if (!bid) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Bid not found' });
        }

        const gig = await Gig.findById(bid.gigId).session(session);
        if (!gig) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Gig not found' });
        }

        // Verify owner
        if (gig.ownerId.toString() !== req.user._id.toString()) {
            await session.abortTransaction();
            session.endSession();
            return res.status(401).json({ message: 'Not authorized to hire for this gig' });
        }

        // Check if already assigned (Race Condition Check)
        if (gig.status !== 'open') {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'Gig is no longer open' });
        }

        // 1. Update Gig status
        gig.status = 'assigned';
        await gig.save({ session });

        // 2. Update Chosen Bid status
        bid.status = 'hired';
        await bid.save({ session });

        // 3. Reject other bids
        await Bid.updateMany(
            { gigId: gig._id, _id: { $ne: bidId } },
            { $set: { status: 'rejected' } },
            { session }
        );

        // 4. Create Notification
        const notification = new Notification({
            userId: bid.freelancerId,
            type: 'HIRED',
            message: `🎉 You have been hired for "${gig.title}"!`,
            gigId: gig._id
        });
        await notification.save({ session });

        await session.commitTransaction();
        session.endSession();

        // Emit Socket.io event for Real-time notification
        const io = req.app.get('io');
        if (io) {
            io.to(bid.freelancerId.toString()).emit('notification', notification);
        }
        
        res.json({ message: 'Freelancer hired successfully' });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error(error);
        res.status(500).json({ message: 'Transaction failed', error: error.message });
    }
};

const completeJob = async (req, res) => {
    const { bidId } = req.params;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const bid = await Bid.findById(bidId).session(session);
        if (!bid) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Bid not found' });
        }

        // Verify freelancer
        if (bid.freelancerId.toString() !== req.user._id.toString()) {
            await session.abortTransaction();
            session.endSession();
            return res.status(401).json({ message: 'Not authorized to complete this job' });
        }

        if (bid.status !== 'hired') {
             await session.abortTransaction();
             session.endSession();
             return res.status(400).json({ message: 'Only hired jobs can be completed' });
        }

        const gig = await Gig.findById(bid.gigId).session(session);
        if (!gig) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Gig not found' });
        }

        // 1. Update Bid Status
        bid.status = 'completed';
        await bid.save({ session });

        // 2. Update Gig Status
        gig.status = 'completed';
        await gig.save({ session });
        
         // 3. Create Notification for Owner
         const notification = new Notification({
            userId: gig.ownerId,
            type: 'COMPLETED',
            message: `✅ Job "${gig.title}" has been marked as completed by freelancer!`,
            gigId: gig._id
        });
        await notification.save({ session });

        await session.commitTransaction();
        session.endSession();
        
        // Emit Socket.io
        const io = req.app.get('io');
        if (io) {
             io.to(gig.ownerId.toString()).emit('notification', notification);
        }

        res.json({ message: 'Job marked as completed' });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error(error);
        res.status(500).json({ message: 'Transaction failed', error: error.message });
    }
};

module.exports = {
  createBid,
  getBidsByGigId,
  hireFreelancer,
  completeJob
};
