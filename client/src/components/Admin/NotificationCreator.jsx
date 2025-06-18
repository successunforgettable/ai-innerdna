import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './admin.module.css';
import NotificationAnalytics from './NotificationAnalytics';

const NotificationCreator = () => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'general',
    priority: 'normal',
    targetAudience: 'all',
    personalityTypes: [],
    scheduledFor: '',
    isBulk: false,
    isActive: true
  });

  const [analytics, setAnalytics] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePersonalityTypeChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      personalityTypes: checked 
        ? [...prev.personalityTypes, value]
        : prev.personalityTypes.filter(type => type !== value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newNotification = {
        ...formData,
        id: `notif_${Date.now()}`,
        createdAt: new Date().toISOString(),
        analytics: {
          totalSent: 0,
          totalOpened: 0,
          openRate: 0,
          engagementRate: 0,
          lastUpdated: new Date().toISOString()
        }
      };

      // Determine if this is a bulk notification
      const isBulkNotification = formData.targetAudience === 'personality_types' && formData.personalityTypes.length > 0;
      newNotification.isBulk = isBulkNotification;
      
      console.log('✅ New notification created:', newNotification);
      
      // Initialize analytics for this notification
      initializeNotificationAnalytics(newNotification);
      
      // Show success message with better styling
      if (formData.scheduledFor) {
        showSuccessMessage(`📅 Notification scheduled for ${new Date(formData.scheduledFor).toLocaleString()}!`);
      } else if (isBulkNotification) {
        showSuccessMessage(`📢 Bulk notification created for personality types: ${formData.personalityTypes.join(', ')}!`);
      } else {
        showSuccessMessage('🎉 Notification created and sent successfully!');
      }
      
      // Reset form
      setFormData({
        title: '',
        message: '',
        type: 'general',
        priority: 'normal',
        targetAudience: 'all',
        personalityTypes: [],
        scheduledFor: '',
        isBulk: false,
        isActive: true
      });
    } catch (error) {
      console.error('❌ Error creating notification:', error);
      showErrorMessage('Failed to create notification. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const showSuccessMessage = (message) => {
    // Create a styled success notification
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
      z-index: 10000;
      font-weight: 600;
      max-width: 400px;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 4000);
  };

  const showErrorMessage = (message) => {
    // Create a styled error notification
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #ef4444, #dc2626);
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(239, 68, 68, 0.3);
      z-index: 10000;
      font-weight: 600;
      max-width: 400px;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 4000);
  };

  const initializeNotificationAnalytics = (notification) => {
    try {
      // Get or create global analytics
      const globalAnalytics = JSON.parse(localStorage.getItem('notification_global_analytics') || '{}');
      
      // Update global analytics
      const updatedGlobalAnalytics = {
        totalNotifications: (globalAnalytics.totalNotifications || 0) + 1,
        totalSent: (globalAnalytics.totalSent || 0) + 1,
        totalOpened: globalAnalytics.totalOpened || 0,
        globalOpenRate: 0,
        lastUpdated: new Date().toISOString()
      };
      
      // Calculate open rate
      if (updatedGlobalAnalytics.totalSent > 0) {
        updatedGlobalAnalytics.globalOpenRate = (updatedGlobalAnalytics.totalOpened / updatedGlobalAnalytics.totalSent * 100).toFixed(1);
      }
      
      localStorage.setItem('notification_global_analytics', JSON.stringify(updatedGlobalAnalytics));
      
      // Initialize individual notification analytics
      const notificationAnalytics = {
        id: notification.id,
        title: notification.title,
        type: notification.type,
        targetAudience: notification.targetAudience,
        sent: true,
        sentAt: new Date().toISOString(),
        opens: 0,
        openRate: 0,
        lastOpened: null
      };
      
      localStorage.setItem(`notification_${notification.id}`, JSON.stringify(notificationAnalytics));
      
      console.log(`Initialized analytics for notification: ${notification.id}`, updatedGlobalAnalytics);
    } catch (error) {
      console.error('Error initializing notification analytics:', error);
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
            <option value="personality_types">Specific Personality Types</option>
          </select>
        </div>

        {/* Personality Types Selection (Bulk Notifications) */}
        {formData.targetAudience === 'personality_types' && (
          <div className={styles.formGroup}>
            <label>Select Personality Types (Bulk Notification)</label>
            <div className={styles.personalityTypeGrid}>
              {[1,2,3,4,5,6,7,8,9].map(type => (
                <label key={type} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    value={type}
                    checked={formData.personalityTypes.includes(type.toString())}
                    onChange={handlePersonalityTypeChange}
                  />
                  <span>Type {type}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Scheduled Notifications */}
        <div className={styles.formGroup}>
          <label htmlFor="scheduledFor">Schedule For (Optional)</label>
          <input
            type="datetime-local"
            id="scheduledFor"
            name="scheduledFor"
            value={formData.scheduledFor}
            onChange={handleInputChange}
            min={new Date().toISOString().slice(0, 16)}
          />
          <small>Leave empty to send immediately</small>
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

      {/* Analytics Dashboard */}
      <NotificationAnalytics />
    </div>
  );
};

export default NotificationCreator;