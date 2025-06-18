import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../../context/NotificationContext';
import styles from './notification.module.css';

const NotificationCenter = () => {
  const { 
    notifications, 
    showNotificationCenter, 
    toggleNotificationCenter,
    markAsRead 
  } = useNotifications();

  if (!showNotificationCenter) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={styles.notificationOverlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={toggleNotificationCenter}
      >
        <motion.div
          className={styles.notificationCenter}
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.centerHeader}>
            <h3>Notifications</h3>
            <button 
              className={styles.closeButton}
              onClick={toggleNotificationCenter}
            >
              ×
            </button>
          </div>
          
          <div className={styles.notificationList}>
            {notifications.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onRead={markAsRead}
                />
              ))
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const NotificationItem = ({ notification, onRead }) => {
  const handleClick = () => {
    onRead(notification.id);
  };

  const getPriorityClass = () => {
    switch (notification.priority) {
      case 'high': return styles.highPriority;
      case 'low': return styles.lowPriority;
      default: return '';
    }
  };

  return (
    <motion.div
      className={`${styles.notificationItem} ${getPriorityClass()}`}
      whileHover={{ backgroundColor: '#f8fafc' }}
      onClick={handleClick}
    >
      <div className={styles.notificationContent}>
        <div className={styles.notificationHeader}>
          <h4>{notification.title}</h4>
          {notification.priority === 'high' && (
            <span className={styles.priorityBadge}>HIGH</span>
          )}
        </div>
        <p>{notification.message}</p>
        <span className={styles.timestamp}>
          {new Date(notification.createdAt).toLocaleDateString()}
        </span>
      </div>
    </motion.div>
  );
};

export default NotificationCenter;