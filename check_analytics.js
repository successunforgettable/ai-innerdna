// Quick script to check localStorage analytics data
console.log('=== HISTORICAL ANALYTICS (Admin Dashboard) ===');
const historicalAnalytics = localStorage.getItem('notification_historical_analytics');
if (historicalAnalytics) {
  console.log('Historical Analytics Found:', JSON.parse(historicalAnalytics));
} else {
  console.log('No historical analytics found');
}

console.log('\n=== USER NOTIFICATIONS (Should be empty) ===');
const activeNotifications = localStorage.getItem('active_notifications');
console.log('Active Notifications:', activeNotifications ? JSON.parse(activeNotifications) : 'Empty');

console.log('\n=== READ STATUS ===');
const readNotifications = localStorage.getItem('read_notifications');
console.log('Read Notifications:', readNotifications ? JSON.parse(readNotifications) : 'Empty');

console.log('\n=== LEGACY ANALYTICS ===');
const globalAnalytics = localStorage.getItem('notification_global_analytics');
if (globalAnalytics) {
  console.log('Global Analytics:', JSON.parse(globalAnalytics));
} else {
  console.log('No global analytics found');
}