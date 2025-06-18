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
          
          // Check if this notification already exists to prevent duplicates
          setNotifications(prev => {
            const exists = prev.some(notif => notif.id === messageData.data.id);
            if (exists) return prev;
            
            const newNotificationWithReadStatus = {
              ...messageData.data,
              isRead: false
            };
            
            return [newNotificationWithReadStatus, ...prev];
          });
          
          // Save to localStorage for persistence (check for duplicates)
          const activeNotifications = JSON.parse(localStorage.getItem('active_notifications') || '[]');
          const exists = activeNotifications.some(notif => notif.id === messageData.data.id);
          if (!exists) {
            activeNotifications.unshift(messageData.data);
            localStorage.setItem('active_notifications', JSON.stringify(activeNotifications));
            
            // Only increment unread count for new notifications
            setUnreadCount(prev => prev + 1);
          }
          
          // Play notification sound based on priority
          const soundType = messageData.data.priority === 'high' ? 'high' : 'default';
          notificationSounds.playNotificationSound(soundType);
          
          // Show browser notification if permission granted
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(messageData.data.title, {
              body: messageData.data.message,
              icon: '/favicon.ico',
              tag: messageData.data.id
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
      // Only load admin-created notifications from localStorage to avoid duplicates
      const activeNotifications = JSON.parse(localStorage.getItem('active_notifications') || '[]');
      
      // Load read status from localStorage
      const readNotifications = JSON.parse(localStorage.getItem('read_notifications') || '[]');
      
      // Remove duplicates based on ID
      const uniqueNotifications = activeNotifications.filter((notif, index, self) => 
        index === self.findIndex(n => n.id === notif.id)
      );
      
      // Mark notifications as read/unread based on localStorage
      const notificationsWithReadStatus = uniqueNotifications.map(notif => ({
        ...notif,
        isRead: readNotifications.includes(notif.id)
      }));
      
      // Count unread notifications
      const unreadCount = notificationsWithReadStatus.filter(notif => !notif.isRead).length;
      
      setNotifications(notificationsWithReadStatus);
      setUnreadCount(unreadCount);
      
      console.log(`✅ Loaded ${uniqueNotifications.length} notifications successfully`);
      
    } catch (error) {
      console.error('❌ Error loading notifications:', error.message);
      
      // Reset to empty state on error
      setNotifications([]);
      setUnreadCount(0);
      
      console.log('🔄 Reset to empty notification state');
    }
  };

  const calculateUnreadCount = (userNotifications) => {
    const unread = userNotifications.filter(n => !n.isRead).length;
    setUnreadCount(unread);
  };

  const markAsRead = (notificationId) => {
    // Check if notification is already read
    const readNotifications = JSON.parse(localStorage.getItem('read_notifications') || '[]');
    const isAlreadyRead = readNotifications.includes(notificationId);
    
    // Only process if not already read
    if (!isAlreadyRead) {
      // Mark as read in localStorage
      readNotifications.push(notificationId);
      localStorage.setItem('read_notifications', JSON.stringify(readNotifications));
      
      // Update notification state to mark as read
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, isRead: true }
            : notif
        )
      );
      
      // Only decrease unread count if it wasn't already read
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      // Track analytics - increment open count only once per notification
      trackNotificationOpen(notificationId);
    }
  };

  const trackNotificationOpen = async (notificationId) => {
    try {
      // Track on server for persistent analytics that survive restarts
      const response = await fetch('/api/notifications/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notificationId,
          action: 'opened'
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log(`Tracked notification open: ${notificationId}`, result.analytics);
      }
      
    } catch (error) {
      console.error('Error tracking notification open:', error);
    }
  };

  const toggleNotificationCenter = () => {
    setShowNotificationCenter(prev => !prev);
  };

  const clearAllNotifications = async () => {
    try {
      // Clear server-side notifications first
      const response = await fetch('/api/notifications/clear', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        console.log('🧹 Server notifications cleared');
      }
    } catch (error) {
      console.error('Failed to clear server notifications:', error);
    }
    
    // Only clear user-facing notification data, preserve admin analytics
    localStorage.removeItem('active_notifications');
    localStorage.removeItem('read_notifications');
    
    // DO NOT clear admin analytics data:
    // - notification_global_analytics (needed for admin dashboard)
    // - individual notification_* analytics (needed for tracking)
    
    // Reset user-facing state only
    setNotifications([]);
    setUnreadCount(0);
    
    // Force reload notifications to ensure clean state
    setTimeout(() => {
      loadNotifications();
    }, 100);
    
    console.log('📭 User notifications cleared (admin analytics preserved)');
  };

  const value = {
    notifications,
    unreadCount,
    showNotificationCenter,
    connectionStatus,
    markAsRead,
    toggleNotificationCenter,
    loadNotifications,
    clearAllNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};