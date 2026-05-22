const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, simulateDepartmentQueue } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.post('/simulate/:department', protect, simulateDepartmentQueue);

module.exports = router;
