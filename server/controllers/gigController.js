const Gig = require('../models/Gig');

const createGig = async (req, res) => {
  const { title, description, budget } = req.body;

  try {
    const gig = new Gig({
      title,
      description,
      budget,
      ownerId: req.user._id,
    });

    const createdGig = await gig.save();
    res.status(201).json(createdGig);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const getGigs = async (req, res) => {
  try {
    const { search, minBudget, maxBudget, status, sort } = req.query;

    let query = {};

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    if (minBudget || maxBudget) {
      query.budget = {};
      if (minBudget) query.budget.$gte = Number(minBudget);
      if (maxBudget) query.budget.$lte = Number(maxBudget);
    }

    if (status) {
      query.status = status;
    } else {
        // Default to showing only open gigs if no status filter provided?
        // Or show all public gigs? The requirement says "Browse Gigs: A public/private feed showing all 'Open' jobs."
        // But for filters, we might want to allow filtering by status if needed.
        // Let's default to 'open' if not specified, or allow overriding.
        // For now, let's keep it safe and default to open unless specifically asked.
        if (!status) query.status = 'open';
    }

    let sortOption = { createdAt: -1 }; // Default: Newest

    if (sort === 'budget_asc') {
      sortOption = { budget: 1 };
    } else if (sort === 'budget_desc') {
      sortOption = { budget: -1 };
    } else if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    }

    const gigs = await Gig.find(query)
      .populate('ownerId', 'name email')
      .sort(sortOption);

    res.json(gigs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getMyGigs = async (req, res) => {
    try {
        const gigs = await Gig.find({ ownerId: req.user._id }).sort({ createdAt: -1 });
        res.json(gigs);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
}

const getGigById = async (req, res) => {
    try {
        const gig = await Gig.findById(req.params.id).populate('ownerId', 'name email');
        if (gig) {
            res.json(gig);
        } else {
            res.status(404).json({ message: 'Gig not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
}

module.exports = {
  createGig,
  getGigs,
  getMyGigs,
  getGigById
};
