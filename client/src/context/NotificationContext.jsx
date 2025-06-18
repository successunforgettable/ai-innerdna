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
      const response = await fetch('/src/data/notifications.json');
      const data = await response.json();
      setNotifications(data.notifications || []);
      calculateUnreadCount(data.userNotifications || []);
    } catch (error) {
      console.error('Error loading notifications:', error);
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  const calculateUnreadCount = (userNotifications) => {
    const unread = userNotifications.filter(n => !n.isRead).length;
    setUnreadCount(unread);
  };

  const markAsRead = (notificationId) => {
    setUnreadCount(prev => Math.max(0, prev - 1));
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