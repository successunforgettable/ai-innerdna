import { useEffect, useRef, useState } from 'react';

const useWebSocket = (url) => {
  const [connectionStatus, setConnectionStatus] = useState('Connecting');
  const [lastMessage, setLastMessage] = useState(null);
  const ws = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const isConnectingRef = useRef(false);

  const connect = () => {
    if (isConnectingRef.current) return;
    
    try {
      isConnectingRef.current = true;
      const wsUrl = url || `ws://localhost:5000`;
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log('🔗 WebSocket connected');
        setConnectionStatus('Connected');
        reconnectAttemptsRef.current = 0;
        isConnectingRef.current = false;
      };

      ws.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('📨 WebSocket message received:', message);
          setLastMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.current.onclose = () => {
        console.log('❌ WebSocket disconnected');
        setConnectionStatus('Disconnected');
        isConnectingRef.current = false;
        
        // Attempt to reconnect with exponential backoff
        if (reconnectAttemptsRef.current < 3) {
          const delay = Math.min(2000 * Math.pow(2, reconnectAttemptsRef.current), 8000);
          console.log(`🔄 Attempting to reconnect in ${delay}ms...`);
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++;
            setConnectionStatus('Connecting');
            connect();
          }, delay);
        } else {
          setConnectionStatus('Error');
          console.error('❌ Max reconnection attempts reached');
        }
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionStatus('Error');
        isConnectingRef.current = false;
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setConnectionStatus('Error');
      isConnectingRef.current = false;
    }
  };

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (ws.current) {
        ws.current.close();
      }
      isConnectingRef.current = false;
    };
  }, [url]);

  const sendMessage = (message) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected, cannot send message');
    }
  };

  return {
    connectionStatus,
    lastMessage,
    sendMessage
  };
};

export default useWebSocket;