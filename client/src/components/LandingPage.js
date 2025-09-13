import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Activity, 
  Shield, 
  BarChart3, 
  Smartphone, 
  Wifi, 
  Download,
  ArrowRight,
  CheckCircle,
  Star,
  Moon,
  Sun,
  Menu,
  X
} from 'lucide-react';

const LandingPage = ({ onNavigateToDashboard, darkMode, toggleDarkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    {
      icon: Heart,
      title: "Real-time Pulse Monitoring",
      description: "Continuous heart rate tracking with instant alerts for abnormal readings",
      color: "text-red-500"
    },
    {
      icon: Activity,
      title: "SpO₂ Oxygen Tracking",
      description: "Blood oxygen saturation monitoring for respiratory health",
      color: "text-blue-500"
    },
    {
      icon: Shield,
      title: "Emergency Alerts",
      description: "Instant notifications via email and SMS for critical health conditions",
      color: "text-green-500"
    },
    {
      icon: BarChart3,
      title: "Health Analytics",
      description: "Comprehensive reports and trend analysis for better health insights",
      color: "text-purple-500"
    }
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Wear the Smart Band",
      description: "Simply wear the comfortable smart band on your wrist for continuous monitoring"
    },
    {
      step: "02",
      title: "Real-time Data Collection",
      description: "Advanced sensors collect pulse rate, SpO₂, steps, and calories in real-time"
    },
    {
      step: "03",
      title: "WiFi Data Transmission",
      description: "Data is securely transmitted to our cloud platform via WiFi connection"
    },
    {
      step: "04",
      title: "Dashboard & Alerts",
      description: "View your health data on the dashboard and receive instant emergency alerts"
    }
  ];

  const futureScope = [
    "Bluetooth Low Energy (BLE) connectivity",
    "Multiple user account support",
    "Doctor access portal",
    "AI-powered health insights",
    "Integration with fitness apps",
    "Long-term data storage",
    "Mobile app companion",
    "Advanced sleep monitoring"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-colors duration-300 ${darkMode ? 'bg-gray-900/95 backdrop-blur-sm' : 'bg-white/95 backdrop-blur-sm'} border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Heart className="h-8 w-8 text-red-500" />
              <span className="text-xl font-bold">Pulse & Health Monitor</span>
            </motion.div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="hover:text-red-500 transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-red-500 transition-colors">How it Works</a>
              <a href="#about" className="hover:text-red-500 transition-colors">About</a>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <motion.button
                onClick={onNavigateToDashboard}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Dashboard
              </motion.button>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div 
            className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="px-4 py-4 space-y-4">
              <a href="#features" className="block hover:text-red-500 transition-colors">Features</a>
              <a href="#how-it-works" className="block hover:text-red-500 transition-colors">How it Works</a>
              <a href="#about" className="block hover:text-red-500 transition-colors">About</a>
              <button
                onClick={toggleDarkMode}
                className="flex items-center space-x-2 hover:text-red-500 transition-colors"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
              <button
                onClick={onNavigateToDashboard}
                className="w-full bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                View Dashboard
              </button>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-gradient">Pulse & Health Monitoring</span>
              <br />
              <span className="text-3xl md:text-5xl">Smart Band</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Real-time health tracking with intelligent alerts & comprehensive reports
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.button
                onClick={onNavigateToDashboard}
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-lg font-medium text-lg flex items-center space-x-2 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>View Dashboard</span>
                <ArrowRight className="h-5 w-5" />
              </motion.button>
              
              <motion.button
                className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-8 py-4 rounded-lg font-medium text-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="h-5 w-5 inline mr-2" />
                Download App
              </motion.button>
            </motion.div>
          </div>

          {/* Hero Image/Animation */}
          <motion.div 
            className="mt-16 relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <div className="bg-gradient-to-r from-red-500 to-blue-500 rounded-2xl p-8 mx-auto max-w-4xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                <div className="text-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                    <Heart className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-white font-semibold text-lg">Pulse Rate</h3>
                  <p className="text-white/80">75 BPM</p>
                </div>
                <div className="text-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                    <Activity className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-white font-semibold text-lg">SpO₂</h3>
                  <p className="text-white/80">98%</p>
                </div>
                <div className="text-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                    <BarChart3 className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-white font-semibold text-lg">Steps</h3>
                  <p className="text-white/80">8,432</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Features</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Advanced health monitoring capabilities designed for your well-being
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={`p-6 rounded-xl border transition-all duration-300 ${
                  currentFeature === index 
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                    : darkMode 
                      ? 'border-gray-700 bg-gray-800 hover:border-gray-600' 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <feature.icon className={`h-12 w-12 ${feature.color} mb-4`} />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Simple steps to start monitoring your health
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="bg-red-500 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Future Scope Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Future Scope</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Exciting features coming soon to enhance your health monitoring experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {futureScope.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-center space-x-3 p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Project Section */}
      <section id="about" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">About This Project</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                The Pulse & Health Monitoring Smart Band is a comprehensive health tracking solution 
                that combines cutting-edge sensor technology with intelligent data analysis. Our system 
                provides real-time monitoring of vital health metrics with instant alerts for critical conditions.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Built with modern web technologies and designed for seamless integration with Arduino/ESP32 
                hardware, this project represents the future of personal health monitoring.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-500 mb-2">24/7</div>
                  <div className="text-gray-600 dark:text-gray-300">Monitoring</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-500 mb-2">Real-time</div>
                  <div className="text-gray-600 dark:text-gray-300">Alerts</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-500 mb-2">99.9%</div>
                  <div className="text-gray-600 dark:text-gray-300">Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-500 mb-2">Cloud</div>
                  <div className="text-gray-600 dark:text-gray-300">Storage</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-red-500 to-blue-500 rounded-2xl p-8">
                <div className="text-white text-center">
                  <h3 className="text-2xl font-bold mb-4">Technology Stack</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                      <Smartphone className="h-8 w-8 mx-auto mb-2" />
                      <div className="font-semibold">React</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                      <Wifi className="h-8 w-8 mx-auto mb-2" />
                      <div className="font-semibold">Node.js</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                      <BarChart3 className="h-8 w-8 mx-auto mb-2" />
                      <div className="font-semibold">MongoDB</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                      <Activity className="h-8 w-8 mx-auto mb-2" />
                      <div className="font-semibold">Arduino</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Monitoring?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Experience the future of health monitoring with our smart band solution
            </p>
            <motion.button
              onClick={onNavigateToDashboard}
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-lg font-medium text-lg flex items-center space-x-2 mx-auto transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Get Started Now</span>
              <ArrowRight className="h-5 w-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="h-8 w-8 text-red-500" />
                <span className="text-xl font-bold">Pulse Monitor</span>
              </div>
              <p className="text-gray-400">
                Advanced health monitoring for a better tomorrow.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Real-time Monitoring</li>
                <li>Emergency Alerts</li>
                <li>Health Reports</li>
                <li>Data Analytics</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Technology</h3>
              <ul className="space-y-2 text-gray-400">
                <li>React & Node.js</li>
                <li>MongoDB Database</li>
                <li>Arduino Integration</li>
                <li>Cloud Storage</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>support@pulsemonitor.com</li>
                <li>+1 (555) 123-4567</li>
                <li>24/7 Emergency Support</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Pulse & Health Monitoring Smart Band. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
