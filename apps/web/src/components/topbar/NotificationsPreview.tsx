'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Heart, MessageCircle, UserPlus, Repeat2, ShieldCheck,
  ShoppingBag, Store, ArrowUpRight, Bell, Star
} from 'lucide-react';

import { useNotifications, type Notification } from '@/context/NotificationContext';
import { timeAgo } from '@/lib/utils';
import UserIdentity from '../shared/UserIdentity';

const typeIcons: Record<Notification['type'], { icon: React.ElementType; color: string }> = {
  LIKE: { icon: Heart, color: 'text-red-400' },
  COMMENT: { icon: MessageCircle, color: 'text-blue-400' },
  FOLLOW: { icon: UserPlus, color: 'text-primary-gold' },
  MENTION: { icon: Repeat2, color: 'text-purple-400' },
  ORDER_UPDATE: { icon: ShoppingBag, color: 'text-green-400' },
};

interface Props {
  onClose: () => void;
}

export default function NotificationsPreview({ onClose }: Props) {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const getNotificationText = (notif: Notification) => {
    switch (notif.type) {
      case 'FOLLOW': return 'started following you';
      case 'LIKE': return 'liked your curation';
      case 'COMMENT': return 'shared a thought on your post';
      case 'MENTION': return 'mentioned you in a post';
      case 'ORDER_UPDATE': return 'updated your order status';
      default: return 'sent you a notification';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.96 }}
      transition={{ duration: 0.2 }}
      className="absolute top-full right-0 mt-2 w-80 card-surface border border-custom rounded-lg shadow-2xl overflow-hidden z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-custom">
        <div className="flex items-center gap-2">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-gold">Notifications</h3>
          {unreadCount > 0 && (
            <span className="bg-primary-gold text-black text-[7px] font-bold px-1.5 py-0.5 rounded-full">{unreadCount} new</span>
          )}
        </div>
        <button 
          onClick={() => markAllAsRead()}
          className="text-[8px] font-bold uppercase tracking-widest text-muted-custom hover:text-primary-gold transition-colors"
        >
          Mark all read
        </button>
      </div>

      {/* Notification list */}
      <div className="max-h-80 overflow-y-auto no-scrollbar">
        {notifications.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-[8px] font-bold uppercase tracking-widest text-muted-custom/40">Absolute Quiet</p>
          </div>
        )}
        {notifications.map((notif, i) => {
          const typeInfo = typeIcons[notif.type] || typeIcons.LIKE;
          const TypeIcon = typeInfo.icon;
          const sender = notif.sender;
          
          return (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => markAsRead(notif.id)}
              className={`flex items-start gap-2.5 px-4 py-3 hover:bg-[var(--pill-bg)] transition-colors cursor-pointer border-b border-custom/30 ${
                !notif.isRead ? '' : 'opacity-60'
              }`}
            >
              {/* Identity with type badge */}
              <div className="relative shrink-0">
                <UserIdentity 
                  user={{
                    ...sender,
                    subscriptionTier: (sender as any).subscriptionTier,
                    accountType: (sender as any).accountType,
                  } as any} 
                  size="sm" 
                  hideHandle 
                  className="w-fit"
                />
                <div className={`absolute -bottom-0.5 right-0 size-4 rounded-full bg-[var(--bg-color)] flex items-center justify-center border border-custom z-20`}>
                  <TypeIcon size={9} className={typeInfo.color} />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-bold leading-relaxed">
                  <span className="text-muted-custom">{getNotificationText(notif)}</span>
                </p>
                <span className="text-[7px] font-bold text-muted-custom/50 mt-0.5 block">{timeAgo(notif.createdAt)} ago</span>
              </div>

              {/* Unread dot */}
              {!notif.isRead && (
                <span className="size-1.5 bg-primary-gold rounded-full shrink-0 mt-2" />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      <Link href="/notifications" onClick={onClose} className="px-4 py-2.5 border-t border-custom hover:bg-[var(--pill-bg)] transition-colors text-center cursor-pointer block">
        <span className="text-[9px] font-bold uppercase tracking-widest text-primary-gold flex items-center justify-center gap-1">
          <Bell size={10} /> View All Notifications
        </span>
      </Link>
    </motion.div>
  );
}
