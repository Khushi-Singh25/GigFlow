const Bid = require('../models/Bid');
const Gig = require('../models/Gig');

const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user._id;
        const { filter } = req.query; // 'bids', 'hired', 'active', 'completed'

        // Base Stats (Counts)
        const [bidsSubmitted, gigsHired, gigsCompleted] = await Promise.all([
            Bid.countDocuments({ freelancerId: userId }),
            Bid.countDocuments({ freelancerId: userId, status: 'hired' }),
            Bid.countDocuments({ freelancerId: userId, status: 'completed' })
        ]);

        let listData = [];
        let listType = filter || 'active'; // Default to active jobs

        if (filter === 'bids') {
            listData = await Bid.find({ freelancerId: userId })
                .populate('gigId', 'title status budget')
                .sort({ createdAt: -1 });
        } else if (filter === 'hired') {
             // Historical hired (includes active and completed) or just active?
             // Usually "Hired" stats implies total hired ever.
             listData = await Bid.find({ freelancerId: userId, status: { $in: ['hired', 'completed'] } })
                .populate('gigId', 'title status budget')
                .sort({ updatedAt: -1 });
        } else if (filter === 'completed') {
            listData = await Bid.find({ freelancerId: userId, status: 'completed' })
                .populate('gigId', 'title status budget')
                .sort({ updatedAt: -1 });
        } else {
            // Default: Active Jobs (Hired but not completed)
            listData = await Bid.find({ freelancerId: userId, status: 'hired' })
                .populate('gigId', 'title status budget')
                .sort({ updatedAt: -1 });
        }

        res.json({
            stats: {
                bidsSubmitted,
                gigsHired, // Total Hired ever
                gigsCompleted,
                currentlyAssigned: await Bid.countDocuments({ freelancerId: userId, status: 'hired' })
            },
            listData,
            filter: listType
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getDashboardStats
};
