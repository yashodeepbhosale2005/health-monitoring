import React, { useState } from 'react';
import { Send, RefreshCw } from 'lucide-react';

const TestDataForm = ({ onSubmit, darkMode }) => {
  const [formData, setFormData] = useState({
    pulseRate: 75,
    spo2: 98,
    steps: 0,
    calories: 0,
    deviceId: 'test_device'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      // Reset form after successful submission
      setFormData(prev => ({
        ...prev,
        pulseRate: 75,
        spo2: 98,
        steps: prev.steps + Math.floor(Math.random() * 100),
        calories: prev.calories + Math.floor(Math.random() * 10)
      }));
    } catch (error) {
      console.error('Error submitting test data:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateRandomData = () => {
    setFormData({
      pulseRate: Math.floor(Math.random() * 60) + 60, // 60-120 BPM
      spo2: Math.floor(Math.random() * 10) + 90, // 90-100%
      steps: Math.floor(Math.random() * 1000),
      calories: Math.floor(Math.random() * 50),
      deviceId: 'test_device'
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="pulseRate" className={`block text-sm font-medium mb-1 ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Pulse Rate (BPM)
          </label>
          <input
            type="number"
            id="pulseRate"
            name="pulseRate"
            value={formData.pulseRate}
            onChange={handleChange}
            min="30"
            max="200"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
            required
          />
        </div>
        
        <div>
          <label htmlFor="spo2" className={`block text-sm font-medium mb-1 ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            SpO₂ (%)
          </label>
          <input
            type="number"
            id="spo2"
            name="spo2"
            value={formData.spo2}
            onChange={handleChange}
            min="70"
            max="100"
            step="0.1"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
            required
          />
        </div>
        
        <div>
          <label htmlFor="steps" className={`block text-sm font-medium mb-1 ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Steps
          </label>
          <input
            type="number"
            id="steps"
            name="steps"
            value={formData.steps}
            onChange={handleChange}
            min="0"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          />
        </div>
        
        <div>
          <label htmlFor="calories" className={`block text-sm font-medium mb-1 ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Calories
          </label>
          <input
            type="number"
            id="calories"
            name="calories"
            value={formData.calories}
            onChange={handleChange}
            min="0"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="deviceId" className={`block text-sm font-medium mb-1 ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Device ID
        </label>
        <input
          type="text"
          id="deviceId"
          name="deviceId"
          value={formData.deviceId}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        />
      </div>
      
      <div className="flex items-center space-x-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary flex items-center space-x-2"
        >
          {isSubmitting ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          <span>{isSubmitting ? 'Sending...' : 'Send Test Data'}</span>
        </button>
        
        <button
          type="button"
          onClick={generateRandomData}
          className="btn-secondary flex items-center space-x-2"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Generate Random</span>
        </button>
      </div>
      
      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        <p>💡 This form simulates data from your Arduino/ESP32 device.</p>
        <p>In production, this data would come from actual sensors via WiFi/Bluetooth.</p>
      </div>
    </form>
  );
};

export default TestDataForm;
