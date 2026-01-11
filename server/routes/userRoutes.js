const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, getDashboardStats);

module.exports = router;

