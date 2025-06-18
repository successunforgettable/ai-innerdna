import React from 'react';
import { motion } from 'framer-motion';
import { useNotifications } from '../../context/NotificationContext';
import styles from './connection.module.css';

const ConnectionStatus = () => {
  const { connectionStatus } = useNotifications();

  const getStatusConfig = () => {
    switch (connectionStatus) {
      case 'Connected':
        return {
          color: '#10b981',
          icon: '🟢',
          text: 'Live',
          pulse: false
        };
      case 'Connecting':
        return {
          color: '#f59e0b',
          icon: '🟡',
          text: 'Connecting',
          pulse: true
        };
      case 'Disconnected':
        return {
          color: '#ef4444',
          icon: '🔴',
          text: 'Offline',
          pulse: false
        };
      case 'Error':
        return {
          color: '#ef4444',
          icon: '⚠️',
          text: 'Error',
          pulse: false
        };
      default:
        return {
          color: '#6b7280',
          icon: '⚪',
          text: 'Unknown',
          pulse: false
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <motion.div
      className={styles.connectionStatus}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className={styles.statusIndicator}
        animate={statusConfig.pulse ? { scale: [1, 1.2, 1] } : {}}
        transition={statusConfig.pulse ? { repeat: Infinity, duration: 1.5 } : {}}
      >
        <span className={styles.statusIcon}>{statusConfig.icon}</span>
        <span 
          className={styles.statusText}
          style={{ color: statusConfig.color }}
        >
          {statusConfig.text}
        </span>
      </motion.div>
    </motion.div>
  );
};

export default ConnectionStatus;