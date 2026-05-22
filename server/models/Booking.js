const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    department: {
      type: String,
      required: true,
      enum: ['reception', 'kids', 'adult', 'gaming'],
    },
    activity: {
      type: String,
      required: true,
    },
    algorithm: {
      type: String,
      required: true,
      enum: ['FCFS', 'SJF', 'Priority', 'RR'],
    },
    status: {
      type: String,
      enum: ['pending', 'running', 'completed', 'cancelled'],
      default: 'pending',
    },
    sessionTime: {
      type: Number,
      required: [true, 'Please add session time in minutes (Burst Time)'],
    },
    priority: {
      type: Number,
      default: 3, // 1 is highest, 5 is lowest (or custom)
    },
    arrivalTime: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Booking', bookingSchema);
