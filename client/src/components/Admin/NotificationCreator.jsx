import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './admin.module.css';

const NotificationCreator = () => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'general',
    priority: 'normal',
    targetAudience: 'all',
    isActive: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // For now, just log the notification data
      const newNotification = {
        ...formData,
        id: `notif_${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      
      console.log('New notification created:', newNotification);
      alert('Notification created successfully! (Check console for details)');
      
      // Reset form
      setFormData({
        title: '',
        message: '',
        type: 'general',
        priority: 'normal',
        targetAudience: 'all',
        isActive: true
      });
    } catch (error) {
      console.error('Error creating notification:', error);
      alert('Error creating notification');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.notificationCreator}>
      <h2>Create New Notification</h2>
      
      <motion.form
        className={styles.creatorForm}
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className={styles.formGroup}>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            maxLength={100}
            placeholder="Enter notification title"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            required
            maxLength={500}
            rows={4}
            placeholder="Enter notification message"
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="type">Type</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
            >
              <option value="general">General</option>
              <option value="welcome">Welcome</option>
              <option value="update">Update</option>
              <option value="promotion">Promotion</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="targetAudience">Target Audience</label>
          <select
            id="targetAudience"
            name="targetAudience"
            value={formData.targetAudience}
            onChange={handleInputChange}
          >
            <option value="all">All Users</option>
            <option value="new">New Users</option>
            <option value="returning">Returning Users</option>
            <option value="completed">Completed Assessment</option>
          </select>
        </div>

        <div className={styles.checkboxGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
            />
            <span>Active Notification</span>
          </label>
        </div>

        <motion.button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isSubmitting ? 'Creating...' : 'Create Notification'}
        </motion.button>
      </motion.form>
    </div>
  );
};

export default NotificationCreator;