const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendHealthReport(email, reportData) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Monthly Health Report - Smart Band',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Monthly Health Report</h2>
          <p>Dear User,</p>
          <p>Please find your monthly health report attached.</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Summary</h3>
            <p><strong>Average Pulse Rate:</strong> ${reportData.averagePulse} BPM</p>
            <p><strong>Average SpO₂:</strong> ${reportData.averageSpo2}%</p>
            <p><strong>Total Steps:</strong> ${reportData.totalSteps.toLocaleString()}</p>
            <p><strong>Total Calories:</strong> ${reportData.totalCalories.toLocaleString()}</p>
          </div>
          <p>Best regards,<br>Health Monitoring Team</p>
        </div>
      `,
      attachments: [
        {
          filename: `health-report-${new Date().toISOString().split('T')[0]}.pdf`,
          content: reportData.pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Health report email sent successfully');
      return true;
    } catch (error) {
      console.error('Error sending health report email:', error);
      return false;
    }
  }

  async sendEmergencyAlert(healthData) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMERGENCY_EMAIL,
      subject: '🚨 EMERGENCY ALERT - Critical Health Data',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ef4444;">🚨 EMERGENCY ALERT</h2>
          <p><strong>Critical health data detected!</strong></p>
          <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
            <h3>Health Data</h3>
            <p><strong>Pulse Rate:</strong> ${healthData.pulseRate} BPM ${healthData.pulseRate < 50 || healthData.pulseRate > 120 ? '⚠️' : ''}</p>
            <p><strong>SpO₂:</strong> ${healthData.spo2}% ${healthData.spo2 < 90 ? '⚠️' : ''}</p>
            <p><strong>Timestamp:</strong> ${new Date(healthData.timestamp).toLocaleString()}</p>
            <p><strong>Device ID:</strong> ${healthData.deviceId}</p>
          </div>
          <p style="color: #ef4444;"><strong>Please check on the patient immediately!</strong></p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Emergency alert email sent successfully');
      return true;
    } catch (error) {
      console.error('Error sending emergency alert email:', error);
      return false;
    }
  }
}

module.exports = new EmailService();
