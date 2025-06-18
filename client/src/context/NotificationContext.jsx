import React, { createContext, useContext, useState, useEffect } from 'react';
import useWebSocket from '../hooks/useWebSocket';
import notificationSounds from '../utils/notificationSounds';

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

  // WebSocket connection
  const { connectionStatus, lastMessage } = useWebSocket();

  // Listen for real-time notifications
  useEffect(() => {
    if (lastMessage && lastMessage.data) {
      try {
        const messageData = lastMessage.data;
        
        if (messageData.type === 'new_notification' && messageData.data) {
          console.log('🔔 Real-time notification received:', messageData.data);
          
          // Add new notification to existing list
          setNotifications(prev => [messageData.data, ...prev]);
          
          // Increment unread count
          setUnreadCount(prev => prev + 1);
          
          // Play notification sound based on priority
          const soundType = messageData.data.priority === 'high' ? 'high' : 'default';
          notificationSounds.playNotificationSound(soundType);
          
          // Optional: Show browser notification if permission granted
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(messageData.data.title, {
              body: messageData.data.message,
              icon: '/favicon.ico',
              tag: messageData.data.id // Prevent duplicate notifications
            });
          }
        }
      } catch (error) {
        console.log('Error parsing notification message:', error);
      }
    }
  }, [lastMessage]);

  // Request notification permission on load
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('Notification permission:', permission);
      });
    }
  }, []);

  useEffect(() => {
    loadNotifications();
    
    // Set up global refresh function for admin notifications
    window.refreshNotifications = loadNotifications;
    
    return () => {
      window.refreshNotifications = null;
    };
  }, []);

  const loadNotifications = async () => {
    try {
      // Load from both JSON file and localStorage (for admin-created notifications)
      const response = await fetch('/src/data/notifications.json');
      let baseNotifications = [];
      
      if (response.ok) {
        const data = await response.json();
        baseNotifications = data.notifications || [];
      }
      
      // Load admin-created notifications from localStorage
      const activeNotifications = JSON.parse(localStorage.getItem('active_notifications') || '[]');
      
      // Combine all notifications
      const allNotifications = [...baseNotifications, ...activeNotifications];
      
      // Load read status from localStorage
      const readNotifications = JSON.parse(localStorage.getItem('read_notifications') || '[]');
      
      // Filter out read notifications and count unread
      const unreadNotifications = allNotifications.filter(notif => 
        !readNotifications.includes(notif.id)
      );
      
      setNotifications(allNotifications);
      setUnreadCount(unreadNotifications.length);
      
      console.log(`✅ Loaded ${allNotifications.length} notifications successfully`);
      
    } catch (error) {
      console.error('❌ Error loading notifications:', error.message);
      
      // Set fallback data
      const fallbackNotifications = [
        {
          id: 'fallback_001',
          title: 'System Notification',
          message: 'Notification system is working!',
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
    // Add to read notifications list
    const readNotifications = JSON.parse(localStorage.getItem('read_notifications') || '[]');
    if (!readNotifications.includes(notificationId)) {
      readNotifications.push(notificationId);
      localStorage.setItem('read_notifications', JSON.stringify(readNotifications));
    }
    
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
    connectionStatus, // Add this line
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