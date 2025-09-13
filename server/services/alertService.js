const HealthData = require('../models/HealthData');
const Alert = require('../models/Alert');
const emailService = require('./emailService');
const smsService = require('./smsService');

class AlertService {
  async checkAndCreateAlerts(healthData) {
    const alerts = [];
    
    // Check pulse rate alerts
    if (healthData.pulseRate < 50) {
      const alert = await this.createAlert({
        type: 'pulse_low',
        message: `Low pulse rate detected: ${healthData.pulseRate} BPM`,
        severity: 'high',
        healthDataId: healthData._id
      });
      alerts.push(alert);
    } else if (healthData.pulseRate > 120) {
      const alert = await this.createAlert({
        type: 'pulse_high',
        message: `High pulse rate detected: ${healthData.pulseRate} BPM`,
        severity: 'high',
        healthDataId: healthData._id
      });
      alerts.push(alert);
    }

    // Check SpO2 alerts
    if (healthData.spo2 < 90) {
      const alert = await this.createAlert({
        type: 'spo2_low',
        message: `Low oxygen saturation detected: ${healthData.spo2}%`,
        severity: 'critical',
        healthDataId: healthData._id
      });
      alerts.push(alert);
    }

    // Check for emergency conditions
    if (healthData.pulseRate < 50 || healthData.pulseRate > 120 || healthData.spo2 < 90) {
      const emergencyAlert = await this.createAlert({
        type: 'emergency',
        message: `Emergency condition detected! Pulse: ${healthData.pulseRate} BPM, SpO2: ${healthData.spo2}%`,
        severity: 'critical',
        healthDataId: healthData._id
      });
      alerts.push(emergencyAlert);

      // Send emergency notifications
      await this.sendEmergencyNotifications(healthData);
    }

    return alerts;
  }

  async createAlert(alertData) {
    const alert = new Alert(alertData);
    await alert.save();
    return alert;
  }

  async sendEmergencyNotifications(healthData) {
    try {
      // Send email alert
      await emailService.sendEmergencyAlert(healthData);
      
      // Send SMS alert
      await smsService.sendEmergencySMS(healthData);
      
      console.log('Emergency notifications sent successfully');
    } catch (error) {
      console.error('Error sending emergency notifications:', error);
    }
  }

  async getAlerts(limit = 50, skip = 0) {
    return await Alert.find()
      .populate('healthDataId')
      .sort({ timestamp: -1 })
      .limit(limit)
      .skip(skip);
  }

  async markAlertAsRead(alertId) {
    return await Alert.findByIdAndUpdate(
      alertId,
      { isRead: true },
      { new: true }
    );
  }

  async markAlertAsResolved(alertId) {
    return await Alert.findByIdAndUpdate(
      alertId,
      { isResolved: true },
      { new: true }
    );
  }

  async getUnreadAlertsCount() {
    return await Alert.countDocuments({ isRead: false });
  }
}

module.exports = new AlertService();
