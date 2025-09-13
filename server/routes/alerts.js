const express = require('express');
const alertService = require('../services/alertService');
const Alert = require('../models/Alert');
const router = express.Router();

// GET /api/alerts - Get all alerts
router.get('/', async (req, res) => {
  try {
    const { limit = 50, skip = 0, unreadOnly = false } = req.query;
    
    let query = {};
    if (unreadOnly === 'true') {
      query.isRead = false;
    }

    const alerts = await Alert.find(query)
      .populate('healthDataId')
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    res.json({
      success: true,
      data: alerts,
      count: alerts.length
    });

  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ 
      error: 'Failed to fetch alerts',
      details: error.message 
    });
  }
});

// GET /api/alerts/count - Get unread alerts count
router.get('/count', async (req, res) => {
  try {
    const count = await alertService.getUnreadAlertsCount();
    
    res.json({
      success: true,
      count
    });

  } catch (error) {
    console.error('Error fetching alerts count:', error);
    res.status(500).json({ 
      error: 'Failed to fetch alerts count',
      details: error.message 
    });
  }
});

// PUT /api/alerts/:id/read - Mark alert as read
router.put('/:id/read', async (req, res) => {
  try {
    const alert = await alertService.markAlertAsRead(req.params.id);
    
    if (!alert) {
      return res.status(404).json({ 
        error: 'Alert not found' 
      });
    }

    res.json({
      success: true,
      data: alert
    });

  } catch (error) {
    console.error('Error marking alert as read:', error);
    res.status(500).json({ 
      error: 'Failed to mark alert as read',
      details: error.message 
    });
  }
});

// PUT /api/alerts/:id/resolve - Mark alert as resolved
router.put('/:id/resolve', async (req, res) => {
  try {
    const alert = await alertService.markAlertAsResolved(req.params.id);
    
    if (!alert) {
      return res.status(404).json({ 
        error: 'Alert not found' 
      });
    }

    res.json({
      success: true,
      data: alert
    });

  } catch (error) {
    console.error('Error marking alert as resolved:', error);
    res.status(500).json({ 
      error: 'Failed to mark alert as resolved',
      details: error.message 
    });
  }
});

// DELETE /api/alerts/:id - Delete alert
router.delete('/:id', async (req, res) => {
  try {
    const alert = await Alert.findByIdAndDelete(req.params.id);
    
    if (!alert) {
      return res.status(404).json({ 
        error: 'Alert not found' 
      });
    }

    res.json({
      success: true,
      message: 'Alert deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting alert:', error);
    res.status(500).json({ 
      error: 'Failed to delete alert',
      details: error.message 
    });
  }
});

module.exports = router;
