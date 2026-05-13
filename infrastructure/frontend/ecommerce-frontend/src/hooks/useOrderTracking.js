import { useEffect, useState, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

export const useOrderTracking = (userId) => {
  const [orders, setOrders] = useState([]);
  const [connected, setConnected] = useState(false);
  const [latestUpdate, setLatestUpdate] = useState(null);
  const stompClientRef = useRef(null);
  const subscriptionRef = useRef(null);

  useEffect(() => {
    if (!userId) {
      console.log('⏸️  No userId, skipping WebSocket connection');
      return;
    }

    console.log('🔌 Connecting WebSocket for user:', userId);

    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost/ws-order'),
      
      connectHeaders: {},
      
      debug: (str) => {
        console.log('🔍 STOMP:', str);
      },
      
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      onConnect: () => {
        console.log('✅ WebSocket connected');
        setConnected(true);

        const subscription = client.subscribe(`/topic/orders/${userId}`, (message) => {
          try {
            const updatedOrder = JSON.parse(message.body);
            console.log('📦 Order update received:', {
              id: updatedOrder.id,
              status: updatedOrder.status,
              hasLocation: !!updatedOrder.currentLocation,
              location: updatedOrder.currentLocation
            });

            // Update orders list
            setOrders((prev) => {
              const index = prev.findIndex((o) => o.id === updatedOrder.id);
              if (index >= 0) {
                // Update existing order
                const newOrders = [...prev];
                newOrders[index] = updatedOrder;
                console.log('🔄 Updated order in list at index:', index);
                return newOrders;
              }
              // Add new order
              console.log('➕ Adding new order to list');
              return [updatedOrder, ...prev];
            });

            // Set latest update for notification
            setLatestUpdate({ 
              order: updatedOrder, 
              timestamp: Date.now(),
              hasLocationUpdate: !!updatedOrder.currentLocation
            });
            
          } catch (err) {
            console.error('❌ Failed to parse order update:', err);
          }
        });

        subscriptionRef.current = subscription;
        console.log('📡 Subscribed to:', `/topic/orders/${userId}`);
      },

      onStompError: (frame) => {
        console.error('❌ STOMP error:', frame);
        setConnected(false);
      },

      onWebSocketClose: () => {
        console.log('🔌 WebSocket closed');
        setConnected(false);
      },

      onDisconnect: () => {
        console.log('🔌 Disconnected');
        setConnected(false);
      }
    });

    // Start connection
    client.activate();
    stompClientRef.current = client;

    // Cleanup
    return () => {
      if (subscriptionRef.current) {
        console.log('🔌 Unsubscribing...');
        subscriptionRef.current.unsubscribe();
      }
      if (client) {
        console.log('🔌 Deactivating WebSocket...');
        client.deactivate();
      }
    };
  }, [userId]);

  return { orders, setOrders, connected, latestUpdate };
};