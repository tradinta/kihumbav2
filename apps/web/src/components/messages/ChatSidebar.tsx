'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Plus, Users, MessageCircle, Ghost, Settings,
  ShieldCheck, User as UserIcon, Fingerprint
} from 'lucide-react';
import type { Chat, Story } from '@/data/chatData';

interface ChatSidebarProps {
  stories: Story[];
  chats: Chat[];
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  activeChatId: number | null;
  setActiveChatId: (id: number) => void;
}

const VerifiedDot = () => (
  <div className="size-3.5 bg-primary-gold rounded-full border border-[var(--bg-color)] flex items-center justify-center">
    <ShieldCheck size={8} className="text-black" />
  </div>
);

const FILTERS = [
  { id: 'all', label: 'All', icon: MessageCircle },
  { id: 'dms', label: 'DMs', icon: UserIcon },
  { id: 'groups', label: 'Groups', icon: Users },
  { id: 'anon', label: 'Anon', icon: Ghost },
];

export default function ChatSidebar({
  stories, chats, activeFilter, setActiveFilter,
  activeChatId, setActiveChatId,
}: ChatSidebarProps) {

  const filteredChats = chats.filter(chat => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'dms') return chat.type === 'dm';
    if (activeFilter === 'groups') return chat.type === 'group';
    if (activeFilter === 'anon') return chat.type === 'anon';
    return true;
  });

  return (
    <div className="w-full md:w-72 lg:w-80 h-full flex flex-col gap-3 card-surface rounded-lg p-3 shrink-0 overflow-hidden select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <h1 className="text-sm font-bold tracking-[0.15em] uppercase text-primary-gold gold-glow">Messages</h1>
        <div className="flex gap-1">
          <button className="size-7 card-surface rounded flex items-center justify-center text-muted-custom hover:text-primary-gold transition-colors">
            <Settings size={13} />
          </button>
          <button className="size-7 bg-primary-gold rounded flex items-center justify-center text-black hover:brightness-110 transition-all">
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="card-surface rounded px-2.5 py-1.5 flex items-center gap-2">
        <Search size={12} className="text-primary-gold/50" />
        <input type="text" placeholder="Search messages…" className="flex-1 bg-transparent outline-none text-[10px] font-bold placeholder:text-muted-custom/50" />
      </div>

      {/* Stories */}
      <div className="flex gap-2.5 overflow-x-auto no-scrollbar py-1">
        {stories.map(story => (
          <div key={story.id} className="flex flex-col items-center gap-1 cursor-pointer shrink-0 group">
            {story.type === 'add' ? (
              <div className="size-11 rounded-full border-2 border-dashed border-custom flex items-center justify-center bg-[var(--pill-bg)] hover:border-primary-gold/40 transition-all">
                <Plus size={14} className="text-muted-custom group-hover:text-primary-gold transition-colors" />
              </div>
            ) : (
              <div className={`size-11 rounded-full p-[2px] ${story.viewed ? 'bg-[var(--pill-bg)]' : 'bg-primary-gold'}`}>
                <div className="rounded-full h-full w-full p-[1px] relative" style={{ background: 'var(--bg-color)' }}>
                  <img src={story.avatar || ''} className="rounded-full w-full h-full object-cover" alt="" />
                  {story.isPremium && <div className="absolute -bottom-0.5 -right-0.5"><VerifiedDot /></div>}
                </div>
              </div>
            )}
            <span className="text-[8px] font-bold uppercase tracking-widest text-muted-custom">{story.type === 'add' ? 'Add' : story.name}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-1 overflow-x-auto no-scrollbar">
        {FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={`px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-widest flex items-center gap-1 transition-all border ${
              activeFilter === f.id
                ? 'bg-primary-gold/15 text-primary-gold border-primary-gold/30'
                : 'card-surface text-muted-custom border-custom'
            }`}
          >
            <f.icon size={10} />
            {f.label}
          </button>
        ))}
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-1">
        <AnimatePresence>
          {filteredChats.map(chat => (
            <motion.div
              key={chat.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={() => setActiveChatId(chat.id)}
              className={`p-2.5 rounded-lg cursor-pointer flex items-center gap-2.5 transition-all border ${
                activeChatId === chat.id
                  ? 'card-surface border-primary-gold/20'
                  : 'bg-transparent border-transparent hover:bg-[var(--card-bg)]'
              }`}
            >
              <div className="relative shrink-0">
                {chat.isAnon ? (
                  <div className="size-9 rounded-full bg-[var(--pill-bg)] border border-custom flex items-center justify-center text-primary-gold">
                    <Ghost size={14} />
                  </div>
                ) : (
                  <img src={chat.avatar || ''} className="size-9 rounded-full object-cover border border-custom" alt="" />
                )}
                {chat.isPremium && !chat.isAnon && <div className="absolute -bottom-0.5 -right-0.5"><VerifiedDot /></div>}
                {chat.unread > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-gold text-black text-[8px] font-bold px-1 py-0.5 rounded-full leading-none">
                    {chat.unread}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h4 className={`font-bold truncate text-[10px] uppercase tracking-widest ${chat.isAnon ? 'italic text-primary-gold' : ''}`}>
                    {chat.name}
                  </h4>
                  <span className="text-[8px] text-muted-custom font-bold shrink-0 ml-1">{chat.time}</span>
                </div>
                <p className={`text-[9px] truncate font-bold mt-0.5 ${chat.unread > 0 ? 'text-primary-gold' : 'text-muted-custom'}`}>
                  {chat.lastMsg}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
