const express = require('express');
const HealthData = require('../models/HealthData');
const emailService = require('../services/emailService');
const { generatePDFReport } = require('../services/pdfService');
const router = express.Router();

// GET /api/report/monthly - Generate monthly PDF report
router.get('/monthly', async (req, res) => {
  try {
    const { month, year, email } = req.query;
    
    // Default to current month/year if not provided
    const targetMonth = month ? parseInt(month) : new Date().getMonth() + 1;
    const targetYear = year ? parseInt(year) : new Date().getFullYear();
    
    // Calculate date range for the month
    const startDate = new Date(targetYear, targetMonth - 1, 1);
    const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);

    // Fetch health data for the month
    const healthData = await HealthData.find({
      timestamp: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ timestamp: 1 });

    if (healthData.length === 0) {
      return res.status(404).json({
        error: 'No health data found for the specified month'
      });
    }

    // Calculate statistics
    const stats = calculateMonthlyStats(healthData);

    // Generate PDF report
    const pdfBuffer = await generatePDFReport(healthData, stats, {
      month: targetMonth,
      year: targetYear
    });

    // Send email if email is provided
    if (email) {
      await emailService.sendHealthReport(email, {
        ...stats,
        pdfBuffer
      });
    }

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="health-report-${targetYear}-${targetMonth.toString().padStart(2, '0')}.pdf"`);
    
    res.send(pdfBuffer);

  } catch (error) {
    console.error('Error generating monthly report:', error);
    res.status(500).json({
      error: 'Failed to generate monthly report',
      details: error.message
    });
  }
});

// GET /api/report/stats - Get report statistics
router.get('/stats', async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const daysAgo = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const healthData = await HealthData.find({
      timestamp: { $gte: daysAgo }
    }).sort({ timestamp: 1 });

    if (healthData.length === 0) {
      return res.json({
        success: true,
        data: {
          message: 'No data available for the specified period',
          stats: null
        }
      });
    }

    const stats = calculateMonthlyStats(healthData);

    res.json({
      success: true,
      data: {
        period: `${days} days`,
        stats
      }
    });

  } catch (error) {
    console.error('Error fetching report stats:', error);
    res.status(500).json({
      error: 'Failed to fetch report statistics',
      details: error.message
    });
  }
});

// Helper function to calculate monthly statistics
function calculateMonthlyStats(healthData) {
  if (healthData.length === 0) {
    return {
      averagePulse: 0,
      minPulse: 0,
      maxPulse: 0,
      averageSpo2: 0,
      minSpo2: 0,
      maxSpo2: 0,
      totalSteps: 0,
      totalCalories: 0,
      dataPoints: 0,
      emergencyCount: 0
    };
  }

  const pulseRates = healthData.map(d => d.pulseRate);
  const spo2Values = healthData.map(d => d.spo2);
  const steps = healthData.map(d => d.steps);
  const calories = healthData.map(d => d.calories);

  const emergencyCount = healthData.filter(d => 
    d.pulseRate < 50 || d.pulseRate > 120 || d.spo2 < 90
  ).length;

  return {
    averagePulse: Math.round(pulseRates.reduce((a, b) => a + b, 0) / pulseRates.length),
    minPulse: Math.min(...pulseRates),
    maxPulse: Math.max(...pulseRates),
    averageSpo2: Math.round((spo2Values.reduce((a, b) => a + b, 0) / spo2Values.length) * 100) / 100,
    minSpo2: Math.min(...spo2Values),
    maxSpo2: Math.max(...spo2Values),
    totalSteps: steps.reduce((a, b) => a + b, 0),
    totalCalories: Math.round(calories.reduce((a, b) => a + b, 0)),
    dataPoints: healthData.length,
    emergencyCount
  };
}

module.exports = router;
