const mongoose = require('mongoose');

const simulationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    algorithm: {
      type: String,
      required: true,
      enum: ['FCFS', 'SJF', 'Priority', 'RR'],
    },
    processes: [
      {
        id: String,
        name: String,
        arrivalTime: Number,
        burstTime: Number,
        priority: Number,
        waitingTime: Number,
        turnaroundTime: Number,
        completionTime: Number,
      },
    ],
    ganttData: [
      {
        id: String,
        name: String,
        start: Number,
        end: Number,
      },
    ],
    averageWaitingTime: {
      type: Number,
      required: true,
    },
    averageTurnaroundTime: {
      type: Number,
      required: true,
    },
    cpuUtilization: {
      type: Number,
      required: true,
    },
    resourceSelected: {
      type: String,
      default: 'Arena Core CPU',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Simulation', simulationSchema);
