'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Users, UserCheck, Zap } from 'lucide-react';
import type { ProfileUser } from '@/data/profileData';

interface Props {
  user: ProfileUser;
}

function AnimatedCounter({ target, suffix = '' }: { target: number | string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const numTarget = typeof target === 'number' ? target : parseInt(target.replace(/[^0-9]/g, ''));

  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const step = Math.ceil(numTarget / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= numTarget) { setCount(numTarget); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [numTarget]);

  const format = (n: number) => {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return n.toString();
  };

  return <span>{format(count)}{suffix}</span>;
}

function ScoreArc({ score }: { score: number }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? '#c5a059' : score >= 60 ? '#e2c27d' : '#a07d3a';

  return (
    <div className="relative flex items-center justify-center">
      <svg width="68" height="68" viewBox="0 0 68 68" className="-rotate-90">
        <circle cx="34" cy="34" r={radius} fill="none" stroke="var(--pill-bg)" strokeWidth="4" />
        <motion.circle
          cx="34" cy="34" r={radius} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round"
          strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }} transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-sm font-bold" style={{ color }}>{score}</span>
        <span className="text-[6px] font-bold uppercase tracking-widest text-muted-custom">Score</span>
      </div>
    </div>
  );
}

export default function ProfileStats({ user }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="px-4 mb-6"
    >
      <div className="card-surface rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          {[
            { label: 'Posts', value: user.stats.posts, icon: FileText },
            { label: 'Followers', value: user.stats.followers, icon: Users },
            { label: 'Following', value: user.stats.following, icon: UserCheck },
            { label: 'Deals', value: user.stats.deals, icon: Zap },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center text-center">
              <stat.icon size={12} className="text-primary-gold/40 mb-1" />
              <span className="text-sm font-bold"><AnimatedCounter target={stat.value} /></span>
              <span className="text-[8px] font-bold uppercase tracking-widest text-muted-custom">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Kihumba Score Arc */}
        <div className="hidden sm:block">
          <ScoreArc score={user.kihumbaScore} />
        </div>
      </div>
    </motion.div>
  );
}
