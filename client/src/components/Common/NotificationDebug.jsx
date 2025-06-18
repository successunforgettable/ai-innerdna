import React, { useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';

const NotificationDebug = () => {
  const [showDebug, setShowDebug] = useState(false);
  const { notifications, unreadCount } = useNotifications();

  if (!showDebug) {
    return (
      <div style={{ 
        position: 'fixed', 
        bottom: '20px', 
        left: '20px', 
        zIndex: 1000 
      }}>
        <button
          onClick={() => setShowDebug(true)}
          style={{
            background: '#6b7280',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          Debug Notifications
        </button>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      background: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      padding: '16px',
      maxWidth: '300px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      zIndex: 1000,
      fontSize: '12px'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '12px'
      }}>
        <h4 style={{ margin: 0, fontSize: '14px' }}>Notification Debug</h4>
        <button
          onClick={() => setShowDebug(false)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '16px',
            cursor: 'pointer',
            color: '#6b7280'
          }}
        >
          ×
        </button>
      </div>
      
      <div style={{ marginBottom: '8px' }}>
        <strong>Unread Count:</strong> {unreadCount}
      </div>
      
      <div style={{ marginBottom: '8px' }}>
        <strong>Total Notifications:</strong> {notifications.length}
      </div>
      
      <div style={{ marginBottom: '12px' }}>
        <strong>Notifications:</strong>
        {notifications.length === 0 ? (
          <div style={{ color: '#ef4444', marginTop: '4px' }}>
            ❌ No notifications loaded
          </div>
        ) : (
          <div style={{ marginTop: '4px' }}>
            {notifications.map((notif, index) => (
              <div key={notif.id} style={{ 
                padding: '4px',
                background: '#f8fafc',
                marginBottom: '4px',
                borderRadius: '4px'
              }}>
                {index + 1}. {notif.title}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <button
        onClick={() => {
          console.log('🔍 Notification System Debug Info:');
          console.log('Notifications:', notifications);
          console.log('Unread Count:', unreadCount);
          console.log('Current URL:', window.location.href);
        }}
        style={{
          background: '#3b82f6',
          color: 'white',
          border: 'none',
          padding: '6px 12px',
          borderRadius: '4px',
          fontSize: '12px',
          cursor: 'pointer',
          width: '100%'
        }}
      >
        Log to Console
      </button>
    </div>
  );
};

export default NotificationDebug;