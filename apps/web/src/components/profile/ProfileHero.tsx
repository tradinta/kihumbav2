'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  MapPin, Calendar, Globe, BadgeCheck, UserPlus, MessageCircle,
  MoreHorizontal, Check, Loader2, School, Info, Ban, BellOff, Share2, AlertTriangle, History
} from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { api } from '@/lib/api';

import AboutAccountModal from './AboutAccountModal';

interface Props {
  user: any;
  isSelf?: boolean;
  onEditClick?: () => void;
}

export default function ProfileHero({ user, isSelf, onEditClick }: Props) {
  const router = useRouter();
  const menuRef = React.useRef<HTMLDivElement>(null);
  const [isFollowing, setIsFollowing] = useState(user.isFollowing);
  const [followStatus, setFollowStatus] = useState<string | null>(user.followStatus || (user.isFollowing ? 'ACCEPTED' : null));
  const [followLoading, setFollowLoading] = useState(false);
  const [messageLoading, setMessageLoading] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFollowToggle = async () => {
    setFollowLoading(true);
    const prev = isFollowing;
    setIsFollowing(!prev); // Optimistic

    try {
      if (prev) {
        await api.delete(`/users/${user.id}/follow`);
        setFollowStatus(null);
      } else {
        const res = await api.post(`/users/${user.id}/follow`);
        setFollowStatus(res.status);
        if (res.status === 'ACCEPTED') setIsFollowing(true);
      }
    } catch (err) {
      console.error('Follow toggle failed', err);
      setIsFollowing(prev); // Revert on failure
    } finally {
      setFollowLoading(false);
    }
  };

  const handleMessage = async () => {
    setMessageLoading(true);
    try {
      // Create or get DM room
      const room = await api.post('/chat/rooms', {
        type: 'DM',
        participants: [user.id]
      });
      router.push(`/messages/${room.id}`);
    } catch (err) {
      console.error('Failed to initiate chat', err);
    } finally {
      setMessageLoading(false);
    }
  };

  return (
    <div className="relative mb-6">
      {/* ─── Cover Photo ─── */}
      <div className="relative h-36 md:h-48 rounded-lg overflow-hidden bg-black/40">
        <Image src={user.coverPhoto || '/branding/cover-fallback.png'} alt="Cover" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-color)] via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
      </div>

      {/* ─── Avatar + Info ─── */}
      <div className="relative px-4 -mt-12 flex flex-col md:flex-row md:items-end gap-3 md:gap-4">
        {/* Avatar with tier ring */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 120 }}
          className="relative shrink-0"
        >
          <div className={cn(
            "size-20 md:size-24 transition-all duration-700 relative flex items-center justify-center p-[3px]",
            user.accountType === 'NORMAL' ? 'rounded-full' : 'rounded-[25%]',
            user.accountType === 'NORMAL' && user.subscriptionTier === 'PLUS' ? 'border-transparent animate-torch-bg shadow-[0_0_30px_rgba(255,215,0,0.4)]' :
            user.accountType === 'NORMAL' && user.subscriptionTier === 'PRO' ? 'border-2 border-primary-gold shadow-[0_0_15px_rgba(212,175,55,0.2)]' :
            user.accountType === 'GOVERNMENT' ? 'border-2 border-slate-300 shadow-[0_0_20px_rgba(148,163,184,0.2)]' :
            'border-2 border-white/10'
          )} style={user.accountType === 'BUSINESS' ? { borderColor: user.businessColor || '#1d9bf0', borderWidth: user.businessWeight || '3px' } : {}}>
             <div className={cn("size-full bg-black overflow-hidden", user.accountType === 'NORMAL' ? 'rounded-full' : 'rounded-[25%]')}>
                <img src={user.avatar || '/branding/avatar-fallback.png'} alt={user.fullName} className="size-full object-cover" />
             </div>
          </div>

          {/* Verification badge based on account type */}
          {(user.isVerified || user.accountType === 'GOVERNMENT' || user.accountType === 'BUSINESS') && (
            <div className="absolute -bottom-1 -right-1 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
               {user.accountType === 'NORMAL' && user.subscriptionTier === 'PLUS' ? (
                 <div className="relative inline-flex shrink-0">
                   <BadgeCheck size={28} className="badge-solid text-white fill-[#D4AF37]" />
                   <div className="absolute inset-0 animate-torch-mask">
                     <BadgeCheck size={28} className="badge-solid text-white fill-white" />
                   </div>
                 </div>
               ) : (
                 <BadgeCheck 
                   size={28} 
                   className="badge-solid text-white" 
                   style={{ 
                     fill: user.accountType === 'GOVERNMENT' ? '#94a3b8' : 
                           user.accountType === 'BUSINESS' ? (user.businessColor || '#1d9bf0') : '#C5A059' 
                   }} 
                 />
               )}
            </div>
          )}
        </motion.div>

        {/* Name block + actions */}
        <div className="flex-1 flex flex-col md:flex-row md:items-end md:justify-between gap-3 pb-1">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex flex-col gap-1 mb-2">
               <div className="flex items-center gap-2">
                 {user.fullName === 'IDENTITY_LOCKED' ? (
                   <div className="h-6 w-32 bg-white/10 rounded-sm blur-[5px] animate-pulse relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
                   </div>
                 ) : (
                   <h1 className={cn(
                     "text-2xl font-inter font-bold tracking-tight",
                     user.accountType === 'NORMAL' && user.subscriptionTier === 'PLUS' ? "animate-torch-text drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]" : "text-main"
                   )}>
                     {user.fullName}
                   </h1>
                 )}
                 {user.accountType === 'GOVERNMENT' && (
                   <span className="bg-indigo-600/10 text-indigo-400 text-[8px] font-black px-1.5 py-0.5 rounded-[2px] uppercase tracking-widest border border-indigo-600/20">Official</span>
                 )}
               </div>
               
               <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                 <span className="text-[11px] font-bold text-primary-gold tracking-tight">@{user.username}</span>
                 {user.isReserved && (
                    <span className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-tighter bg-[var(--pill-bg)] px-1 rounded-[2px]">Reserved</span>
                 )}
               </div>
            </div>
            
            <p className="text-[11px] font-bold text-muted-custom mt-2 leading-relaxed max-w-md">{user.bio}</p>

            {/* Badges */}
            {user.badges && user.badges.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                {user.badges.map((badge: any, i: number) => (
                  <div key={i} className={`flex items-center gap-1 px-2 py-0.5 rounded-[2px] text-[8px] font-bold uppercase tracking-widest border ${
                    badge.rarity === 'LEGENDARY' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30' :
                    badge.rarity === 'EPIC' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' :
                    badge.rarity === 'RARE' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                    'bg-white/5 text-muted-custom border-white/10'
                  }`} title={badge.description}>
                    {badge.name}
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2 shrink-0"
          >
            {isSelf ? (
                <button
                    onClick={onEditClick}
                    className="h-8 px-5 rounded-[4px] bg-white/5 border border-white/10 text-[9px] font-bold uppercase tracking-widest text-primary-gold hover:bg-primary-gold/10 hover:border-primary-gold/30 transition-all active:scale-95 flex items-center gap-2 shadow-[0_0_15px_rgba(212,175,55,0.05)]"
                >
                    Edit Profile
                </button>
            ) : (
                <>
                    <button
                        onClick={handleFollowToggle}
                        disabled={followLoading || user.isReserved}
                        className={`h-8 px-4 rounded-[4px] text-[9px] font-bold uppercase tracking-widest transition-all active:scale-95 flex items-center gap-1.5 ${
                            isFollowing || followStatus === 'PENDING'
                            ? 'card-surface text-muted-custom hover:text-primary-gold'
                            : 'bg-primary-gold text-black hover:brightness-110 shadow-lg shadow-primary-gold/10'
                        } ${user.isReserved ? 'opacity-30 cursor-not-allowed' : ''}`}
                    >
                        {followLoading ? <Loader2 size={10} className="animate-spin" /> : 
                         followStatus === 'PENDING' ? <><History size={10} /> Requested</> :
                         isFollowing ? <><Check size={10} /> Following</> : 
                         <><UserPlus size={10} /> Follow</>}
                    </button>
                    <button 
                        onClick={handleMessage}
                        disabled={messageLoading || user.isReserved}
                        className={`h-8 px-3 card-surface rounded-[4px] text-[9px] font-bold uppercase tracking-widest text-muted-custom hover:text-primary-gold transition-all active:scale-95 flex items-center gap-1 ${user.isReserved ? 'opacity-30 cursor-not-allowed' : ''}`}
                    >
                        {messageLoading ? <Loader2 size={10} className="animate-spin" /> : <><MessageCircle size={10} /> Message</>}
                    </button>
                </>
            )}
            <div className="relative" ref={menuRef}>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`size-8 rounded-[4px] flex items-center justify-center transition-all ${
                  isMenuOpen ? 'bg-primary-gold text-black shadow-lg shadow-primary-gold/20' : 'card-surface text-muted-custom hover:text-primary-gold'
                }`}
              >
                <MoreHorizontal size={14} />
              </button>

              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute right-0 mt-2 w-48 card-surface border border-[var(--border-color)] rounded-xl shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="py-1">
                      <button 
                        onClick={() => { setIsAboutOpen(true); setIsMenuOpen(false); }}
                        className="w-full px-4 py-2 text-[10px] font-bold text-muted-custom hover:text-primary-gold hover:bg-white/5 flex items-center gap-2 transition-colors uppercase tracking-widest"
                      >
                        <Info size={14} /> About this account
                      </button>
                      <button 
                        onClick={() => setIsMenuOpen(false)}
                        className="w-full px-4 py-2 text-[10px] font-bold text-muted-custom hover:text-primary-gold hover:bg-white/5 flex items-center gap-2 transition-colors uppercase tracking-widest"
                      >
                        <Share2 size={14} /> Share account
                      </button>
                      <div className="h-px bg-white/5 my-1" />
                      <button 
                        onClick={() => setIsMenuOpen(false)}
                        className="w-full px-4 py-2 text-[10px] font-bold text-muted-custom hover:text-blue-400 hover:bg-white/5 flex items-center gap-2 transition-colors uppercase tracking-widest"
                      >
                        <BellOff size={14} /> Mute @{user.username}
                      </button>
                      <button 
                        onClick={() => setIsMenuOpen(false)}
                        className="w-full px-4 py-2 text-[10px] font-bold text-red-500 hover:bg-red-500/5 flex items-center gap-2 transition-colors uppercase tracking-widest"
                      >
                        <Ban size={14} /> Block account
                      </button>
                      <button 
                        onClick={() => setIsMenuOpen(false)}
                        className="w-full px-4 py-2 text-[10px] font-bold text-red-500 hover:bg-red-500/5 flex items-center gap-2 transition-colors uppercase tracking-widest"
                      >
                        <AlertTriangle size={14} /> Report account
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      <AboutAccountModal 
        isOpen={isAboutOpen} 
        onClose={() => setIsAboutOpen(false)} 
        user={user} 
      />
    </div>
  );
}
