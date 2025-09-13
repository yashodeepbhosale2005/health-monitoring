import React from 'react';
import { X, Activity, BarChart3, AlertTriangle, Settings, FileText, Home, Sun, Moon } from 'lucide-react';
import { useDarkMode } from '../context/DarkModeContext';

const Sidebar = ({ isOpen, onClose, darkMode, onNavigateToLanding }) => {
  const { toggleDarkMode } = useDarkMode();
  const menuItems = [
    { icon: Home, label: 'Home', href: '#', onClick: onNavigateToLanding, active: false },
    { icon: Activity, label: 'Dashboard', href: '/', active: true },
    { icon: BarChart3, label: 'Analytics', href: '/analytics', active: false },
    { icon: AlertTriangle, label: 'Alerts', href: '/alerts', active: false },
    { icon: FileText, label: 'Reports', href: '/reports', active: false },
    { icon: Settings, label: 'Settings', href: '/settings', active: false },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 z-50 h-full w-64 shadow-lg transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
        ${darkMode ? 'bg-gray-900' : 'bg-white'}
      `}>
        <div className={`flex items-center justify-between p-6 border-b ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center space-x-2">
            <Activity className="h-8 w-8 text-primary-600" />
            <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Health Monitor
            </h1>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-md lg:hidden transition-colors ${
              darkMode 
                ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="mt-6">
          <div className="px-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={item.onClick || (() => {})}
                  className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 w-full text-left
                    ${item.active 
                      ? darkMode
                        ? 'bg-primary-900 text-primary-300 border-r-2 border-primary-600'
                        : 'bg-primary-100 text-primary-700 border-r-2 border-primary-600'
                      : darkMode
                        ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>
        
        <div className={`absolute bottom-0 left-0 right-0 p-6 border-t ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="space-y-4">
            <button
              onClick={toggleDarkMode}
              className={`flex items-center space-x-2 w-full p-2 rounded-md transition-colors ${
                darkMode 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span className="text-sm">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            
            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <p>Health Monitoring v1.0</p>
              <p>© 2024 Smart Band</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
