'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, UserPlus, Repeat2, ShoppingBag, Bell, ShieldCheck, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useNotifications, type Notification } from '@/context/NotificationContext';
import { timeAgo } from '@/lib/utils';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';

const typeIcons: Record<Notification['type'], { icon: React.ElementType; color: string; bg: string }> = {
  LIKE: { icon: Heart, color: 'text-red-400', bg: 'bg-red-400/10' },
  COMMENT: { icon: MessageCircle, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  FOLLOW: { icon: UserPlus, color: 'text-primary-gold', bg: 'bg-primary-gold/10' },
  MENTION: { icon: Repeat2, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  ORDER_UPDATE: { icon: ShoppingBag, color: 'text-green-400', bg: 'bg-green-400/10' },
};

export default function NotificationsPage() {
  const { notifications, isLoading, unreadCount, markAllAsRead, hasMore, loadNotifications, markAsRead } = useNotifications();

  useEffect(() => {
    // Ensure fresh notifications are loaded
    loadNotifications(true);
  }, []);

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
    <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row min-h-screen lg:px-6 gap-6">
      <LeftSidebar />

      <main className="flex-1 w-full max-w-2xl mx-auto lg:mx-0 pt-0 lg:pt-4 pb-32 lg:pb-12">
        <TopBar />

        {/* Header */}
        <div className="px-4 pt-6 pb-4 flex items-center justify-between sticky top-0 z-30 bg-page/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
             <div className="p-2.5 rounded-xl bg-primary-gold/10 border border-primary-gold/20">
                <Bell className="text-primary-gold" size={20} />
             </div>
             <div>
                <h1 className="text-xl font-black uppercase tracking-tighter">Social Pulse</h1>
                <p className="text-[10px] font-bold text-muted-custom uppercase tracking-widest">{unreadCount} unread interactions</p>
             </div>
          </div>

          {unreadCount > 0 && (
            <button 
              onClick={() => markAllAsRead()}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary-gold/20 bg-primary-gold/5 text-[9px] font-black uppercase tracking-widest text-primary-gold hover:bg-primary-gold/10 transition-all gold-glow"
            >
              <CheckCircle2 size={12} />
              Catch Up
            </button>
          )}
        </div>

        {/* Feed */}
        <div className="mt-4 px-4 space-y-3">
          <AnimatePresence mode="popLayout">
            {notifications.map((notif, index) => {
              const typeInfo = typeIcons[notif.type] || typeIcons.LIKE;
              const TypeIcon = typeInfo.icon;
              const sender = notif.sender;

              return (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => !notif.isRead && markAsRead(notif.id)}
                  className={`group relative p-4 rounded-2xl border transition-all cursor-pointer ${
                    !notif.isRead 
                      ? 'bg-primary-gold/5 border-primary-gold/20 ring-1 ring-primary-gold/10 shadow-lg shadow-primary-gold/5' 
                      : 'card-surface border-custom hover:border-primary-gold/30'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Actor Avatar */}
                    <div className="relative shrink-0">
                      <Link href={`/profile/${sender?.username}`}>
                        <img 
                          src={sender?.avatar || '/placeholder-avatar.png'} 
                          className="size-12 rounded-full object-cover border-2 border-custom group-hover:border-primary-gold/50 transition-colors shadow-xl" 
                          alt="" 
                        />
                      </Link>
                      <div className={`absolute -bottom-1 -right-1 size-5 rounded-full ${typeInfo.bg} flex items-center justify-center border-2 border-page shadow-lg`}>
                        <TypeIcon size={10} className={typeInfo.color} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[13px] font-bold leading-tight line-clamp-2">
                          <Link href={`/profile/${sender?.username}`} className="text-primary-gold hover:underline">
                             {sender?.fullName || `@${sender?.username}`}
                          </Link>
                          {sender?.isVerified && (
                             <span className="inline-flex items-center justify-center size-3.5 bg-primary-gold rounded-full ml-1 align-middle">
                               <ShieldCheck size={8} className="text-black" />
                             </span>
                          )}
                          {' '}<span className="text-muted-custom font-medium">{getNotificationText(notif)}</span>
                        </p>
                        {!notif.isRead && (
                           <div className="size-2 bg-primary-gold rounded-full shadow-[0_0_10px_rgba(212,175,55,0.5)] shrink-0" />
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 mt-2">
                         <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-custom/40">
                             {timeAgo(notif.createdAt)} ago
                         </span>
                         
                         {/* Action Context Link */}
                         {(notif.postId || notif.commentId) && (
                            <Link 
                              href={notif.postId ? `/post/${notif.postId}` : `/notifications`}
                              className="text-[9px] font-bold uppercase tracking-widest text-primary-gold/60 hover:text-primary-gold transition-colors ml-auto"
                            >
                               View Context
                            </Link>
                         )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Loading / Empty States */}
          {isLoading && (
            <div className="flex justify-center py-10">
              <div className="size-8 rounded-full border-2 border-primary-gold/10 border-t-primary-gold animate-spin" />
            </div>
          )}

          {!isLoading && notifications.length === 0 && (
            <div className="py-20 text-center card-surface rounded-3xl border border-dashed border-custom mx-4">
               <div className="size-16 rounded-full bg-primary-gold/5 flex items-center justify-center mx-auto mb-4 grayscale opacity-20">
                  <Bell size={32} className="text-primary-gold" />
               </div>
               <h2 className="text-sm font-black uppercase tracking-widest opacity-40">Zero Context</h2>
               <p className="text-[10px] font-bold text-muted-custom/60 uppercase tracking-widest mt-2 px-8">No interactions found in your social pulse. Go out and curate something!</p>
            </div>
          )}

          {!isLoading && hasMore && notifications.length > 0 && (
             <button 
               onClick={() => loadNotifications(false)}
               className="w-full py-4 text-[10px] font-black uppercase tracking-[0.3em] text-primary-gold hover:text-white transition-colors"
             >
               Load Older Pulses
             </button>
          )}
        </div>
      </main>

      <RightSidebar />
      <BottomNav />
    </div>
  );
}
