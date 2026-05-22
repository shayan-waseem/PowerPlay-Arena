const User = require('../models/User');
const Booking = require('../models/Booking');
const Simulation = require('../models/Simulation');
const Log = require('../models/Log');

// @desc    Get complete administrative dashboards statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getSystemStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalBookings = await Booking.countDocuments({});
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const totalSimulations = await Simulation.countDocuments({});

    // Calculate a mock server status
    const uptime = process.uptime();
    const systemStatus = {
      uptime: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`,
      memoryUsage: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
      nodeVersion: process.version,
      platform: process.platform,
      cpuLoad: '12.4%',
      activeSessions: Math.floor(Math.random() * 5) + 1 // Dynamic mock visitor sessions active right now
    };

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalBookings,
        pendingBookings,
        completedBookings,
        totalSimulations
      },
      systemStatus
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users list
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await User.findByIdAndDelete(req.params.id);
    // Delete associated bookings & simulations
    await Booking.deleteMany({ userId: req.params.id });
    await Simulation.deleteMany({ userId: req.params.id });

    res.json({ success: true, message: 'User and all associated data deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all system activity logs
// @route   GET /api/admin/logs
// @access  Private/Admin
const getLogs = async (req, res) => {
  try {
    const logs = await Log.find({})
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 })
      .limit(100);
    res.json({ success: true, logs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all bookings (Admin View)
// @route   GET /api/admin/bookings
// @access  Private/Admin
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Clear all bookings (Reset scheduling simulation queues)
// @route   POST /api/admin/bookings/clear
// @access  Private/Admin
const clearAllBookings = async (req, res) => {
  try {
    await Booking.deleteMany({});
    res.json({ success: true, message: 'All booking queues cleared successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getSystemStats, getAllUsers, deleteUser, getLogs, getAllBookings, clearAllBookings };
