const express = require('express');
const router = express.Router();
const { runSimulation, saveSimulation, getSavedSimulations, getAnalytics } = require('../controllers/simulationController');
const { protect } = require('../middleware/authMiddleware');

router.post('/run', runSimulation);
router.post('/save', protect, saveSimulation);
router.get('/my', protect, getSavedSimulations);
router.get('/analytics', getAnalytics);

module.exports = router;
