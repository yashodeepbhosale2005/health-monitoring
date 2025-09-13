const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['pulse_low', 'pulse_high', 'spo2_low', 'emergency'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: true
  },
  healthDataId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HealthData',
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  isResolved: {
    type: Boolean,
    default: false
  },
  notificationSent: {
    email: { type: Boolean, default: false },
    sms: { type: Boolean, default: false }
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
alertSchema.index({ timestamp: -1 });
alertSchema.index({ isRead: 1, isResolved: 1 });

module.exports = mongoose.model('Alert', alertSchema);
