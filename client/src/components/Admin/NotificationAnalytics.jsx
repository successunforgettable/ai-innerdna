import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './admin.module.css';
import { simulateNotificationOpen } from '@/utils/testNotificationAnalytics';

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

  const loadAnalytics = async () => {
    try {
      // Load persistent historical analytics (survives user clearing)
      const historicalAnalytics = JSON.parse(localStorage.getItem('notification_historical_analytics') || '{}');
      
      // Load current active notifications
      const activeNotifications = JSON.parse(localStorage.getItem('active_notifications') || '[]');
      
      // Load read status
      const readNotifications = JSON.parse(localStorage.getItem('read_notifications') || '[]');
      
      // Use historical data if available, otherwise calculate from current data
      let totalNotifications = historicalAnalytics.totalNotificationsSent || activeNotifications.length;
      let totalSent = totalNotifications;
      let totalOpened = historicalAnalytics.totalNotificationsOpened || 0;
      
      // If we have active notifications, add any new reads to the historical count
      if (activeNotifications.length > 0) {
        activeNotifications.forEach(notif => {
          if (readNotifications.includes(notif.id)) {
            // Check if this notification open was already counted
            const wasAlreadyCounted = historicalAnalytics.countedNotificationIds && 
                                    historicalAnalytics.countedNotificationIds.includes(notif.id);
            if (!wasAlreadyCounted) {
              totalOpened++;
            }
          }
        });
      }
      
      // Calculate realistic open rate
      const globalOpenRate = totalSent > 0 ? ((totalOpened / totalSent) * 100).toFixed(1) : 0;
      
      // Type and audience breakdown from historical + current data
      const typeBreakdown = { ...historicalAnalytics.typeBreakdown };
      const audienceBreakdown = { ...historicalAnalytics.audienceBreakdown };
      
      activeNotifications.forEach(notif => {
        typeBreakdown[notif.type] = (typeBreakdown[notif.type] || 0) + 1;
        audienceBreakdown[notif.targetAudience] = (audienceBreakdown[notif.targetAudience] || 0) + 1;
      });
      
      setAnalyticsData({
        totalNotifications,
        totalSent,
        totalOpened,
        globalOpenRate,
        globalEngagementRate: globalOpenRate,
        recentNotifications: activeNotifications.slice(-5),
        typeBreakdown,
        audienceBreakdown
      });
      
      console.log('Analytics loaded:', { totalNotifications, totalSent, totalOpened, globalOpenRate });
      
    } catch (error) {
      console.error('Error loading analytics:', error);
      setAnalyticsData({
        totalNotifications: 0,
        totalSent: 0,
        totalOpened: 0,
        globalOpenRate: 0,
        globalEngagementRate: 0,
        recentNotifications: [],
        typeBreakdown: {},
        audienceBreakdown: {}
      });
    }
  };

  const handleTestOpen = () => {
    const result = simulateNotificationOpen('fallback_001');
    if (result) {
      // Refresh analytics immediately
      setTimeout(() => {
        loadAnalytics();
      }, 100);
      
      // Show success message
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
      notification.textContent = `📊 Open rate increased to ${result.globalOpenRate}%`;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
    }
  };

  useEffect(() => {
    loadAnalytics();
    
    // Refresh analytics every 5 seconds to show real-time updates
    const interval = setInterval(loadAnalytics, 5000);
    return () => clearInterval(interval);
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
          <button 
            onClick={handleTestOpen}
            style={{
              marginTop: '12px',
              padding: '8px 16px',
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            Test Open Rate
          </button>
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