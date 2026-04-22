'use client';

import React, { useState } from 'react';
import { 
  Phone, Video, Info, Ghost, Fingerprint, 
  ShieldCheck, ArrowLeft, Download, Loader2,
  User, Flame, Eye, X, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import UserIdentity from '../../shared/UserIdentity';
import type { Chat } from '@/data/chatData';

interface ChatHeaderProps {
  activeChat: Chat;
  isTyping: boolean;
  onBack?: () => void;
  downloadAllFiles: () => void;
  isDownloadingBatch: boolean;
  onShowInfo: () => void;
}

const VerifiedBadge = ({ size = 10 }: { size?: number }) => (
  <span className="inline-flex items-center justify-center size-3.5 bg-primary-gold rounded-full shrink-0">
    <ShieldCheck size={size} className="text-black" />
  </span>
);

export default function ChatHeader({
  activeChat,
  isTyping,
  onBack,
  downloadAllFiles,
  isDownloadingBatch,
  onShowInfo
}: ChatHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="h-14 border-b border-custom px-4 md:px-5 flex items-center justify-between shrink-0 bg-[var(--bg-color)] z-30">
      <div className="flex items-center gap-2 md:gap-3">
        {onBack && (
          <button onClick={onBack} className="md:hidden p-1 -ml-1 text-muted-custom hover:text-primary-gold transition-colors">
            <ArrowLeft size={20} />
          </button>
        )}
        
        <div className="relative group">
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="relative active:scale-95 transition-transform"
          >
            <UserIdentity 
              user={{
                ...activeChat,
                id: activeChat.id?.toString(),
                username: activeChat.name,
                fullName: activeChat.name,
                avatar: activeChat.avatar,
                subscriptionTier: (activeChat as any).subscriptionTier || (activeChat.isPremium ? 'PLUS' : 'FREE'),
                accountType: activeChat.isAnon ? 'NORMAL' : 'NORMAL'
              } as any}
              size="sm"
              hideName
              hideCheckmark
              isLink={false}
              className="flex-none pointer-events-none"
            />
          </button>

          {/* Identity Menu Popover */}
          <AnimatePresence>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-12 left-0 w-48 card-surface border border-custom rounded-xl p-1.5 z-50 shadow-2xl"
                >
                   <div className="px-3 py-2 border-b border-custom mb-1">
                     <p className="text-[7px] font-black uppercase tracking-[0.2em] text-primary-gold mb-0.5">Identity Options</p>
                     <p className="text-[9px] font-bold text-white truncate">{activeChat.name}</p>
                   </div>

                   <button 
                    onClick={() => { setMenuOpen(false); onShowInfo(); }}
                    className="w-full flex items-center gap-3 p-2 hover:bg-primary-gold/10 rounded-lg text-[9px] font-bold text-left transition-all group/item"
                   >
                     <div className="size-6 rounded bg-white/5 flex items-center justify-center group-hover/item:text-primary-gold transition-colors"><User size={12} /></div>
                     <span>Main Profile</span>
                     <ExternalLink size={10} className="ml-auto opacity-0 group-hover/item:opacity-100" />
                   </button>

                   <button className="w-full flex items-center gap-3 p-2 hover:bg-primary-gold/10 rounded-lg text-[9px] font-bold text-left transition-all group/item">
                     <div className="size-6 rounded bg-white/5 flex items-center justify-center group-hover/item:text-primary-gold transition-colors"><Eye size={12} /></div>
                     <span>View Identity Image</span>
                   </button>

                   <button className="w-full flex items-center gap-3 p-2 hover:bg-primary-gold/10 rounded-lg text-[9px] font-bold text-left transition-all group/item">
                     <div className="size-6 rounded bg-white/5 flex items-center justify-center group-hover/item:text-primary-gold transition-colors"><Flame size={12} /></div>
                     <span>View Fire (Posts)</span>
                   </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <div className="min-w-0 cursor-pointer group/header" onClick={onShowInfo}>
          <UserIdentity 
            user={{
              ...activeChat,
              id: activeChat.id?.toString(),
              username: activeChat.name, // Fallback as username for display
              fullName: activeChat.name,
              avatar: activeChat.avatar,
              subscriptionTier: (activeChat as any).subscriptionTier || (activeChat.isPremium ? 'PLUS' : 'FREE'),
              accountType: activeChat.isAnon ? 'NORMAL' : 'NORMAL'
            } as any}
            size="sm"
            hideHandle
            hideAvatar
            isLink={false}
            className="flex-none group-hover/header:text-primary-gold transition-colors"
          />
          <p className="text-[8px] font-bold text-muted-custom flex items-center gap-1 mt-0.5 ml-1">
            {activeChat.isAnon ? (
              <><Fingerprint size={8} /> Identity hidden</>
            ) : activeChat.type === 'group' ? (
              <>{activeChat.members || activeChat.groupMembers?.length || 0} members • View Info</>
            ) : isTyping ? (
              <><span className="size-1.5 bg-primary-gold rounded-full animate-pulse" /> is typing...</>
            ) : activeChat.isOnline ? (
              <><span className="size-1.5 bg-primary-gold rounded-full" /> Active now</>
            ) : (
              <><span className="size-1.5 bg-zinc-600 rounded-full" /> Offline</>
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button 
          onClick={downloadAllFiles}
          disabled={isDownloadingBatch}
          className={`h-7 px-3 card-surface rounded-lg flex items-center gap-2 text-[8px] font-black uppercase tracking-widest transition-all ${
            isDownloadingBatch ? 'text-primary-gold/50 cursor-not-allowed' : 'text-muted-custom hover:text-primary-gold active:scale-95 border border-white/5'
          }`}
        >
          {isDownloadingBatch ? <Loader2 size={10} className="animate-spin" /> : <Download size={10} />}
          {isDownloadingBatch ? 'Downloading...' : 'Download All'}
        </button>
        <div className="w-px h-4 bg-white/5 mx-1" />
        {activeChat.isAnon ? (
          <div className="flex items-center gap-1.5">
            <button className="h-7 px-3 card-surface border border-white/5 rounded-lg text-[8px] font-black uppercase tracking-widest text-primary-gold hover:bg-primary-gold/10 transition-all flex items-center gap-1.5">
              <Eye size={10} /> Reveal
            </button>
            <button className="h-7 px-3 card-surface border border-white/5 rounded-lg text-[8px] font-black uppercase tracking-widest text-primary-gold hover:bg-primary-gold/10 transition-all flex items-center gap-1.5">
              <Info size={10} /> Identity
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <button onClick={onShowInfo} className="size-8 card-surface border border-white/5 rounded-lg flex items-center justify-center text-muted-custom hover:text-primary-gold transition-colors"><Phone size={14} /></button>
            <button onClick={onShowInfo} className="size-8 card-surface border border-white/5 rounded-lg flex items-center justify-center text-muted-custom hover:text-primary-gold transition-colors"><Video size={14} /></button>
            <button onClick={onShowInfo} className="size-8 card-surface border border-white/5 rounded-lg flex items-center justify-center text-muted-custom hover:text-primary-gold transition-colors"><Info size={14} /></button>
          </div>
        )}
      </div>
    </div>
  );
}
