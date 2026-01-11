const express = require('express');
const router = express.Router();
const { createGig, getGigs, getMyGigs, getGigById } = require('../controllers/gigController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(getGigs)
    .post(protect, createGig);

router.get('/my-gigs', protect, getMyGigs);
router.get('/:id', getGigById);

module.exports = router;

