'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Search, Plus, Users, MessageCircle, Ghost, Settings,
  ShieldCheck, User as UserIcon, Fingerprint, X, Loader2,
  ChevronRight, MoreVertical, Send, UserPlus, Archive, Trash2
} from 'lucide-react';
import UserIdentity from '../shared/UserIdentity';
import StartChatModal from './StartChatModal';
import ConfirmModal from '../shared/ConfirmModal';
import { useAuth } from '@/context/AuthContext';
import { useSnackbar } from '@/context/SnackbarContext';
import { api } from '@/lib/api';
import type { Chat, Story } from '@/data/chatData';
import { UI_LABELS } from '@/lib/constants';

interface ChatSidebarProps {
  stories: Story[];
  chats: Chat[];
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  activeChatId: string | number | null;
  setActiveChatId: (id: string | number) => void;
  onRefresh?: () => void;
}

const VerifiedDot = () => (
  <div className="size-3.5 bg-primary-gold rounded-full border border-[var(--bg-color)] flex items-center justify-center">
    <ShieldCheck size={8} className="text-black" />
  </div>
);

const FILTERS = [
  { id: 'all', label: UI_LABELS.FILTERS.ALL, icon: MessageCircle },
  { id: 'dms', label: UI_LABELS.FILTERS.DMS, icon: UserIcon },
  { id: 'groups', label: UI_LABELS.FILTERS.GROUPS, icon: Users },
  { id: 'anon', label: UI_LABELS.FILTERS.ANON, icon: Ghost },
  { id: 'archived', label: UI_LABELS.FILTERS.ARCHIVED, icon: Archive },
];

export default function ChatSidebar({
  stories, chats, activeFilter, setActiveFilter,
  activeChatId, setActiveChatId, onRefresh
}: ChatSidebarProps) {
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [isNewChatOpen, setIsNewChatOpen] = React.useState(false);
  const [deleteModal, setDeleteModal] = React.useState<{isOpen: boolean, roomId: string | null}>({ isOpen: false, roomId: null });
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDeleteRoom = async () => {
    if (!deleteModal.roomId) return;
    setIsDeleting(true);
    try {
      await api.delete(`/chat/rooms/${deleteModal.roomId}`);
      showSnackbar('Conversation decommissioned', 'info');
      onRefresh?.();
      setDeleteModal({ isOpen: false, roomId: null });
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to decommission channel';
      showSnackbar(msg, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleArchiveRoom = async (e: React.MouseEvent, roomId: string, isCurrentlyArchived: boolean) => {
    e.stopPropagation();
    try {
      await api.post(`/chat/rooms/${roomId}/archive`, { archive: !isCurrentlyArchived });
      showSnackbar(isCurrentlyArchived ? 'Conversation unarchived' : 'Conversation archived', 'success');
      onRefresh?.();
    } catch (err) {
      showSnackbar('Failed to update archive status', 'error');
    }
  };

  const filteredChats = chats.filter(chat => {
    const isArchived = (chat as any).isArchived;
    if (activeFilter === 'archived') return isArchived;
    if (isArchived) return false; // Hide archived chats from other filters
    
    if (activeFilter === 'all') return true;
    if (activeFilter === 'dms') return chat.type === 'dm';
    if (activeFilter === 'groups') return chat.type === 'group';
    if (activeFilter === 'anon') return chat.type === 'anon';
    return true;
  });

  return (
    <div className="w-full md:w-72 lg:w-80 h-full flex flex-col gap-3 p-3 shrink-0 overflow-hidden select-none bg-transparent">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <h1 className="text-sm font-bold tracking-[0.15em] uppercase text-primary-gold gold-glow">{UI_LABELS.MESSAGES}</h1>
        <div className="flex gap-1">
          <Link 
            href="/messages/settings"
            className="size-7 pill-surface rounded-[var(--radius-main)] flex items-center justify-center text-muted-custom hover:text-primary-gold transition-colors border border-custom"
          >
            <Settings size={13} />
          </Link>
          <button 
            onClick={() => setIsNewChatOpen(true)}
            className="size-7 bg-primary-gold rounded-[var(--radius-main)] flex items-center justify-center text-black hover:brightness-110 transition-all"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="pill-surface rounded-[var(--radius-main)] px-2.5 py-2 flex items-center gap-2 border border-custom">
        <Search size={12} className="text-primary-gold/50" />
        <input type="text" placeholder={UI_LABELS.SEARCH_MESSAGES} className="flex-1 bg-transparent outline-none text-[10px] font-bold text-main placeholder:text-muted-custom/50" />
      </div>

      {/* Filters */}
      <div className="flex gap-1 overflow-x-auto no-scrollbar">
        {FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={`px-2.5 py-1.5 rounded-[var(--radius-main)] text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 transition-all border shrink-0 ${
              activeFilter === f.id
                ? 'bg-primary-gold/15 text-primary-gold border-primary-gold/30'
                : 'pill-surface text-muted-custom border-custom'
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
              className={`p-2.5 rounded-lg cursor-pointer flex items-center gap-2.5 transition-all border group relative ${
                activeChatId === chat.id
                  ? 'card-surface border-primary-gold/20'
                  : 'bg-transparent border-transparent hover:bg-[var(--card-bg)]'
              }`}
            >
              <div className="flex-1 min-w-0 flex flex-col">
                <UserIdentity 
                  user={{
                    ...chat,
                    id: chat.id?.toString(),
                    username: chat.name,
                    fullName: chat.name,
                    avatar: chat.avatar,
                    subscriptionTier: (chat as any).subscriptionTier || (chat.isPremium ? 'PLUS' : 'FREE'),
                    accountType: chat.isAnon ? 'NORMAL' : 'NORMAL'
                  } as any}
                  size="sm"
                  hideHandle
                  isLink={false}
                  className="flex-none"
                />
                <p className={`text-[9px] truncate font-bold mt-0.5 ml-11 ${chat.unread > 0 ? 'text-primary-gold' : 'text-muted-custom'}`}>
                  {chat.lastMsg}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[8px] text-muted-custom font-bold shrink-0">{chat.time}</span>
                
                {/* Action Buttons (Visible on Hover) */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  <button 
                    onClick={(e) => handleArchiveRoom(e, chat.id, (chat as any).isArchived)}
                    className="size-6 rounded-full hover:bg-primary-gold/10 text-muted-custom hover:text-primary-gold flex items-center justify-center transition-all"
                    title={(chat as any).isArchived ? "Unarchive" : "Archive"}
                  >
                    <Archive size={12} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setDeleteModal({ isOpen: true, roomId: chat.id }); }}
                    className="size-6 rounded-full hover:bg-red-500/10 text-muted-custom hover:text-red-500 flex items-center justify-center transition-all"
                    title="Delete"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>

                {chat.unread > 0 && (
                  <span className="bg-primary-gold text-black text-[8px] font-bold px-1 py-0.5 rounded-full leading-none">
                    {chat.unread}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, roomId: null })}
        onConfirm={handleDeleteRoom}
        loading={isDeleting}
        title="Delete Full History"
        description="This will delete the full chat history and cannot be undone."
        confirmText="Delete for Me"
      />

      <StartChatModal 
        isOpen={isNewChatOpen}
        onClose={() => setIsNewChatOpen(false)}
        onRoomCreated={(roomId) => {
          setActiveChatId(roomId);
          setIsNewChatOpen(false);
          onRefresh?.();
        }}
      />
    </div>
  );
}
