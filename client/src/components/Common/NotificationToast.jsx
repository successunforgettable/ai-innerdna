import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './notification.module.css';

const NotificationToast = ({ notification, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // Wait for exit animation
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={styles.notificationToast}
        initial={{ opacity: 0, x: 300, scale: 0.8 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 300, scale: 0.8 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <div className={styles.toastContent}>
          <div className={styles.toastHeader}>
            <h4>{notification.title}</h4>
            <button onClick={() => setVisible(false)}>×</button>
          </div>
          <p>{notification.message}</p>
          {notification.priority === 'high' && (
            <div className={styles.toastPriority}>High Priority</div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NotificationToast;