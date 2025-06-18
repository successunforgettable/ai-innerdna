// Polling-based notification hook (replaces WebSocket)
import { useState, useEffect, useRef } from 'react';

const useWebSocket = (url) => {
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const [lastMessage, setLastMessage] = useState(null);
  const intervalRef = useRef(null);
  const lastTimestampRef = useRef(0);

  // Polling function to check for new notifications
  const pollNotifications = async () => {
    try {
      const response = await fetch(`/api/notifications/recent?since=${lastTimestampRef.current}`);
      if (response.ok) {
        const data = await response.json();
        setConnectionStatus('Live');
        
        if (data.notifications && data.notifications.length > 0) {
          // Send the most recent notification as lastMessage
          setLastMessage({
            data: JSON.stringify({
              type: 'new_notification',
              data: data.notifications[0]
            })
          });
          lastTimestampRef.current = data.timestamp;
        }
      } else {
        setConnectionStatus('Error');
      }
    } catch (error) {
      console.error('Polling error:', error);
      setConnectionStatus('Error');
    }
  };

  useEffect(() => {
    // Start polling every 2 seconds
    setConnectionStatus('Connecting...');
    pollNotifications(); // Initial poll
    
    intervalRef.current = setInterval(pollNotifications, 2000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [url]);

  const sendMessage = (message) => {
    console.log('Sending message via polling:', message);
  };

  return {
    connectionStatus,
    lastMessage,
    sendMessage
  };
};

export default useWebSocket;