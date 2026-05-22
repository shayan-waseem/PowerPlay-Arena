const Booking = require('../models/Booking');
const logActivity = require('../utils/logger');

// Simulators
const simulateFCFS = require('../simulators/fcfs');
const simulateSJF = require('../simulators/sjf');
const simulatePriority = require('../simulators/priority');
const simulateRoundRobin = require('../simulators/roundRobin');

// @desc    Create a new booking (Process Entry)
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { department, activity, algorithm, sessionTime, priority } = req.body;

    if (!department || !activity || !algorithm || !sessionTime) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const booking = await Booking.create({
      userId: req.user.id,
      department,
      activity,
      algorithm,
      sessionTime: Number(sessionTime),
      priority: Number(priority || 3),
      arrivalTime: new Date(),
    });

    await logActivity(
      req.user.id,
      'BOOKING_CREATE',
      `Booking created for ${activity} in ${department} department using ${algorithm}`,
      req
    );

    res.status(201).json({ success: true, booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user's bookings (Terminated or Queue status)
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Simulate scheduling for a department's pending queue
// @route   POST /api/bookings/simulate/:department
// @access  Private
const simulateDepartmentQueue = async (req, res) => {
  try {
    const { department } = req.params;
    const { algorithm, preemptive, quantum, lowerIsHigher } = req.body;

    if (!department) {
      return res.status(400).json({ success: false, message: 'Department is required' });
    }

    // Find all pending bookings for this department
    const bookings = await Booking.find({ department, status: 'pending' })
      .populate('userId', 'name email');

    if (bookings.length === 0) {
      return res.status(400).json({
        success: false,
        message: `No pending queue visitors in the ${department} department. Try making bookings first!`
      });
    }

    // Determine the algorithm to run
    const algoToRun = algorithm || bookings[0].algorithm;

    // Convert bookings to standard process format for OS simulators
    const minTime = Math.min(...bookings.map(b => new Date(b.arrivalTime).getTime()));

    const processList = bookings.map((b, index) => {
      // Map arrival time to relative integer seconds (or minutes) from first arrival
      const arrRelative = Math.max(0, Math.floor((new Date(b.arrivalTime).getTime() - minTime) / 1000)); // Rel in seconds
      return {
        id: b._id.toString(),
        name: `${b.activity} - ${b.userId ? b.userId.name : 'Visitor'}`,
        arrivalTime: arrRelative,
        burstTime: b.sessionTime,
        priority: b.priority
      };
    });

    let simulationResult;

    // Run scheduling simulation
    switch (algoToRun) {
      case 'FCFS':
        simulationResult = simulateFCFS(processList);
        break;
      case 'SJF':
        simulationResult = simulateSJF(processList, preemptive === 'true' || preemptive === true);
        break;
      case 'Priority':
        simulationResult = simulatePriority(
          processList,
          preemptive === 'true' || preemptive === true,
          lowerIsHigher !== false
        );
        break;
      case 'RR':
        simulationResult = simulateRoundRobin(processList, Number(quantum || 2));
        break;
      default:
        simulationResult = simulateFCFS(processList);
    }

    // Update Simulated Bookings in DB from 'pending' to 'completed' (or 'running')
    // In our arena, completing the scheduling simulator signifies executing the sessions and moving processes to Terminated!
    await Booking.updateMany(
      { _id: { $in: bookings.map(b => b._id) } },
      { $set: { status: 'completed', completedAt: new Date() } }
    );

    await logActivity(
      req.user.id,
      'DEPT_SIMULATE',
      `Executed scheduling queue simulator for ${department} using ${algoToRun} (${~~bookings.length} visitors allocated)`,
      req
    );

    res.json({
      success: true,
      department,
      algorithm: algoToRun,
      count: bookings.length,
      ...simulationResult
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createBooking, getMyBookings, simulateDepartmentQueue };
