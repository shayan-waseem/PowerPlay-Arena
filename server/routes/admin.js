const express = require('express');
const router = express.Router();
const { getSystemStats, getAllUsers, deleteUser, getLogs, getAllBookings, clearAllBookings } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/stats', protect, admin, getSystemStats);
router.get('/users', protect, admin, getAllUsers);
router.delete('/users/:id', protect, admin, deleteUser);
router.get('/logs', protect, admin, getLogs);
router.get('/bookings', protect, admin, getAllBookings);
router.post('/bookings/clear', protect, admin, clearAllBookings);

module.exports = router;
