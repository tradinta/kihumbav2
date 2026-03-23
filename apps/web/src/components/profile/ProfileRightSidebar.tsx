'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldCheck, UserPlus } from 'lucide-react';
import type { ProfileUser, Achievement, SimilarProfile } from '@/data/profileData';

interface Props {
  user: ProfileUser;
  achievements: Achievement[];
  similarProfiles: SimilarProfile[];
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[8px] font-bold uppercase tracking-widest text-muted-custom w-20 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-[var(--pill-bg)] overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-primary-gold"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </div>
      <span className="text-[8px] font-bold text-primary-gold w-6 text-right">{value}</span>
    </div>
  );
}

export default function ProfileRightSidebar({ user, achievements, similarProfiles }: Props) {
  return (
    <aside className="hidden xl:flex flex-col w-72 pt-8 pb-12 sticky-sidebar shrink-0 overflow-y-auto no-scrollbar gap-4">
      {/* Kihumba Score Breakdown */}
      <div className="card-surface rounded-lg p-4">
        <h3 className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary-gold mb-3 flex items-center gap-1">
          <span className="text-primary-gold/50">◆</span> Kihumba Score
        </h3>
        <div className="space-y-2.5">
          <ScoreBar label="Trust" value={user.scoreBreakdown.trust} />
          <ScoreBar label="Activity" value={user.scoreBreakdown.activity} />
          <ScoreBar label="Community" value={user.scoreBreakdown.community} />
          <ScoreBar label="Marketplace" value={user.scoreBreakdown.marketplace} />
        </div>
        <div className="mt-3 pt-3 border-t border-custom flex items-center justify-between">
          <span className="text-[8px] font-bold uppercase tracking-widest text-muted-custom">Overall</span>
          <span className="text-sm font-bold text-primary-gold">{user.kihumbaScore}/100</span>
        </div>
      </div>

      {/* Achievements */}
      <div className="card-surface rounded-lg p-4">
        <h3 className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary-gold mb-3 flex items-center gap-1">
          <span className="text-primary-gold/50">◆</span> Achievements
        </h3>
        <div className="grid grid-cols-2 gap-1.5">
          {achievements.map(a => (
            <div key={a.id} className={`rounded p-2 text-center transition-all ${
              a.earned
                ? 'bg-primary-gold/5 border border-primary-gold/20'
                : 'bg-[var(--pill-bg)] border border-custom opacity-40'
            }`}>
              <span className="text-base block mb-0.5">{a.icon}</span>
              <span className="text-[7px] font-bold uppercase tracking-widest text-muted-custom">{a.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Similar Profiles */}
      <div className="card-surface rounded-lg p-4">
        <h3 className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary-gold mb-3 flex items-center gap-1">
          <span className="text-primary-gold/50">◆</span> People You Might Know
        </h3>
        <div className="space-y-2">
          {similarProfiles.map(profile => (
            <div key={profile.id} className="flex items-center gap-2">
              <Link href={`/profile/${profile.username}`} className="relative shrink-0 transition-opacity hover:opacity-90">
                <img src={profile.avatar} className="size-8 rounded-full object-cover border border-custom" alt="" />
                {profile.isVerified && (
                  <span className="absolute -bottom-0.5 -right-0.5 size-3 bg-primary-gold rounded-full flex items-center justify-center border border-[var(--bg-color)]">
                    <ShieldCheck size={7} className="text-black" />
                  </span>
                )}
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={`/profile/${profile.username}`} className="hover:text-primary-gold transition-colors block w-fit">
                  <span className="text-[9px] font-bold block truncate">{profile.fullName}</span>
                </Link>
                <span className="text-[7px] text-muted-custom font-bold">{profile.mutualFollowers} mutual followers</span>
              </div>
              <button className="h-6 px-2 bg-primary-gold/10 border border-primary-gold/20 rounded text-[7px] font-bold uppercase tracking-widest text-primary-gold hover:bg-primary-gold/20 transition-all">
                <UserPlus size={8} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
