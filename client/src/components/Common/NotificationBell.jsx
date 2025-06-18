import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNotifications } from '../../context/NotificationContext';
import notificationSounds from '../../utils/notificationSounds';
import styles from './notification.module.css';

const NotificationBell = () => {
  const { unreadCount, toggleNotificationCenter, connectionStatus } = useNotifications();
  const [soundEnabled, setSoundEnabled] = useState(notificationSounds.getSoundEnabled());

  const toggleSound = () => {
    const newSoundState = notificationSounds.toggleSound();
    setSoundEnabled(newSoundState);
  };

  return (
    <div className={styles.notificationBell}>
      <motion.button
        className={styles.bellButton}
        onClick={toggleNotificationCenter}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title={`Notifications (${connectionStatus})`}
      >
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        
        {unreadCount > 0 && (
          <motion.span
            className={styles.badge}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.span>
        )}
      </motion.button>

      {/* Sound Toggle Button */}
      <motion.button
        className={styles.soundButton}
        onClick={toggleSound}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title={soundEnabled ? 'Disable notification sounds' : 'Enable notification sounds'}
      >
        {soundEnabled ? '🔊' : '🔇'}
      </motion.button>
    </div>
  );
};

export default NotificationBell;