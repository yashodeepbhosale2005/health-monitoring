# Deployment Guide

This guide covers deploying the Health Monitoring Smart Band application to production environments.

## 🚀 Quick Deployment Options

### Option 1: Local Development
```bash
# Install dependencies
npm run install-all

# Start MongoDB
mongod

# Start application
npm run dev
```

### Option 2: Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d
```

### Option 3: Cloud Deployment
- Frontend: Netlify, Vercel, or AWS S3
- Backend: Heroku, DigitalOcean, or AWS EC2
- Database: MongoDB Atlas

## 📦 Docker Setup

### Dockerfile (Backend)
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY server/package*.json ./
RUN npm install --production

COPY server/ .

EXPOSE 5000

CMD ["npm", "start"]
```

### Dockerfile (Frontend)
```dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY client/package*.json ./
RUN npm install

COPY client/ .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:5.0
    container_name: health_monitoring_db
    restart: unless-stopped
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_DATABASE: health_monitoring
    volumes:
      - mongodb_data:/data/db

  backend:
    build:
      context: .
      dockerfile: server/Dockerfile
    container_name: health_monitoring_api
    restart: unless-stopped
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongodb:27017/health_monitoring
      - PORT=5000
    depends_on:
      - mongodb
    volumes:
      - ./server/.env:/app/.env

  frontend:
    build:
      context: .
      dockerfile: client/Dockerfile
    container_name: health_monitoring_web
    restart: unless-stopped
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mongodb_data:
```

## ☁️ Cloud Deployment

### Frontend (Netlify)

1. **Build the frontend:**
```bash
cd client
npm run build
```

2. **Deploy to Netlify:**
   - Connect GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `build`
   - Add environment variable: `REACT_APP_API_URL=https://your-api-domain.com/api`

### Backend (Heroku)

1. **Create Heroku app:**
```bash
heroku create health-monitoring-api
```

2. **Set environment variables:**
```bash
heroku config:set MONGODB_URI=your_mongodb_atlas_uri
heroku config:set EMAIL_USER=your_email@gmail.com
heroku config:set EMAIL_PASS=your_app_password
heroku config:set TWILIO_ACCOUNT_SID=your_twilio_sid
heroku config:set TWILIO_AUTH_TOKEN=your_twilio_token
heroku config:set TWILIO_PHONE_NUMBER=your_twilio_number
heroku config:set EMERGENCY_EMAIL=emergency@example.com
heroku config:set EMERGENCY_PHONE=+1234567890
```

3. **Deploy:**
```bash
git subtree push --prefix server heroku main
```

### Database (MongoDB Atlas)

1. **Create cluster:**
   - Sign up at MongoDB Atlas
   - Create new cluster
   - Choose region and tier

2. **Configure access:**
   - Add IP addresses to whitelist
   - Create database user
   - Get connection string

3. **Update environment:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/health_monitoring
```

## 🔧 Environment Configuration

### Production Environment Variables

```env
# Server
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/health_monitoring

# Email (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# SMS (Twilio)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Emergency Contacts
EMERGENCY_EMAIL=emergency@example.com
EMERGENCY_PHONE=+1234567890

# Security
JWT_SECRET=your_very_secure_jwt_secret_here
```

### Frontend Environment Variables

```env
# .env.production
REACT_APP_API_URL=https://your-api-domain.com/api
REACT_APP_SOCKET_URL=https://your-api-domain.com
```

## 🛡️ Security Considerations

### Backend Security
- Use HTTPS in production
- Implement rate limiting
- Add CORS configuration
- Use environment variables for secrets
- Implement input validation
- Add request logging

### Frontend Security
- Use HTTPS
- Implement CSP headers
- Sanitize user inputs
- Use secure cookies
- Implement proper error handling

## 📊 Monitoring & Logging

### Application Monitoring
- Use PM2 for process management
- Implement health checks
- Set up error tracking (Sentry)
- Monitor database performance
- Track API response times

### Logging Setup
```javascript
// Add to server/index.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy Health Monitoring App

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm run install-all
      - run: npm test

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: cd client && npm install && npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./client/build

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: "health-monitoring-api"
          heroku_email: "your-email@example.com"
```

## 🧪 Testing in Production

### Health Checks
```bash
# Test API health
curl https://your-api-domain.com/api/health

# Test data endpoint
curl -X POST https://your-api-domain.com/api/data \
  -H "Content-Type: application/json" \
  -d '{"pulseRate":75,"spo2":98,"steps":1000,"calories":50}'

# Test frontend
curl https://your-frontend-domain.com
```

### Load Testing
```bash
# Install artillery
npm install -g artillery

# Create load test
artillery quick --count 100 --num 10 https://your-api-domain.com/api/health
```

## 🔧 Maintenance

### Database Maintenance
- Regular backups
- Index optimization
- Data archiving
- Performance monitoring

### Application Updates
- Zero-downtime deployments
- Database migrations
- Feature flags
- Rollback procedures

### Security Updates
- Regular dependency updates
- Security patches
- Vulnerability scanning
- Access review

## 📈 Scaling Considerations

### Horizontal Scaling
- Load balancers
- Multiple server instances
- Database sharding
- CDN for static assets

### Performance Optimization
- Database indexing
- Caching strategies
- API rate limiting
- Image optimization

## 🆘 Troubleshooting

### Common Production Issues

**Database Connection Failed:**
- Check MongoDB Atlas whitelist
- Verify connection string
- Check network connectivity

**Email Not Sending:**
- Verify Gmail app password
- Check SMTP settings
- Review email quotas

**SMS Not Working:**
- Verify Twilio credentials
- Check phone number format
- Review account balance

**Frontend Not Loading:**
- Check API URL configuration
- Verify CORS settings
- Check build process

## 📞 Support

For deployment issues:
- Check logs for error messages
- Verify environment variables
- Test individual components
- Review security settings

---

**Deployment Complete!** 🎉 Your Health Monitoring Smart Band is now live and ready to track health data.
