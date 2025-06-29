// Polling-based notification system
import { useState, useEffect, useRef } from 'react';

const useWebSocket = (url) => {
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const [lastMessage, setLastMessage] = useState(null);
  const intervalRef = useRef(null);
  const lastTimestampRef = useRef(0);

  // Poll for new notifications
  const pollNotifications = async () => {
    try {
      const response = await fetch(`/api/notifications/recent?since=${lastTimestampRef.current}`);
      if (response.ok) {
        const data = await response.json();
        setConnectionStatus('Connected');
        
        if (data.notifications && data.notifications.length > 0) {
          // Send newest notification as message
          const newestNotification = data.notifications[0];
          setLastMessage({
            data: {
              type: 'new_notification',
              data: newestNotification
            }
          });
          lastTimestampRef.current = data.timestamp || Date.now();
        }
      } else {
        setConnectionStatus('Error');
      }
    } catch (error) {
      // Silently handle polling errors to prevent runtime error overlay
      setConnectionStatus('Error');
    }
  };

  useEffect(() => {
    // Initial poll with error handling
    pollNotifications().catch(() => {
      // Silently handle initial poll errors
    });
    
    // Poll every 2 seconds
    intervalRef.current = setInterval(() => {
      pollNotifications().catch(() => {
        // Silently handle interval poll errors
      });
    }, 2000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const sendMessage = (message) => {
    console.log('Sending message:', message);
  };

  return {
    connectionStatus,
    lastMessage,
    sendMessage
  };
};

export default useWebSocket;