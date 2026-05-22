const Simulation = require('../models/Simulation');
const logActivity = require('../utils/logger');

// Simulators
const simulateFCFS = require('../simulators/fcfs');
const simulateSJF = require('../simulators/sjf');
const simulatePriority = require('../simulators/priority');
const simulateRoundRobin = require('../simulators/roundRobin');

// @desc    Run scheduling simulator directly and return results
// @route   POST /api/simulations/run
// @access  Public
const runSimulation = (req, res) => {
  try {
    const { algorithm, processes, preemptive, quantum, lowerIsHigher } = req.body;

    if (!algorithm || !processes || !Array.isArray(processes)) {
      return res.status(400).json({ success: false, message: 'Please provide algorithm and a processes array' });
    }

    let result;
    switch (algorithm) {
      case 'FCFS':
        result = simulateFCFS(processes);
        break;
      case 'SJF':
        result = simulateSJF(processes, preemptive === true);
        break;
      case 'Priority':
        result = simulatePriority(processes, preemptive === true, lowerIsHigher !== false);
        break;
      case 'RR':
        result = simulateRoundRobin(processes, Number(quantum || 2));
        break;
      default:
        return res.status(400).json({ success: false, message: 'Invalid algorithm specified' });
    }

    res.json({ success: true, algorithm, result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Save simulation logs
// @route   POST /api/simulations/save
// @access  Private
const saveSimulation = async (req, res) => {
  try {
    const { algorithm, processes, ganttData, averageWaitingTime, averageTurnaroundTime, cpuUtilization, resourceSelected } = req.body;

    if (!algorithm || !processes || !ganttData || averageWaitingTime === undefined || cpuUtilization === undefined) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields to save' });
    }

    const simulation = await Simulation.create({
      userId: req.user.id,
      algorithm,
      processes,
      ganttData,
      averageWaitingTime,
      averageTurnaroundTime,
      cpuUtilization,
      resourceSelected: resourceSelected || 'Arena Core CPU'
    });

    await logActivity(
      req.user.id,
      'SIMULATION_RUN',
      `Saved custom simulation using ${algorithm} (CPU utilization: ${cpuUtilization}%)`,
      req
    );

    res.status(201).json({ success: true, simulation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's saved simulations
// @route   GET /api/simulations/my
// @access  Private
const getSavedSimulations = async (req, res) => {
  try {
    const simulations = await Simulation.find({ userId: req.user.id })
      .sort({ createdAt: -1 });
    res.json({ success: true, simulations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get aggregated comparison analytics of algorithms
// @route   GET /api/simulations/analytics
// @access  Public
const getAnalytics = async (req, res) => {
  try {
    // Compile comparisons based on all simulations in the DB or provide standard default baselines if DB is empty
    const savedSims = await Simulation.find({});
    
    // Default fallback stats if there is not enough seeded data yet
    let analyticsData = {
      visitorLoad: [
        { name: 'Reception', visitors: 142 },
        { name: 'Kids Zone', visitors: 98 },
        { name: 'Adult Arena', visitors: 165 },
        { name: 'Gaming Zone', visitors: 220 }
      ],
      algorithmComparison: [
        { name: 'FCFS', waitingTime: 12.5, turnaroundTime: 18.2, cpuUtilization: 92 },
        { name: 'SJF (Preempt)', waitingTime: 6.4, turnaroundTime: 11.2, cpuUtilization: 98 },
        { name: 'Priority', waitingTime: 9.8, turnaroundTime: 15.1, cpuUtilization: 94 },
        { name: 'Round Robin', waitingTime: 10.2, turnaroundTime: 16.0, cpuUtilization: 95 }
      ],
      hourlyPeak: [
        { hour: '09:00', visitors: 30 },
        { hour: '11:00', visitors: 85 },
        { hour: '13:00', visitors: 120 },
        { hour: '15:00', visitors: 160 },
        { hour: '17:00', visitors: 210 },
        { hour: '19:00', visitors: 245 },
        { hour: '21:00', visitors: 190 },
        { hour: '23:00', visitors: 70 }
      ]
    };

    if (savedSims.length > 0) {
      // Calculate averages from actual DB records dynamically!
      const algos = ['FCFS', 'SJF', 'Priority', 'RR'];
      const compiled = algos.map(algo => {
        const sims = savedSims.filter(s => s.algorithm === algo || (algo === 'SJF' && s.algorithm === 'SJF') || (algo === 'Round Robin' && s.algorithm === 'RR'));
        if (sims.length === 0) {
          // Fall back to default for this algorithm
          return analyticsData.algorithmComparison.find(a => a.name.includes(algo)) || { name: algo, waitingTime: 8, turnaroundTime: 14, cpuUtilization: 90 };
        }
        const avgWait = sims.reduce((sum, s) => sum + s.averageWaitingTime, 0) / sims.length;
        const avgTurn = sims.reduce((sum, s) => sum + s.averageTurnaroundTime, 0) / sims.length;
        const avgCpu = sims.reduce((sum, s) => sum + s.cpuUtilization, 0) / sims.length;

        return {
          name: algo === 'RR' ? 'Round Robin' : algo === 'SJF' ? 'SJF (Preempt)' : algo,
          waitingTime: Number(avgWait.toFixed(1)),
          turnaroundTime: Number(avgTurn.toFixed(1)),
          cpuUtilization: Number(avgCpu.toFixed(1))
        };
      });
      analyticsData.algorithmComparison = compiled;
    }

    res.json({ success: true, analytics: analyticsData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { runSimulation, saveSimulation, getSavedSimulations, getAnalytics };
