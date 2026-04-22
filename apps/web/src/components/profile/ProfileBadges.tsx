'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Award, Users, Shield, Sparkles, Zap, Star } from 'lucide-react';
import useSWR from 'swr';
import { api } from '@/lib/api';

interface Props {
  user: any;
}

export default function ProfileBadges({ user }: Props) {
  const { data: tribes = [] } = useSWR(`/users/${user.id}/tribes`, async (url) => {
    return api.get(url);
  });

  const badges = user.badges || [];

  return (
    <div className="px-4 space-y-8">
      {/* ─── Trophy Case ─── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-4">
           <h3 className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary-gold/60">Trophy Case</h3>
           <span className="text-[10px] font-bold text-muted-custom">{badges.length} Unlocked</span>
        </div>
        
        {badges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {badges.map((badge: any, i: number) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className={`card-surface rounded-2xl p-4 border flex items-center gap-4 group hover:border-primary-gold/30 transition-all ${
                   badge.rarity === 'LEGENDARY' ? 'bg-yellow-500/5 border-yellow-500/10' :
                   badge.rarity === 'EPIC' ? 'bg-purple-500/5 border-purple-500/10' :
                   badge.rarity === 'RARE' ? 'bg-blue-500/5 border-blue-500/10' :
                   'border-white/5'
                }`}
              >
                <div className={`size-12 rounded-xl flex items-center justify-center shrink-0 shadow-2xl transition-transform group-hover:scale-110 ${
                   badge.rarity === 'LEGENDARY' ? 'bg-yellow-500/20 text-yellow-500' :
                   badge.rarity === 'EPIC' ? 'bg-purple-500/20 text-purple-400' :
                   badge.rarity === 'RARE' ? 'bg-blue-500/20 text-blue-400' :
                   'bg-white/5 text-muted-custom'
                }`}>
                  <Award size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[11px] font-bold text-white truncate">{badge.name}</span>
                    <span className={`text-[7px] font-black uppercase tracking-tighter px-1 rounded-[2px] ${
                       badge.rarity === 'LEGENDARY' ? 'bg-yellow-500/20 text-yellow-500' :
                       badge.rarity === 'EPIC' ? 'bg-purple-500/20 text-purple-400' :
                       badge.rarity === 'RARE' ? 'bg-blue-500/20 text-blue-400' :
                       'bg-white/10 text-muted-custom'
                    }`}>{badge.rarity}</span>
                  </div>
                  <p className="text-[10px] text-muted-custom font-medium leading-tight">
                    {getBadgeDesc(badge.name)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="card-surface rounded-2xl p-12 border border-dashed border-white/5 flex flex-col items-center text-center">
             <Shield size={32} className="text-white/5 mb-4" />
             <p className="text-[10px] font-bold text-muted-custom uppercase tracking-widest">No badges earned yet</p>
          </div>
        )}
      </motion.div>

      {/* ─── Social Communities (Tribes) ─── */}
      {tribes.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h3 className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary-gold/60 mb-4">Tribal Affiliations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tribes.map((tribe: any) => (
              <div key={tribe.id} className="card-surface rounded-2xl p-4 flex items-center justify-between hover:border-primary-gold/20 transition-all cursor-pointer group border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-primary-gold/10 flex items-center justify-center overflow-hidden relative shadow-lg">
                    {tribe.logo ? (
                      <img src={tribe.logo} alt={tribe.name} className="w-full h-full object-cover" />
                    ) : (
                      <Users size={18} className="text-primary-gold" />
                    )}
                  </div>
                  <div>
                    <span className="text-[11px] font-bold block text-white group-hover:text-primary-gold transition-colors">{tribe.name}</span>
                    <span className="text-[9px] text-muted-custom font-bold">@{tribe.slug}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                   <span className="text-[8px] font-black uppercase tracking-widest text-primary-gold">Member</span>
                   <span className="text-[7px] text-muted-custom font-bold">{tribe._count?.members?.toLocaleString() || 0} kin</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Internal helper for descriptions until we have them in DB
function getBadgeDesc(name: string): string {
  if (name === 'Welcome') return 'Welcome to the Kihumba network.';
  if (name.includes('Pioneer')) return 'One of the first to join the revolution.';
  if (name === 'Early Adopter') return 'Joined during the platform alpha phase.';
  if (name.includes('Kao')) return 'Recognized for contributions to the marketplace.';
  if (name.includes('Influencer')) return 'A respected voice in the digital ecosystem.';
  if (name.includes('Warrior') || name.includes('Regular')) return 'Active daily contributor and resident.';
  return 'A token of merit for exceptional activity.';
}
