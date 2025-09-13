import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AlertContext = createContext();

export const useAlerts = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlerts must be used within an AlertProvider');
  }
  return context;
};

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
    fetchUnreadCount();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/alerts?limit=20');
      if (response.data.success) {
        setAlerts(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await api.get('/alerts/count');
      if (response.data.success) {
        setUnreadCount(response.data.count);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const markAsRead = async (alertId) => {
    try {
      const response = await api.put(`/alerts/${alertId}/read`);
      if (response.data.success) {
        setAlerts(prev => 
          prev.map(alert => 
            alert._id === alertId ? { ...alert, isRead: true } : alert
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking alert as read:', error);
    }
  };

  const markAsResolved = async (alertId) => {
    try {
      const response = await api.put(`/alerts/${alertId}/resolve`);
      if (response.data.success) {
        setAlerts(prev => 
          prev.map(alert => 
            alert._id === alertId ? { ...alert, isResolved: true } : alert
          )
        );
      }
    } catch (error) {
      console.error('Error marking alert as resolved:', error);
    }
  };

  const deleteAlert = async (alertId) => {
    try {
      const response = await api.delete(`/alerts/${alertId}`);
      if (response.data.success) {
        setAlerts(prev => prev.filter(alert => alert._id !== alertId));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting alert:', error);
    }
  };

  const value = {
    alerts,
    unreadCount,
    loading,
    fetchAlerts,
    fetchUnreadCount,
    markAsRead,
    markAsResolved,
    deleteAlert
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
    </AlertContext.Provider>
  );
};
