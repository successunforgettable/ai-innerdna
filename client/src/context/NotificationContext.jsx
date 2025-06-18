import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      // Try to load from JSON file
      const response = await fetch('/src/data/notifications.json');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Validate data structure
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid data format');
      }
      
      const notifications = data.notifications || [];
      const userNotifications = data.userNotifications || [];
      
      setNotifications(notifications);
      calculateUnreadCount(userNotifications);
      
      console.log(`✅ Loaded ${notifications.length} notifications successfully`);
      
    } catch (error) {
      console.error('❌ Error loading notifications:', error.message);
      
      // Set fallback data
      const fallbackNotifications = [
        {
          id: 'fallback_001',
          title: 'System Notification',
          message: 'Notification system is working! (Using fallback data)',
          type: 'system',
          createdAt: new Date().toISOString(),
          isActive: true,
          targetAudience: 'all',
          priority: 'normal'
        }
      ];
      
      setNotifications(fallbackNotifications);
      setUnreadCount(1);
      
      console.log('🔄 Using fallback notification data');
    }
  };

  const calculateUnreadCount = (userNotifications) => {
    const unread = userNotifications.filter(n => !n.isRead).length;
    setUnreadCount(unread);
  };

  const markAsRead = (notificationId) => {
    setUnreadCount(prev => Math.max(0, prev - 1));
    
    // Track analytics - increment open count
    trackNotificationOpen(notificationId);
  };

  const trackNotificationOpen = (notificationId) => {
    try {
      // Get existing global analytics
      const globalAnalytics = JSON.parse(localStorage.getItem('notification_global_analytics') || '{}');
      
      // Update global analytics
      const updatedGlobalAnalytics = {
        totalNotifications: globalAnalytics.totalNotifications || 1,
        totalSent: globalAnalytics.totalSent || 1,
        totalOpened: (globalAnalytics.totalOpened || 0) + 1,
        globalOpenRate: 0,
        lastUpdated: new Date().toISOString()
      };
      
      // Calculate open rate
      updatedGlobalAnalytics.globalOpenRate = (updatedGlobalAnalytics.totalOpened / updatedGlobalAnalytics.totalSent * 100).toFixed(1);
      
      localStorage.setItem('notification_global_analytics', JSON.stringify(updatedGlobalAnalytics));
      
      // Track individual notification analytics
      const notificationAnalytics = JSON.parse(localStorage.getItem(`notification_${notificationId}`) || '{}');
      const updatedNotificationAnalytics = {
        ...notificationAnalytics,
        opens: (notificationAnalytics.opens || 0) + 1,
        lastOpened: new Date().toISOString()
      };
      
      localStorage.setItem(`notification_${notificationId}`, JSON.stringify(updatedNotificationAnalytics));
      
      console.log(`Tracked notification open: ${notificationId}`, updatedGlobalAnalytics);
    } catch (error) {
      console.error('Error tracking notification open:', error);
    }
  };

  const toggleNotificationCenter = () => {
    setShowNotificationCenter(prev => !prev);
  };

  const value = {
    notifications,
    unreadCount,
    showNotificationCenter,
    markAsRead,
    toggleNotificationCenter,
    loadNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};