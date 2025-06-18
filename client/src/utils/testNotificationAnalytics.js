// Test utility to simulate notification interactions for analytics testing

export const simulateNotificationOpen = (notificationId = 'fallback_001') => {
  try {
    // Get existing global analytics
    const globalAnalytics = JSON.parse(localStorage.getItem('notification_global_analytics') || '{}');
    
    // Update global analytics
    const updatedGlobalAnalytics = {
      totalNotifications: globalAnalytics.totalNotifications || 1,
      totalSent: globalAnalytics.totalSent || 1,
      totalOpened: (globalAnalytics.totalOpened || 0) + 1,
      globalOpenRate: 0,
      lastUpdated: new Date().toISOString()
    };
    
    // Calculate open rate
    updatedGlobalAnalytics.globalOpenRate = (updatedGlobalAnalytics.totalOpened / updatedGlobalAnalytics.totalSent * 100).toFixed(1);
    
    localStorage.setItem('notification_global_analytics', JSON.stringify(updatedGlobalAnalytics));
    
    // Track individual notification analytics
    const notificationAnalytics = JSON.parse(localStorage.getItem(`notification_${notificationId}`) || '{}');
    const updatedNotificationAnalytics = {
      ...notificationAnalytics,
      opens: (notificationAnalytics.opens || 0) + 1,
      lastOpened: new Date().toISOString()
    };
    
    localStorage.setItem(`notification_${notificationId}`, JSON.stringify(updatedNotificationAnalytics));
    
    console.log(`Simulated notification open: ${notificationId}`, updatedGlobalAnalytics);
    return updatedGlobalAnalytics;
  } catch (error) {
    console.error('Error simulating notification open:', error);
    return null;
  }
};

export const initializeTestAnalytics = () => {
  // Initialize analytics with baseline data
  const baselineAnalytics = {
    totalNotifications: 1,
    totalSent: 1,
    totalOpened: 0,
    globalOpenRate: 0,
    lastUpdated: new Date().toISOString()
  };
  
  localStorage.setItem('notification_global_analytics', JSON.stringify(baselineAnalytics));
  
  // Initialize fallback notification analytics
  const fallbackNotificationAnalytics = {
    id: 'fallback_001',
    title: 'System Notification',
    type: 'system',
    targetAudience: 'all',
    sent: true,
    sentAt: new Date().toISOString(),
    opens: 0,
    openRate: 0,
    lastOpened: null
  };
  
  localStorage.setItem('notification_fallback_001', JSON.stringify(fallbackNotificationAnalytics));
  
  console.log('Initialized test analytics:', baselineAnalytics);
  return baselineAnalytics;
};

// Auto-initialize on import in development
if (import.meta.env.DEV) {
  initializeTestAnalytics();
}