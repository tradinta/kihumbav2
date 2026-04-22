'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, School, Info, ShieldCheck, User } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

export default function AboutAccountModal({ isOpen, onClose, user }: Props) {
  if (!isOpen) return null;

  const details = [
    { 
      icon: MapPin, 
      label: 'Origin', 
      value: user.county || user.country || 'Kenya',
      color: 'text-indigo-400',
      bg: 'bg-indigo-400/10'
    },
    { 
      icon: Calendar, 
      label: 'Member Since', 
      value: new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      color: 'text-primary-gold',
      bg: 'bg-primary-gold/10'
    },
    { 
      icon: School, 
      label: 'Institution', 
      value: user.institution || 'Independent',
      color: 'text-blue-400',
      bg: 'bg-blue-400/10'
    },
    { 
      icon: ShieldCheck, 
      label: 'Account Status', 
      value: user.isVerified ? 'Verified Identity' : 'Standard Member',
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10'
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-sm bg-[var(--card-bg)] border border-[var(--border-color)] rounded-sm overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-sm bg-white/5 flex items-center justify-center text-primary-gold">
                <Info size={20} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">About this account</h2>
                <p className="text-[10px] font-bold text-muted-custom uppercase tracking-widest">Transparency Report</p>
              </div>
            </div>
            <button onClick={onClose} className="text-muted-custom hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* User Mini Card */}
          <div className="p-6 pb-0">
             <div className="flex items-center gap-4 p-4 bg-white/5 rounded-sm border border-white/5">
                <div className="size-12 rounded-sm overflow-hidden border border-white/10 bg-black/40">
                   <img src={user.avatar || '/branding/avatar-fallback.png'} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                   <span className="text-xs font-bold block text-white">{user.fullName}</span>
                   <span className="text-[10px] font-bold text-primary-gold">@{user.username}</span>
                </div>
             </div>
          </div>

          {/* Details */}
          <div className="p-6 space-y-4">
             {details.map((item, i) => (
                <div key={i} className="flex items-center gap-4 group">
                   <div className={`size-10 rounded-sm ${item.bg} ${item.color} flex items-center justify-center shrink-0 transition-transform group-hover:scale-110`}>
                      <item.icon size={18} />
                   </div>
                   <div>
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-custom block mb-0.5">{item.label}</span>
                      <span className="text-xs font-bold text-white">{item.value}</span>
                   </div>
                </div>
             ))}
          </div>

          {/* Footer Info */}
          <div className="p-6 pt-0">
             <div className="p-4 rounded-sm bg-indigo-500/5 border border-indigo-500/10 flex gap-3 items-start">
                <ShieldCheck size={16} className="text-indigo-400 shrink-0 mt-0.5" />
                <p className="text-[10px] font-medium text-indigo-200/60 leading-relaxed">
                   To protect our community, Kihumba verifies registration data and locality. This information is shared to build trust between creators and fans.
                </p>
             </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
