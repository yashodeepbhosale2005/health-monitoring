# Health Monitoring Smart Band

A comprehensive web application for real-time health monitoring with Arduino/ESP32 integration, featuring real-time data visualization, emergency alerts, and automated reporting.

## 🚀 Features

### Frontend (React + TailwindCSS)
- **Real-time Dashboard** - Live health metrics display
- **Interactive Charts** - Pulse rate and SpO₂ trends
- **Emergency Alerts** - Critical health condition notifications
- **Responsive Design** - Works on desktop and mobile devices
- **Test Data Generator** - Simulate sensor data for testing

### Backend (Node.js + Express + MongoDB)
- **RESTful API** - Complete data management endpoints
- **Real-time Updates** - Socket.io for live data streaming
- **Emergency Notifications** - Email and SMS alerts
- **PDF Reports** - Automated monthly health reports
- **Data Analytics** - Statistics and trend analysis

### Health Metrics
- **Pulse Rate (BPM)** - Heart rate monitoring with alerts
- **SpO₂ (%)** - Blood oxygen saturation tracking
- **Steps Count** - Daily activity monitoring
- **Calories Burned** - Energy expenditure tracking

### Alert System
- **Critical Alerts** - Pulse < 50 or > 120 BPM
- **Low Oxygen** - SpO₂ < 90%
- **Email Notifications** - Emergency contact alerts
- **SMS Alerts** - Twilio integration for urgent notifications

## 🛠️ Technology Stack

### Frontend
- React 18
- TailwindCSS
- Recharts (Data visualization)
- Socket.io Client
- Axios (HTTP client)
- Lucide React (Icons)

### Backend
- Node.js
- Express.js
- MongoDB
- Socket.io
- Nodemailer (Email)
- Twilio (SMS)
- Chart.js (PDF generation)
- Puppeteer (PDF rendering)

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn
- Git

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd pulse-rate-monitor
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install all dependencies (frontend + backend)
npm run install-all
```

### 3. Environment Setup
```bash
# Copy environment template
cp server/env.example server/.env

# Edit server/.env with your configuration
```

Required environment variables:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/health_monitoring
JWT_SECRET=your_jwt_secret_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
EMERGENCY_EMAIL=emergency@example.com
EMERGENCY_PHONE=+1234567890
```

### 4. Start MongoDB
```bash
# Start MongoDB service
mongod
```

### 5. Run the Application
```bash
# Start both frontend and backend
npm run dev

# Or start individually:
npm run server  # Backend only
npm run client  # Frontend only
```

### 6. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/api/health

## 📱 Usage

### Dashboard
1. **View Real-time Data** - Monitor current health metrics
2. **Check Alerts** - Review any health warnings or emergencies
3. **Generate Test Data** - Use the test form to simulate sensor data
4. **View Trends** - Analyze health data over time

### Test Data Generator
Use the built-in test data form to simulate Arduino/ESP32 sensor data:
1. Enter pulse rate (30-200 BPM)
2. Enter SpO₂ percentage (70-100%)
3. Add steps and calories
4. Click "Send Test Data" to simulate sensor transmission

### Emergency Alerts
The system automatically detects critical conditions:
- **Low Pulse**: < 50 BPM
- **High Pulse**: > 120 BPM  
- **Low SpO₂**: < 90%

When detected, the system will:
- Display emergency banner on dashboard
- Send email to emergency contact
- Send SMS via Twilio (if configured)

## 🔌 Arduino/ESP32 Integration

See [ARDUINO_INTEGRATION.md](./ARDUINO_INTEGRATION.md) for detailed hardware setup and code examples.

### Quick Arduino Setup:
1. Connect heart rate sensor (MAX30102)
2. Connect SpO₂ sensor
3. Upload provided Arduino code
4. Configure WiFi credentials
5. Set server URL to your backend IP

## 📊 API Endpoints

### Health Data
- `POST /api/data` - Send sensor data
- `GET /api/data` - Get recent readings
- `GET /api/data/stats` - Get statistics
- `GET /api/data/latest` - Get latest reading

### Alerts
- `GET /api/alerts` - Get all alerts
- `GET /api/alerts/count` - Get unread count
- `PUT /api/alerts/:id/read` - Mark as read
- `PUT /api/alerts/:id/resolve` - Mark as resolved
- `DELETE /api/alerts/:id` - Delete alert

### Reports
- `GET /api/report/monthly` - Generate monthly PDF
- `GET /api/report/stats` - Get report statistics

## 📈 Data Flow

1. **Arduino/ESP32** reads sensor data
2. **WiFi transmission** sends data to backend
3. **Backend API** processes and stores data
4. **Real-time updates** via Socket.io to frontend
5. **Alert system** checks for critical conditions
6. **Dashboard** displays live data and trends

## 🔧 Configuration

### Email Setup (Gmail)
1. Enable 2-factor authentication
2. Generate app password
3. Use app password in `EMAIL_PASS`

### SMS Setup (Twilio)
1. Create Twilio account
2. Get Account SID and Auth Token
3. Purchase phone number
4. Configure in environment variables

### MongoDB Setup
- Local: `mongodb://localhost:27017/health_monitoring`
- Cloud: Use MongoDB Atlas connection string

## 🚀 Deployment

### Frontend (Netlify/Vercel)
```bash
cd client
npm run build
# Deploy build folder
```

### Backend (Heroku/DigitalOcean)
```bash
cd server
# Deploy with environment variables
```

### Database (MongoDB Atlas)
- Create cluster on MongoDB Atlas
- Update `MONGODB_URI` in environment variables

## 🧪 Testing

### Manual Testing
1. Use test data form to send sample data
2. Verify real-time updates on dashboard
3. Test emergency alerts with critical values
4. Generate PDF reports

### API Testing
```bash
# Test data endpoint
curl -X POST http://localhost:5000/api/data \
  -H "Content-Type: application/json" \
  -d '{"pulseRate":75,"spo2":98,"steps":1000,"calories":50}'

# Test health check
curl http://localhost:5000/api/health
```

## 🔮 Future Enhancements

### Planned Features
- **User Authentication** - Multi-user support
- **Doctor Portal** - Healthcare provider access
- **Bluetooth Integration** - Direct device pairing
- **Mobile App** - React Native companion
- **AI Analysis** - Health pattern recognition
- **Cloud Storage** - Long-term data retention
- **Integration APIs** - Third-party health platforms

### Hardware Improvements
- **Battery Monitoring** - Device power status
- **Sleep Mode** - Power optimization
- **Multiple Sensors** - Temperature, pressure
- **Waterproof Design** - Wearable compatibility

## 🐛 Troubleshooting

### Common Issues

**Frontend not loading:**
- Check if backend is running on port 5000
- Verify proxy configuration in package.json

**Data not updating:**
- Check Socket.io connection
- Verify MongoDB connection
- Check browser console for errors

**Alerts not working:**
- Verify email/SMS configuration
- Check environment variables
- Test with critical values

**Arduino not connecting:**
- Check WiFi credentials
- Verify server IP address
- Monitor serial output

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📞 Support

For issues and questions:
- Create GitHub issue
- Check troubleshooting guide
- Review Arduino integration docs

## 🙏 Acknowledgments

- React and TailwindCSS communities
- Arduino and ESP32 communities
- Health monitoring sensor manufacturers
- Open source contributors

---

**Health Monitoring Smart Band** - Keeping you connected to your health, one heartbeat at a time. ❤️