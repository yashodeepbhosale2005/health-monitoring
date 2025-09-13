import React, { useState } from 'react';
import { useHealthData } from '../context/HealthDataContext';
import { useAlerts } from '../context/AlertContext';
import MetricCard from './MetricCard';
import ChartComponent from './ChartComponent';
import AlertsPanel from './AlertsPanel';
import TestDataForm from './TestDataForm';
import { RefreshCw, Activity, Heart, Droplets, Footprints, Flame, Download } from 'lucide-react';

const Dashboard = ({ darkMode }) => {
  const { healthData, latestData, stats, loading, refreshData, sendTestData } = useHealthData();
  const { alerts, unreadCount } = useAlerts();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setIsRefreshing(false);
  };

  const handleTestData = async (data) => {
    try {
      await sendTestData(data);
    } catch (error) {
      console.error('Error sending test data:', error);
    }
  };

  const handleDownloadReport = () => {
    // For now, this is a dummy function
    // In production, this would call the backend API to generate and download the PDF
    alert('PDF report generation will be implemented with backend integration');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading health data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Health Dashboard
          </h1>
          <p className={`mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Real-time health monitoring and analytics
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleDownloadReport}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Download Monthly Report (PDF)</span>
          </button>
          
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="btn-primary flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Emergency Alert Banner */}
      {latestData && (latestData.pulseRate < 50 || latestData.pulseRate > 120 || latestData.spo2 < 90) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Activity className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Emergency Alert
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  Critical health data detected! 
                  {latestData.pulseRate < 50 && ` Low pulse rate: ${latestData.pulseRate} BPM`}
                  {latestData.pulseRate > 120 && ` High pulse rate: ${latestData.pulseRate} BPM`}
                  {latestData.spo2 < 90 && ` Low oxygen saturation: ${latestData.spo2}%`}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Pulse Rate"
          value={latestData?.pulseRate || 0}
          unit="BPM"
          icon={Heart}
          color="red"
          status={latestData?.pulseRate < 50 || latestData?.pulseRate > 120 ? 'danger' : 'normal'}
          trend={stats?.averagePulse ? (latestData?.pulseRate - stats.averagePulse) : 0}
        />
        <MetricCard
          title="SpO₂"
          value={latestData?.spo2 || 0}
          unit="%"
          icon={Droplets}
          color="blue"
          status={latestData?.spo2 < 90 ? 'danger' : 'normal'}
          trend={stats?.averageSpo2 ? (latestData?.spo2 - stats.averageSpo2) : 0}
        />
        <MetricCard
          title="Steps"
          value={latestData?.steps || 0}
          unit="steps"
          icon={Footprints}
          color="green"
          status="normal"
          trend={0}
        />
        <MetricCard
          title="Calories"
          value={latestData?.calories || 0}
          unit="cal"
          icon={Flame}
          color="orange"
          status="normal"
          trend={0}
        />
      </div>

        {/* Charts and Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Health Chart */}
          <div className="lg:col-span-2">
            <ChartComponent data={healthData} darkMode={darkMode} />
          </div>
          
          {/* Alerts Panel */}
          <div className="lg:col-span-1">
            <AlertsPanel alerts={alerts} unreadCount={unreadCount} darkMode={darkMode} />
          </div>
        </div>

      {/* Test Data Form */}
      <div className={`card ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Test Data Generator
        </h2>
        <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Use this form to simulate sensor data from your Arduino/ESP32 device.
        </p>
        <TestDataForm onSubmit={handleTestData} darkMode={darkMode} />
      </div>

      {/* Statistics Summary */}
      {stats && (
        <div className={`card ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            24-Hour Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary-600">{stats.averagePulse}</p>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Avg Pulse (BPM)</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.averageSpo2}%</p>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Avg SpO₂</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.totalSteps.toLocaleString()}</p>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Steps</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{stats.totalCalories.toLocaleString()}</p>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Calories</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
