const express = require('express');
const router = express.Router();
const { createBid, getBidsByGigId, hireFreelancer, completeJob } = require('../controllers/bidController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createBid);
router.get('/:gigId', protect, getBidsByGigId);
router.patch('/:bidId/hire', protect, hireFreelancer);
router.patch('/:bidId/complete', protect, completeJob);

module.exports = router;
