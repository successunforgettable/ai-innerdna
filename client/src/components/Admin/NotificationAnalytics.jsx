import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './admin.module.css';

const NotificationAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    totalNotifications: 0,
    totalSent: 0,
    totalOpened: 0,
    globalOpenRate: 0,
    globalEngagementRate: 0,
    recentNotifications: [],
    typeBreakdown: {},
    audienceBreakdown: {}
  });

  useEffect(() => {
    // Load analytics data from notifications.json
    const loadAnalytics = async () => {
      try {
        const response = await fetch('/src/data/notifications.json');
        const data = await response.json();
        
        const notifications = data.notifications || [];
        const userNotifications = data.userNotifications || [];
        
        // Calculate analytics
        const totalNotifications = notifications.length;
        const totalSent = userNotifications.length;
        const totalOpened = userNotifications.filter(un => un.openedAt).length;
        const globalOpenRate = totalSent > 0 ? ((totalOpened / totalSent) * 100).toFixed(1) : 0;
        
        // Type breakdown
        const typeBreakdown = {};
        notifications.forEach(notif => {
          typeBreakdown[notif.type] = (typeBreakdown[notif.type] || 0) + 1;
        });
        
        // Audience breakdown
        const audienceBreakdown = {};
        notifications.forEach(notif => {
          audienceBreakdown[notif.targetAudience] = (audienceBreakdown[notif.targetAudience] || 0) + 1;
        });
        
        setAnalyticsData({
          totalNotifications,
          totalSent,
          totalOpened,
          globalOpenRate,
          globalEngagementRate: globalOpenRate, // Simplified for demo
          recentNotifications: notifications.slice(-5),
          typeBreakdown,
          audienceBreakdown
        });
      } catch (error) {
        console.error('Error loading analytics:', error);
        // Set fallback analytics data
        setAnalyticsData({
          totalNotifications: 1,
          totalSent: 1,
          totalOpened: 0,
          globalOpenRate: 0,
          globalEngagementRate: 0,
          recentNotifications: [{
            id: 'demo',
            title: 'Welcome to Inner DNA',
            type: 'welcome',
            targetAudience: 'all',
            createdAt: new Date().toISOString()
          }],
          typeBreakdown: { welcome: 1 },
          audienceBreakdown: { all: 1 }
        });
      }
    };

    loadAnalytics();
  }, []);

  return (
    <motion.div 
      className={styles.analyticsSection}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h3>Notification Analytics</h3>
      
      {/* Key Metrics */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricValue}>{analyticsData.totalNotifications}</div>
          <div className={styles.metricLabel}>Total Notifications</div>
        </div>
        
        <div className={styles.metricCard}>
          <div className={styles.metricValue}>{analyticsData.totalSent}</div>
          <div className={styles.metricLabel}>Total Sent</div>
        </div>
        
        <div className={styles.metricCard}>
          <div className={styles.metricValue}>{analyticsData.totalOpened}</div>
          <div className={styles.metricLabel}>Total Opened</div>
        </div>
        
        <div className={styles.metricCard}>
          <div className={styles.metricValue}>{analyticsData.globalOpenRate}%</div>
          <div className={styles.metricLabel}>Open Rate</div>
        </div>
      </div>

      {/* Type Breakdown */}
      <div className={styles.breakdownSection}>
        <h4>Notification Types</h4>
        <div className={styles.breakdownGrid}>
          {Object.entries(analyticsData.typeBreakdown).map(([type, count]) => (
            <div key={type} className={styles.breakdownItem}>
              <span className={styles.breakdownType}>{type}</span>
              <span className={styles.breakdownCount}>{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Audience Breakdown */}
      <div className={styles.breakdownSection}>
        <h4>Target Audiences</h4>
        <div className={styles.breakdownGrid}>
          {Object.entries(analyticsData.audienceBreakdown).map(([audience, count]) => (
            <div key={audience} className={styles.breakdownItem}>
              <span className={styles.breakdownType}>{audience.replace('_', ' ')}</span>
              <span className={styles.breakdownCount}>{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Notifications */}
      <div className={styles.recentSection}>
        <h4>Recent Notifications</h4>
        <div className={styles.recentList}>
          {analyticsData.recentNotifications.map(notification => (
            <div key={notification.id} className={styles.recentItem}>
              <div className={styles.recentTitle}>{notification.title}</div>
              <div className={styles.recentMeta}>
                <span className={styles.recentType}>{notification.type}</span>
                <span className={styles.recentAudience}>{notification.targetAudience}</span>
                <span className={styles.recentDate}>
                  {new Date(notification.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationAnalytics;