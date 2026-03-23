'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Heart, MessageCircle, UserPlus, Repeat2, ShieldCheck,
  ShoppingBag, Store, ArrowUpRight, Bell, Star
} from 'lucide-react';

interface Notification {
  id: number;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'market' | 'kao' | 'verified' | 'review';
  actor: string;
  actorUsername: string;
  actorAvatar: string;
  actorVerified: boolean;
  content: string;
  time: string;
  read: boolean;
  image?: string;
}

const notifications: Notification[] = [
  {
    id: 1, type: 'like', actor: 'Elena Voss', actorUsername: 'elena_voss', actorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200',
    actorVerified: true, content: 'liked your post about marketplace launch', time: '5m', read: false,
  },
  {
    id: 2, type: 'comment', actor: 'James Odhiambo', actorUsername: 'james_o', actorAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200',
    actorVerified: true, content: 'commented: "This barter feature is genius! 🔥"', time: '15m', read: false,
  },
  {
    id: 3, type: 'follow', actor: 'Sarah Kimani', actorUsername: 'sarah_k', actorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200',
    actorVerified: true, content: 'started following you', time: '1h', read: false,
  },
  {
    id: 4, type: 'market', actor: 'TechHub KE', actorUsername: 'techhub_ke', actorAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200',
    actorVerified: true, content: 'Your iPhone listing got 12 views today', time: '2h', read: true,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 5, type: 'kao', actor: 'Kao', actorUsername: 'kao', actorAvatar: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=200',
    actorVerified: false, content: 'New listing in Kilimani matching your search', time: '3h', read: true,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 6, type: 'review', actor: 'Grace Wanjiku', actorUsername: 'grace_w', actorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
    actorVerified: false, content: 'left a 5-star review on your seller profile ⭐', time: '5h', read: true,
  },
];

const typeIcons: Record<string, { icon: React.ElementType; color: string }> = {
  like: { icon: Heart, color: 'text-red-400' },
  comment: { icon: MessageCircle, color: 'text-blue-400' },
  follow: { icon: UserPlus, color: 'text-primary-gold' },
  mention: { icon: Repeat2, color: 'text-purple-400' },
  market: { icon: ShoppingBag, color: 'text-green-400' },
  kao: { icon: Store, color: 'text-primary-gold' },
  verified: { icon: ShieldCheck, color: 'text-primary-gold' },
  review: { icon: Star, color: 'text-yellow-400' },
};

interface Props {
  onClose: () => void;
}

export default function NotificationsPreview({ onClose }: Props) {
  const unreadCount = notifications.filter(n => !n.read).length;

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
        <button className="text-[8px] font-bold uppercase tracking-widest text-muted-custom hover:text-primary-gold transition-colors">
          Mark all read
        </button>
      </div>

      {/* Notification list */}
      <div className="max-h-80 overflow-y-auto no-scrollbar">
        {notifications.map((notif, i) => {
          const typeInfo = typeIcons[notif.type];
          const TypeIcon = typeInfo.icon;
          return (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`flex items-start gap-2.5 px-4 py-3 hover:bg-[var(--pill-bg)] transition-colors cursor-pointer border-b border-custom/30 ${
                !notif.read ? '' : 'opacity-60'
              }`}
            >
              {/* Avatar with type badge */}
              <Link href={`/profile/${notif.actorUsername}`} onClick={onClose} className="relative shrink-0">
                <img src={notif.actorAvatar} className="size-9 rounded-full object-cover border border-custom" alt="" />
                <div className={`absolute -bottom-1 -right-1 size-4 rounded-full bg-[var(--bg-color)] flex items-center justify-center`}>
                  <TypeIcon size={9} className={typeInfo.color} />
                </div>
              </Link>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-bold leading-relaxed">
                  <Link href={`/profile/${notif.actorUsername}`} onClick={onClose} className="text-primary-gold hover:underline">{notif.actor}</Link>
                  {notif.actorVerified && (
                    <span className="inline-flex items-center justify-center size-3 bg-primary-gold rounded-full ml-0.5 align-middle">
                      <ShieldCheck size={6} className="text-black" />
                    </span>
                  )}
                  {' '}<span className="text-muted-custom">{notif.content}</span>
                </p>
                <span className="text-[7px] font-bold text-muted-custom/50 mt-0.5 block">{notif.time} ago</span>
              </div>

              {/* Thumbnail if present */}
              {notif.image && (
                <img src={notif.image} className="size-9 rounded object-cover shrink-0 border border-custom" alt="" />
              )}

              {/* Unread dot */}
              {!notif.read && (
                <span className="size-1.5 bg-primary-gold rounded-full shrink-0 mt-2" />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      <div onClick={onClose} className="px-4 py-2.5 border-t border-custom hover:bg-[var(--pill-bg)] transition-colors text-center cursor-pointer">
        <span className="text-[9px] font-bold uppercase tracking-widest text-primary-gold flex items-center justify-center gap-1">
          <Bell size={10} /> View All Notifications
        </span>
      </div>
    </motion.div>
  );
}
