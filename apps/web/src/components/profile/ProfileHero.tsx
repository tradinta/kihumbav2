'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  MapPin, Calendar, Globe, ShieldCheck, UserPlus, MessageCircle,
  MoreHorizontal, Check, Crown, ExternalLink
} from 'lucide-react';
import type { ProfileUser, Tier } from '@/data/profileData';
import { TIER_COLORS, mutualFollowers } from '@/data/profileData';

interface Props {
  user: ProfileUser;
}

const TIER_LABELS: Record<Tier, string> = {
  PLEBIAN: 'Plebian',
  CITIZEN: 'Citizen',
  PATRICIAN: 'Patrician',
  TYCOON: 'Tycoon',
};

export default function ProfileHero({ user }: Props) {
  const [isFollowing, setIsFollowing] = useState(false);
  const tierColor = TIER_COLORS[user.tier];

  return (
    <div className="relative mb-6">
      {/* ─── Cover Photo ─── */}
      <div className="relative h-36 md:h-48 rounded-lg overflow-hidden">
        <Image src={user.coverPhoto} alt="Cover" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-color)] via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
      </div>

      {/* ─── Avatar + Info ─── */}
      <div className="relative px-4 -mt-12 flex flex-col md:flex-row md:items-end gap-4">
        {/* Avatar with tier ring */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 120 }}
          className="relative shrink-0"
        >
          <div className="size-20 md:size-24 rounded-xl p-[3px]" style={{ background: `linear-gradient(135deg, ${tierColor}, ${tierColor}88)` }}>
            <div className="w-full h-full rounded-[10px] p-[2px]" style={{ background: 'var(--bg-color)' }}>
              <Image src={user.avatar} alt={user.fullName} width={96} height={96} className="rounded-lg w-full h-full object-cover" />
            </div>
          </div>

          {/* Verification badge */}
          {user.isVerified && (
            <div className="absolute -bottom-1 -right-1 size-6 bg-primary-gold rounded-lg flex items-center justify-center shadow border-2 border-[var(--bg-color)]">
              <ShieldCheck size={14} className="text-black" />
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
            {/* Name + tier */}
            <div className="flex items-center gap-2 mb-0.5">
              <h1 className="text-lg font-bold tracking-tight">{user.fullName}</h1>
              <span
                className="px-1.5 py-0.5 rounded text-[7px] font-bold uppercase tracking-widest border"
                style={{ color: tierColor, borderColor: `${tierColor}40`, backgroundColor: `${tierColor}10` }}
              >
                <Crown size={7} className="inline mr-0.5" style={{ color: tierColor }} />
                {TIER_LABELS[user.tier]}
              </span>
            </div>

            {/* Handle */}
            <span className="text-[10px] font-bold text-primary-gold">@{user.username}</span>

            {/* Bio */}
            <p className="text-[11px] font-bold text-muted-custom mt-2 leading-relaxed max-w-md">{user.bio}</p>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <span className="flex items-center gap-1 text-[9px] font-bold text-muted-custom">
                <MapPin size={10} className="text-primary-gold/50" /> {user.county}, {user.country}
              </span>
              <span className="flex items-center gap-1 text-[9px] font-bold text-muted-custom">
                <Calendar size={10} className="text-primary-gold/50" /> Joined {user.joinedDate}
              </span>
              {user.website && (
                <a href={`https://${user.website}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[9px] font-bold text-primary-gold hover:underline">
                  <Globe size={10} /> {user.website}
                </a>
              )}
            </div>

            {/* Verified seller badge */}
            {user.isVerifiedSeller && (
              <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded bg-primary-gold/10 border border-primary-gold/20">
                <ShieldCheck size={10} className="text-primary-gold" />
                <span className="text-[8px] font-bold uppercase tracking-widest text-primary-gold">Verified Seller</span>
              </div>
            )}

            {/* Mutual followers */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex -space-x-1.5">
                {mutualFollowers.map((mf, i) => (
                  <img key={i} src={mf.avatar} className="size-5 rounded-full object-cover border border-[var(--bg-color)]" alt="" />
                ))}
              </div>
              <span className="text-[9px] font-bold text-muted-custom">
                Followed by <span className="text-primary-gold">{mutualFollowers[0].name}</span>, <span className="text-primary-gold">{mutualFollowers[1].name}</span> and <span className="text-primary-gold">12 others</span>
              </span>
            </div>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2 shrink-0"
          >
            <button
              onClick={() => setIsFollowing(!isFollowing)}
              className={`h-8 px-4 rounded text-[9px] font-bold uppercase tracking-widest transition-all active:scale-95 flex items-center gap-1.5 ${
                isFollowing
                  ? 'card-surface text-muted-custom hover:text-primary-gold'
                  : 'bg-primary-gold text-black hover:brightness-110 shadow-lg shadow-primary-gold/10'
              }`}
            >
              {isFollowing ? <><Check size={10} /> Following</> : <><UserPlus size={10} /> Follow</>}
            </button>
            <Link href="/messages">
              <button className="h-8 px-3 card-surface rounded text-[9px] font-bold uppercase tracking-widest text-muted-custom hover:text-primary-gold transition-all active:scale-95 flex items-center gap-1">
                <MessageCircle size={10} /> Message
              </button>
            </Link>
            <button className="size-8 card-surface rounded flex items-center justify-center text-muted-custom hover:text-primary-gold transition-colors">
              <MoreHorizontal size={14} />
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
