import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './notification.module.css';

const LoginNotification = ({ user, onClose }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (user) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        if (onClose) onClose();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [user, onClose]);

  if (!show || !user) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={styles.loginNotification}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <div className={styles.loginContent}>
          <div className={styles.welcomeIcon}>👋</div>
          <div className={styles.welcomeText}>
            <h4>Welcome back, {user.firstName || 'there'}!</h4>
            <p>Ready to explore your Inner DNA?</p>
          </div>
          <button 
            className={styles.closeNotification}
            onClick={() => setShow(false)}
          >
            ×
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoginNotification;