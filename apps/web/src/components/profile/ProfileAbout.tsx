'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Flag, Globe, Users, Hash, ExternalLink } from 'lucide-react';
import type { ProfileUser } from '@/data/profileData';
import { userInterests, userGroups } from '@/data/profileData';

interface Props {
  user: ProfileUser;
}

export default function ProfileAbout({ user }: Props) {
  return (
    <div className="px-4 space-y-6">
      {/* Bio */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h3 className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary-gold/60 mb-3">Bio</h3>
        <div className="card-surface rounded-lg p-4">
          <p className="text-[11px] font-bold text-muted-custom leading-relaxed">{user.bio}</p>
        </div>
      </motion.div>

      {/* Details Grid */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h3 className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary-gold/60 mb-3">Details</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: MapPin, label: 'County', value: user.county },
            { icon: Flag, label: 'Country', value: user.country },
            { icon: Calendar, label: 'Joined', value: user.joinedDate },
            { icon: Globe, label: 'Website', value: user.website || '—' },
          ].map((detail, i) => (
            <div key={i} className="card-surface rounded-lg p-3">
              <detail.icon size={12} className="text-primary-gold/40 mb-1.5" />
              <span className="text-[8px] font-bold uppercase tracking-widest text-muted-custom block">{detail.label}</span>
              <span className="text-[10px] font-bold">{detail.value}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Interests */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h3 className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary-gold/60 mb-3">Interests</h3>
        <div className="flex flex-wrap gap-1.5">
          {userInterests.map((interest, i) => (
            <span key={i} className="px-2.5 py-1 rounded bg-[var(--pill-bg)] border border-custom text-[9px] font-bold uppercase tracking-widest text-muted-custom hover:text-primary-gold hover:border-primary-gold/30 transition-all cursor-default">
              <Hash size={8} className="inline text-primary-gold/40 mr-0.5" />
              {interest}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Groups */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h3 className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary-gold/60 mb-3">Groups</h3>
        <div className="space-y-2">
          {userGroups.map((group, i) => (
            <div key={i} className="card-surface rounded-lg p-3 flex items-center justify-between hover:border-primary-gold/20 transition-all cursor-pointer">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-primary-gold/10 flex items-center justify-center">
                  <Users size={14} className="text-primary-gold" />
                </div>
                <div>
                  <span className="text-[10px] font-bold block">{group.name}</span>
                  <span className="text-[8px] text-muted-custom font-bold">{group.members.toLocaleString()} members</span>
                </div>
              </div>
              <span className="text-[8px] font-bold uppercase tracking-widest text-primary-gold">Joined</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
