const twilio = require('twilio');

class SMSService {
  constructor() {
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  }

  async sendEmergencySMS(healthData) {
    const message = `🚨 EMERGENCY ALERT - Critical health data detected!
Pulse: ${healthData.pulseRate} BPM
SpO₂: ${healthData.spo2}%
Time: ${new Date(healthData.timestamp).toLocaleString()}
Please check on the patient immediately!`;

    try {
      const result = await this.client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: process.env.EMERGENCY_PHONE
      });
      
      console.log('Emergency SMS sent successfully:', result.sid);
      return true;
    } catch (error) {
      console.error('Error sending emergency SMS:', error);
      return false;
    }
  }

  async sendHealthUpdateSMS(message) {
    try {
      const result = await this.client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: process.env.EMERGENCY_PHONE
      });
      
      console.log('Health update SMS sent successfully:', result.sid);
      return true;
    } catch (error) {
      console.error('Error sending health update SMS:', error);
      return false;
    }
  }
}

module.exports = new SMSService();
