import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import api from '../services/api';

const HealthDataContext = createContext();

export const useHealthData = () => {
  const context = useContext(HealthDataContext);
  if (!context) {
    throw new Error('useHealthData must be used within a HealthDataProvider');
  }
  return context;
};

export const HealthDataProvider = ({ children }) => {
  const [healthData, setHealthData] = useState([]);
  const [latestData, setLatestData] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initialize socket connection
    const socket = io('http://localhost:5000');
    
    socket.on('healthDataUpdate', (data) => {
      setLatestData(data.healthData);
      setHealthData(prev => [data.healthData, ...prev.slice(0, 99)]); // Keep last 100 records
    });

    // Fetch initial data
    fetchInitialData();

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [dataResponse, statsResponse, latestResponse] = await Promise.all([
        api.get('/data?limit=50'),
        api.get('/data/stats'),
        api.get('/data/latest')
      ]);

      if (dataResponse.data.success) {
        setHealthData(dataResponse.data.data);
      }

      if (statsResponse.data.success) {
        setStats(statsResponse.data.data);
      }

      if (latestResponse.data.success) {
        setLatestData(latestResponse.data.data);
      }

    } catch (err) {
      setError(err.message);
      console.error('Error fetching initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    await fetchInitialData();
  };

  const sendTestData = async (data) => {
    try {
      const response = await api.post('/data', data);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    healthData,
    latestData,
    stats,
    loading,
    error,
    refreshData,
    sendTestData
  };

  return (
    <HealthDataContext.Provider value={value}>
      {children}
    </HealthDataContext.Provider>
  );
};
