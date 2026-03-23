'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Ghost, ShieldCheck, ArrowUpRight, MessageCircle
} from 'lucide-react';

const VerifiedDot = () => (
  <span className="inline-flex size-3 bg-primary-gold rounded-full items-center justify-center shrink-0">
    <ShieldCheck size={7} className="text-black" />
  </span>
);

const previewChats = [
  { id: 1, name: 'Elena Voss', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200', msg: 'Check out this listing I found! 🏠', time: '2m', unread: 2, verified: true, isAnon: false },
  { id: 2, name: 'Design Sync', avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200', msg: 'Sarah: Vote on the poll! 📊', time: '1h', unread: 3, verified: false, isAnon: false },
  { id: 3, name: 'Neon Fox', avatar: null, msg: 'Are we still on for the confidential launch?', time: '3h', unread: 1, verified: false, isAnon: true },
  { id: 4, name: 'Marcus Webb', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200', msg: "Let's catch up tomorrow morning.", time: '1d', unread: 0, verified: false, isAnon: false },
];

interface Props {
  onClose: () => void;
}

export default function MessagesPreview({ onClose }: Props) {
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
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-gold">Messages</h3>
        <Link href="/messages" onClick={onClose}>
          <span className="text-[8px] font-bold uppercase tracking-widest text-primary-gold hover:underline flex items-center gap-0.5">
            See All <ArrowUpRight size={8} />
          </span>
        </Link>
      </div>

      {/* Chat list */}
      <div className="max-h-72 overflow-y-auto no-scrollbar">
        {previewChats.map((chat, i) => (
          <Link key={chat.id} href="/messages" onClick={onClose}>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`flex items-center gap-2.5 px-4 py-2.5 hover:bg-[var(--pill-bg)] transition-colors cursor-pointer ${
                chat.unread > 0 ? '' : 'opacity-70'
              }`}
            >
              <div className="relative shrink-0">
                {chat.isAnon ? (
                  <div className="size-8 rounded-full bg-[var(--pill-bg)] border border-custom flex items-center justify-center text-primary-gold">
                    <Ghost size={14} />
                  </div>
                ) : (
                  <img src={chat.avatar || ''} className="size-8 rounded-full object-cover border border-custom" alt="" />
                )}
                {chat.verified && <div className="absolute -bottom-0.5 -right-0.5"><VerifiedDot /></div>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] font-bold uppercase tracking-widest truncate ${chat.isAnon ? 'italic text-primary-gold' : ''}`}>
                    {chat.name}
                  </span>
                  <span className="text-[7px] font-bold text-muted-custom shrink-0 ml-1">{chat.time}</span>
                </div>
                <p className={`text-[9px] truncate mt-0.5 ${chat.unread > 0 ? 'font-bold text-primary-gold' : 'font-bold text-muted-custom'}`}>
                  {chat.msg}
                </p>
              </div>
              {chat.unread > 0 && (
                <span className="bg-primary-gold text-black text-[7px] font-bold size-4 rounded-full flex items-center justify-center shrink-0">
                  {chat.unread}
                </span>
              )}
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <Link href="/messages" onClick={onClose}>
        <div className="px-4 py-2.5 border-t border-custom hover:bg-[var(--pill-bg)] transition-colors text-center">
          <span className="text-[9px] font-bold uppercase tracking-widest text-primary-gold flex items-center justify-center gap-1">
            <MessageCircle size={10} /> Open Messages
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
