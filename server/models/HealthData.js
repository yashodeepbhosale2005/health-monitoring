const mongoose = require('mongoose');

const healthDataSchema = new mongoose.Schema({
  pulseRate: {
    type: Number,
    required: true,
    min: 0,
    max: 300
  },
  spo2: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  steps: {
    type: Number,
    default: 0,
    min: 0
  },
  calories: {
    type: Number,
    default: 0,
    min: 0
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  deviceId: {
    type: String,
    default: 'default_device'
  },
  isEmergency: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient queries
healthDataSchema.index({ timestamp: -1 });
healthDataSchema.index({ deviceId: 1, timestamp: -1 });

// Virtual for checking if data indicates emergency
healthDataSchema.virtual('isDangerous').get(function() {
  return this.pulseRate < 50 || this.pulseRate > 120 || this.spo2 < 90;
});

module.exports = mongoose.model('HealthData', healthDataSchema);
