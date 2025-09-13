import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import { HealthDataProvider } from './context/HealthDataContext';
import { AlertProvider } from './context/AlertContext';
import { DarkModeProvider, useDarkMode } from './context/DarkModeContext';

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('landing');
  const { darkMode } = useDarkMode();

  const navigateToDashboard = () => {
    setCurrentPage('dashboard');
  };

  const navigateToLanding = () => {
    setCurrentPage('landing');
  };

  if (currentPage === 'landing') {
    return (
      <LandingPage 
        onNavigateToDashboard={navigateToDashboard}
        darkMode={darkMode}
        toggleDarkMode={() => {}} // Will be handled by context
      />
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} darkMode={darkMode} />
      
      <div className="flex">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
          darkMode={darkMode}
          onNavigateToLanding={navigateToLanding}
        />
        
        <main className="flex-1 lg:ml-64">
          <div className="p-6">
            <Routes>
              <Route path="/" element={<Dashboard darkMode={darkMode} />} />
              <Route path="/dashboard" element={<Dashboard darkMode={darkMode} />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <DarkModeProvider>
      <HealthDataProvider>
        <AlertProvider>
          <Router>
            <AppContent />
          </Router>
        </AlertProvider>
      </HealthDataProvider>
    </DarkModeProvider>
  );
}

export default App;
