# GitHub Pages Deployment Guide

This guide will help you deploy your Pulse & Health Monitoring Smart Band React application to GitHub Pages.

## 🚀 Quick Deployment Steps

### 1. Update Repository Settings

1. **Update the homepage URL** in `client/package.json`:
   ```json
   {
     "homepage": "https://YOUR_USERNAME.github.io/pulse-rate-monitor"
   }
   ```
   Replace `YOUR_USERNAME` with your actual GitHub username.

2. **Update the canonical URL** in `client/public/index.html`:
   ```html
   <link rel="canonical" href="https://YOUR_USERNAME.github.io/pulse-rate-monitor" />
   ```

### 2. Configure GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select **GitHub Actions**
5. The deployment will be handled automatically by the workflow

### 3. Enable GitHub Actions

1. Go to **Actions** tab in your repository
2. Click **I understand my workflows, go ahead and enable them**
3. The workflow will run automatically on every push to main branch

### 4. Deploy Your Application

```bash
# Clone your repository (if not already done)
git clone https://github.com/YOUR_USERNAME/pulse-rate-monitor.git
cd pulse-rate-monitor

# Install dependencies
npm run install-all

# Make your changes and commit
git add .
git commit -m "Initial commit with React app"
git push origin main
```

## 🔧 Configuration Details

### Environment Variables

The application uses the following environment variables:

```bash
# For local development
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000

# For production (GitHub Pages)
REACT_APP_API_URL=https://your-api-domain.com/api
REACT_APP_SOCKET_URL=https://your-api-domain.com
```

### GitHub Actions Workflow

The `.github/workflows/deploy.yml` file handles automatic deployment:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: |
        cd client
        npm install

    - name: Build
      run: |
        cd client
        npm run build

    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./client/build
```

## 📱 Features Included

### Landing Page
- **Hero Section** with animated health metrics
- **Features Section** showcasing key capabilities
- **How It Works** step-by-step guide
- **Future Scope** upcoming features
- **About Project** detailed information
- **Responsive Design** for all devices

### Dashboard
- **Real-time Charts** using Chart.js
- **Live Data Simulation** with random values
- **Emergency Alerts** for critical readings
- **PDF Download Button** for monthly reports
- **Dark Mode Toggle** for better UX
- **Test Data Generator** for development

### Modern UI Features
- **Framer Motion** animations
- **Lucide React** icons
- **TailwindCSS** styling
- **Dark/Light Mode** support
- **Mobile Responsive** design
- **SEO Optimized** meta tags

## 🛠️ Customization

### Update Branding

1. **Change App Name**:
   - Update `client/public/index.html` title
   - Update `client/src/components/LandingPage.js` title
   - Update `client/public/manifest.json` name

2. **Change Colors**:
   - Update `client/tailwind.config.js` color scheme
   - Modify primary colors in components

3. **Update Content**:
   - Edit `client/src/components/LandingPage.js` sections
   - Modify feature descriptions and content

### Add Custom Domain

1. **Create CNAME file**:
   ```bash
   echo "your-domain.com" > client/public/CNAME
   ```

2. **Update GitHub Actions**:
   ```yaml
   - name: Deploy to GitHub Pages
     uses: peaceiris/actions-gh-pages@v3
     with:
       github_token: ${{ secrets.GITHUB_TOKEN }}
       publish_dir: ./client/build
       cname: your-domain.com
   ```

3. **Configure DNS**:
   - Add CNAME record pointing to `YOUR_USERNAME.github.io`

## 🔍 Troubleshooting

### Common Issues

1. **Build Fails**:
   - Check Node.js version (requires 18+)
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Deployment Fails**:
   - Ensure GitHub Actions are enabled
   - Check repository permissions
   - Verify workflow file syntax

3. **Page Not Loading**:
   - Check homepage URL in package.json
   - Verify GitHub Pages is enabled
   - Check browser console for errors

4. **Styling Issues**:
   - Ensure TailwindCSS is properly configured
   - Check for missing CSS classes
   - Verify dark mode implementation

### Debug Steps

1. **Local Testing**:
   ```bash
   cd client
   npm start
   ```

2. **Build Testing**:
   ```bash
   cd client
   npm run build
   npx serve -s build
   ```

3. **Check Logs**:
   - GitHub Actions logs in repository
   - Browser developer tools
   - Network tab for API calls

## 📊 Performance Optimization

### Build Optimization

1. **Code Splitting**:
   - React.lazy() for component loading
   - Dynamic imports for heavy libraries

2. **Asset Optimization**:
   - Image compression
   - Font optimization
   - CSS purging

3. **Caching**:
   - Service worker implementation
   - Browser caching headers
   - CDN integration

### Monitoring

1. **Analytics**:
   - Google Analytics integration
   - Performance monitoring
   - Error tracking

2. **Health Checks**:
   - API endpoint monitoring
   - Uptime monitoring
   - Performance metrics

## 🚀 Advanced Features

### PWA Support

Add Progressive Web App features:

1. **Service Worker**:
   ```javascript
   // public/sw.js
   self.addEventListener('fetch', (event) => {
     // Cache strategies
   });
   ```

2. **Offline Support**:
   - Cache static assets
   - Offline data storage
   - Sync when online

### Backend Integration

1. **API Configuration**:
   - Update API URLs
   - Configure CORS
   - Add authentication

2. **Real-time Updates**:
   - WebSocket connection
   - Live data streaming
   - Push notifications

## 📝 Maintenance

### Regular Updates

1. **Dependencies**:
   ```bash
   npm update
   npm audit fix
   ```

2. **Security**:
   - Regular security audits
   - Dependency vulnerability checks
   - HTTPS enforcement

3. **Performance**:
   - Bundle size monitoring
   - Performance profiling
   - User experience metrics

## 🎉 Success!

Your Pulse & Health Monitoring Smart Band application is now live on GitHub Pages!

**Live URL**: `https://YOUR_USERNAME.github.io/pulse-rate-monitor`

### Next Steps

1. **Test the Application**:
   - Verify all features work
   - Test on different devices
   - Check performance

2. **Share Your Project**:
   - Add to your portfolio
   - Share on social media
   - Write a blog post

3. **Continuous Improvement**:
   - Gather user feedback
   - Add new features
   - Optimize performance

---

**Happy Deploying!** 🚀

For any issues or questions, check the troubleshooting section or create an issue in the repository.
