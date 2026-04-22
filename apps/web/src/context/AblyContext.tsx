'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import * as Ably from 'ably';
import { api } from '@/lib/api';
import { useSnackbar } from './SnackbarContext';
import { useAuth } from './AuthContext';

interface AblyContextType {
  ably: Ably.Realtime | null;
  status: string;
  subscribeToRoom: (roomId: string, callback: (message: any) => void) => () => void;
  publishToRoom: (roomId: string, eventName: string, data: any) => Promise<void>;
  subscribeToPresence: (roomId: string, callback: (presence: Ably.PresenceMessage[]) => void) => () => void;
  setActiveRoomId: (id: string | null) => void;
}

const AblyContext = createContext<AblyContextType | undefined>(undefined);

export function AblyProvider({ children }: { children: React.ReactNode }) {
  const [ably, setAbly] = useState<Ably.Realtime | null>(null);
  const [status, setStatus] = useState('disconnected');
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const clientRef = useRef<Ably.Realtime | null>(null);
  const { show } = useSnackbar();
  const { user } = useAuth();
  const activeRoomRef = useRef<string | null>(null);

  useEffect(() => {
    activeRoomRef.current = activeRoomId;
  }, [activeRoomId]);

  useEffect(() => {
    let isMounted = true;

    async function initAbly() {
      try {
        // Only initialize if not already connected
        if (clientRef.current) return;

        const client = new Ably.Realtime({
          authCallback: async (params, callback) => {
            try {
              const tokenRequest = await api.get('/chat/token');
              callback(null, tokenRequest);
            } catch (err: any) {
              console.error('Ably authCallback failed:', err);
              callback(err, null);
            }
          },
        });

        client.connection.on('connected', () => {
          if (isMounted) {
            setStatus('connected');
            setAbly(client);
            clientRef.current = client;

            // Global Notifications Listener
            if (user?.id) {
               const notifyChannel = client.channels.get(`user:${user.id}`);
               notifyChannel.subscribe('notification.message', (msg) => {
                  const { roomId, message: msgData } = msg.data;
                  // Only notify if NOT in the same room
                  if (roomId !== activeRoomRef.current) {
                     show({
                        message: `${msgData.senderName}: ${msgData.content.substring(0, 50)}${msgData.content.length > 50 ? '...' : ''}`,
                        type: 'info',
                        action: {
                           label: 'OPEN',
                           onClick: () => window.location.href = `/messages/${roomId}`
                        }
                     });
                  }
               });
            }
          }
        });

        client.connection.on('disconnected', () => {
          if (isMounted) setStatus('disconnected');
        });

        client.connection.on('failed', () => {
          if (isMounted) setStatus('failed');
        });

      } catch (err) {
        console.error('Ably initialization failed:', err);
        if (isMounted) setStatus('error');
      }
    }

    initAbly();

    return () => {
      isMounted = false;
      if (clientRef.current) {
        clientRef.current.close();
        clientRef.current = null;
      }
    };
  }, []);

  const subscribeToRoom = useCallback((roomId: string, callback: (message: any) => void) => {
    if (!ably) return () => {};

    const channel = ably.channels.get(`room:${roomId}`);
    channel.subscribe('message.created', (msg) => {
      callback(msg.data);
    });

    return () => {
      channel.unsubscribe('message.created');
    };
  }, [ably]);

  const publishToRoom = useCallback(async (roomId: string, eventName: string, data: any) => {
    if (!ably) return;
    const channel = ably.channels.get(`room:${roomId}`);
    await channel.publish(eventName, data);
  }, [ably]);

  const subscribeToPresence = useCallback((roomId: string, callback: (presence: Ably.PresenceMessage[]) => void) => {
    if (!ably) return () => {};

    const channel = ably.channels.get(`room:${roomId}`);
    
    // Initial fetch
    channel.presence.get().then(members => {
      if (members) callback(members);
    }).catch(err => {
      console.error('Failed to get initial presence:', err);
    });

    // Subscribe to changes
    channel.presence.subscribe(['enter', 'leave', 'present'], () => {
      channel.presence.get().then(members => {
        if (members) callback(members);
      }).catch(err => {
        console.error('Failed to update presence:', err);
      });
    });

    // Enter presence
    channel.presence.enter();

    return () => {
      channel.presence.unsubscribe();
      channel.presence.leave();
    };
  }, [ably]);

  return (
    <AblyContext.Provider value={{ ably, status, subscribeToRoom, publishToRoom, subscribeToPresence, setActiveRoomId }}>
      {children}
    </AblyContext.Provider>
  );
}

export function useAbly() {
  const context = useContext(AblyContext);
  if (context === undefined) {
    throw new Error('useAbly must be used within an AblyProvider');
  }
  return context;
}
