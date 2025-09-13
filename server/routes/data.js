const express = require('express');
const HealthData = require('../models/HealthData');
const alertService = require('../services/alertService');
const router = express.Router();

// POST /api/data - Receive sensor data
router.post('/', async (req, res) => {
  try {
    const { pulseRate, spo2, steps, calories, deviceId } = req.body;

    // Validate required fields
    if (!pulseRate || !spo2) {
      return res.status(400).json({ 
        error: 'Pulse rate and SpO2 are required' 
      });
    }

    // Create health data record
    const healthData = new HealthData({
      pulseRate,
      spo2,
      steps: steps || 0,
      calories: calories || 0,
      deviceId: deviceId || 'default_device'
    });

    await healthData.save();

    // Check for alerts
    const alerts = await alertService.checkAndCreateAlerts(healthData);

    // Emit real-time update via Socket.io
    const io = req.app.get('io');
    if (io) {
      io.emit('healthDataUpdate', {
        healthData,
        alerts: alerts.length > 0 ? alerts : null
      });
    }

    res.status(201).json({
      success: true,
      data: healthData,
      alerts: alerts.length > 0 ? alerts : null
    });

  } catch (error) {
    console.error('Error saving health data:', error);
    res.status(500).json({ 
      error: 'Failed to save health data',
      details: error.message 
    });
  }
});

// GET /api/data - Fetch last 24 hours of readings
router.get('/', async (req, res) => {
  try {
    const { hours = 24, limit = 100 } = req.query;
    const hoursAgo = new Date(Date.now() - hours * 60 * 60 * 1000);

    const healthData = await HealthData.find({
      timestamp: { $gte: hoursAgo }
    })
    .sort({ timestamp: -1 })
    .limit(parseInt(limit));

    res.json({
      success: true,
      data: healthData,
      count: healthData.length
    });

  } catch (error) {
    console.error('Error fetching health data:', error);
    res.status(500).json({ 
      error: 'Failed to fetch health data',
      details: error.message 
    });
  }
});

// GET /api/data/stats - Get statistics
router.get('/stats', async (req, res) => {
  try {
    const { hours = 24 } = req.query;
    const hoursAgo = new Date(Date.now() - hours * 60 * 60 * 1000);

    const stats = await HealthData.aggregate([
      {
        $match: {
          timestamp: { $gte: hoursAgo }
        }
      },
      {
        $group: {
          _id: null,
          averagePulse: { $avg: '$pulseRate' },
          minPulse: { $min: '$pulseRate' },
          maxPulse: { $max: '$pulseRate' },
          averageSpo2: { $avg: '$spo2' },
          minSpo2: { $min: '$spo2' },
          maxSpo2: { $max: '$spo2' },
          totalSteps: { $sum: '$steps' },
          totalCalories: { $sum: '$calories' },
          count: { $sum: 1 }
        }
      }
    ]);

    const result = stats[0] || {
      averagePulse: 0,
      minPulse: 0,
      maxPulse: 0,
      averageSpo2: 0,
      minSpo2: 0,
      maxSpo2: 0,
      totalSteps: 0,
      totalCalories: 0,
      count: 0
    };

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error fetching health stats:', error);
    res.status(500).json({ 
      error: 'Failed to fetch health statistics',
      details: error.message 
    });
  }
});

// GET /api/data/latest - Get latest reading
router.get('/latest', async (req, res) => {
  try {
    const latestData = await HealthData.findOne()
      .sort({ timestamp: -1 });

    if (!latestData) {
      return res.status(404).json({ 
        error: 'No health data found' 
      });
    }

    res.json({
      success: true,
      data: latestData
    });

  } catch (error) {
    console.error('Error fetching latest health data:', error);
    res.status(500).json({ 
      error: 'Failed to fetch latest health data',
      details: error.message 
    });
  }
});

module.exports = router;
