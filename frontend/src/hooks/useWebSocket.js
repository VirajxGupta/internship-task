import { useEffect, useRef, useState, useCallback } from 'react';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:5001';

/**
 * Custom hook for WebSocket connection with auto-reconnect.
 * Used for real-time search.
 */
export function useWebSocket() {
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const [status, setStatus] = useState('disconnected'); // 'connecting' | 'connected' | 'disconnected'
  const [results, setResults] = useState(null);
  const [lastQuery, setLastQuery] = useState('');

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    setStatus('connecting');

    try {
      const ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        console.log('🔌 WebSocket connected');
        setStatus('connected');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'results') {
            setResults(data.posts);
            setLastQuery(data.query);
          } else if (data.type === 'error') {
            console.error('WebSocket error:', data.message);
          }
        } catch (e) {
          console.error('Failed to parse WebSocket message:', e);
        }
      };

      ws.onclose = () => {
        console.log('🔌 WebSocket disconnected');
        setStatus('disconnected');
        wsRef.current = null;

        // Auto-reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 3000);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        ws.close();
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      setStatus('disconnected');
    }
  }, []);

  const sendSearch = useCallback((query) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'search', query }));
    }
  }, []);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return { status, results, lastQuery, sendSearch, connect };
}
