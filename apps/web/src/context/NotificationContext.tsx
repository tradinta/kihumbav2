'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { useAuth } from './AuthContext';
import { useAbly } from './AblyContext';
import { useSnackbar } from './SnackbarContext';

export interface Notification {
    id: string;
    type: 'LIKE' | 'COMMENT' | 'FOLLOW' | 'MENTION' | 'ORDER_UPDATE';
    isRead: boolean;
    recipientId: string;
    senderId?: string;
    sender?: {
        id: string;
        username: string;
        fullName: string;
        avatar: string;
        isVerified: boolean;
    };
    postId?: string;
    commentId?: string;
    createdAt: string;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    isLoading: boolean;
    loadNotifications: (reset?: boolean) => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    hasMore: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [cursor, setCursor] = useState<string | null>(null);

    const { user } = useAuth();
    const { ably } = useAbly();
    const { show } = useSnackbar();

    const loadNotifications = useCallback(async (reset = false) => {
        if (!user) return;
        setIsLoading(true);
        try {
            const currentCursor = reset ? undefined : cursor;
            const res = await api.get(`/notifications?limit=20${currentCursor ? `&cursor=${currentCursor}` : ''}`);
            
            if (reset) {
                setNotifications(res.notifications);
            } else {
                setNotifications(prev => [...prev, ...res.notifications]);
            }
            
            setHasMore(res.hasMore);
            setCursor(res.nextCursor);
            
            // Initial unread count calculation
            if (reset) {
                const unread = res.notifications.filter((n: any) => !n.isRead).length;
                setUnreadCount(unread);
            }
        } catch (err) {
            console.error('Failed to load notifications:', err);
        } finally {
            setIsLoading(false);
        }
    }, [user, cursor]);

    const markAsRead = async (id: string) => {
        try {
            await api.patch(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error('Failed to mark notification as read:', err);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.patch('/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error('Failed to mark all as read:', err);
        }
    };

    // Real-time listener
    useEffect(() => {
        if (!user || !ably) return;

        const channel = ably.channels.get(`user:${user.id}:notifications`);
        
        channel.subscribe('notification', (msg) => {
            const newNotif = msg.data as Notification;
            setNotifications(prev => [newNotif, ...prev]);
            setUnreadCount(prev => prev + 1);

            // Trigger premium feedback
            let message = '';
            switch (newNotif.type) {
                case 'FOLLOW': message = `@${newNotif.sender?.username} started following you`; break;
                case 'LIKE': message = `@${newNotif.sender?.username} liked your curation`; break;
                case 'COMMENT': message = `@${newNotif.sender?.username} shared a thought on your post`; break;
                default: message = 'New interaction received';
            }

            show({ message, type: 'info' });
        });

        return () => {
            channel.unsubscribe();
        };
    }, [user, ably, show]);

    useEffect(() => {
        if (user) {
            loadNotifications(true);
        } else {
            setNotifications([]);
            setUnreadCount(0);
        }
    }, [user]);

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            isLoading,
            loadNotifications,
            markAsRead,
            markAllAsRead,
            hasMore
        }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
}
