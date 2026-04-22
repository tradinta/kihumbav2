"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Search, Filter, Trash2, 
  MessageCircle, Star, Shield, Clock,
  MoreVertical, Heart, Reply, Flag
} from 'lucide-react';

interface CommentsTabProps {
  content: any[];
}

const Badge = ({ children, gold }: { children: React.ReactNode; gold?: boolean }) => (
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border ${
    gold
      ? 'bg-primary-gold/10 text-primary-gold border-primary-gold/30'
      : 'bg-white/5 text-muted-custom border-white/10'
  }`}>
    {children}
  </span>
);

export default function CommentsTab({ content }: CommentsTabProps) {
  const [filter, setFilter] = useState('ALL');

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* ─── Community Controls ─── */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex gap-1.5 p-0.5 card-surface rounded-lg w-full md:w-auto overflow-x-auto no-scrollbar">
            {['ALL', 'UNANSWERED', 'SPAM'].map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded text-[9px] font-bold uppercase tracking-widest transition-all ${filter === f ? 'bg-primary-gold/15 text-primary-gold' : 'text-muted-custom'}`}>{f}</button>
            ))}
        </div>
        <div className="flex-1 md:w-64 card-surface rounded-lg px-3 py-2 flex items-center gap-2 w-full md:w-auto">
            <Search size={14} className="text-muted-custom/60" />
            <input type="text" placeholder="Search comments…" className="bg-transparent outline-none text-[10px] font-bold placeholder:text-muted-custom/50 w-full" />
        </div>
      </div>

      {/* ─── Comment Feed ─── */}
      <div className="space-y-4">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-muted-custom px-1">Community Activity</h2>
        <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
                <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 12 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: i * 0.05 }}
                    className="card-surface rounded-lg p-5 flex flex-col md:flex-row gap-6 hover:border-white/20 transition-all group"
                >
                    <div className="flex items-start gap-4 flex-1">
                        <div className="size-10 rounded-full bg-white/5 flex items-center justify-center text-primary-gold border border-white/10 shrink-0">
                            <MessageCircle size={20} />
                        </div>
                        <div className="space-y-2 min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="text-[11px] font-bold text-white uppercase tracking-tight">Kihumba Fan</span>
                                <Badge gold>Top Fan</Badge>
                                <span className="text-[9px] font-bold text-muted-custom uppercase tabular-nums">2h ago</span>
                            </div>
                            <p className="text-xs text-muted-custom leading-relaxed line-clamp-2">This is an amazing update! Love how compact and smooth the studio is feeling now. Can't wait to see more.</p>
                            <div className="flex items-center gap-4 pt-2">
                                <button className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-muted-custom hover:text-red-400 transition-colors">
                                    <Heart size={12} /> 12
                                </button>
                                <button className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-muted-custom hover:text-primary-gold transition-colors">
                                    <Reply size={12} /> Reply
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-row md:flex-col justify-between md:items-end gap-4 w-full md:w-48 border-t md:border-none border-white/5 pt-4 md:pt-0">
                        <div className="flex items-center gap-2">
                            <div className="size-8 rounded bg-white/5 overflow-hidden border border-white/10">
                                <img src={`https://image.mux.com/${content[0]?.playbackId}/thumbnail.jpg`} className="size-full object-cover opacity-60" alt="" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[8px] font-bold text-muted-custom uppercase truncate">In response to:</p>
                                <p className="text-[9px] font-bold text-white uppercase truncate w-32">{content[0]?.title || 'Recent Video'}</p>
                            </div>
                        </div>
                        <div className="flex gap-1">
                            <button className="size-8 rounded-full hover:bg-white/5 flex items-center justify-center text-muted-custom hover:text-white transition-all"><Flag size={14} /></button>
                            <button className="size-8 rounded-full hover:bg-white/5 flex items-center justify-center text-muted-custom hover:text-red-400 transition-all"><Trash2 size={14} /></button>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
        <div className="py-10 text-center card-surface rounded-lg bg-white/[0.01]">
            <p className="text-[10px] font-bold text-muted-custom/40 uppercase tracking-widest">End of Activity</p>
        </div>
      </div>
    </motion.div>
  );
}
