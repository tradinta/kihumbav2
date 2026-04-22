"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, Clock, CheckCircle2, ArrowUpRight, 
  FileText, AlertCircle, Play, Zap, ChevronRight, 
  Globe, Wallet, ShieldCheck, Star
} from 'lucide-react';
import { api } from '@/lib/api';
import MarketplaceModal from './MarketplaceModal';
import SubmitDraftModal from './SubmitDraftModal';

interface CampaignBrief {
  id: string;
  status: string;
  payoutAmount: number;
  draftUrl?: string;
  dueDate?: string;
  campaign: {
    id: string;
    title: string;
    description: string;
    deliverables: any;
    brand: {
      name: string;
      avatar: string;
      fullName: string;
    }
  }
}

interface CampaignsTabProps {
  campaigns: CampaignBrief[];
  partnerProfile: any;
  videos: any[];
  refresh: () => void;
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

export default function CampaignsTab({ campaigns, partnerProfile, videos, refresh }: CampaignsTabProps) {
  const [filter, setFilter] = useState('ALL');
  const [showMarketplace, setShowMarketplace] = useState(false);
  const [activeBriefForDraft, setActiveBriefForDraft] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const handleAcceptBrief = async (briefId: string) => {
    try {
      setIsProcessing(briefId);
      await api.patch(`/partner/brief/${briefId}/accept`);
      refresh();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to accept brief');
    } finally {
      setIsProcessing(null);
    }
  };

  const filteredBriefs = campaigns.filter(b => 
    filter === 'ALL' || b.status.toUpperCase() === filter
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      
      {/* ─── Partnership Summary ─── */}
      <div className="card-surface rounded-lg p-5 flex flex-col md:flex-row items-center justify-between gap-6 border-primary-gold/20 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 pointer-events-none transition-opacity">
            <Zap size={64} className="text-primary-gold" />
        </div>
        <div className="flex items-center gap-4 relative z-10">
            <div className="size-12 rounded-full bg-primary-gold flex items-center justify-center text-black shadow-lg shadow-primary-gold/20">
                <ShieldCheck size={24} />
            </div>
            <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-white">Partner Program</h2>
                <div className="flex items-center gap-2 mt-0.5">
                    <Badge gold>Verified</Badge>
                    <span className="text-[9px] font-bold text-muted-custom uppercase">Score: {partnerProfile?.kts || 80}/100</span>
                </div>
            </div>
        </div>
        <div className="flex gap-8 relative z-10">
            <div className="text-center md:text-right">
                <p className="text-[8px] font-bold text-muted-custom uppercase tracking-widest mb-1">Active Missions</p>
                <p className="text-xl font-bold text-white tabular-nums">{campaigns.length}</p>
            </div>
            <div className="text-center md:text-right">
                <p className="text-[8px] font-bold text-muted-custom uppercase tracking-widest mb-1">Tier Level</p>
                <p className="text-xl font-bold text-primary-gold uppercase tracking-tighter">Elite</p>
            </div>
        </div>
      </div>

      {/* ─── Marketplace Entry ─── */}
      <div className="card-surface rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-primary-gold/30 transition-all cursor-pointer group" onClick={() => setShowMarketplace(true)}>
          <div className="flex items-center gap-5">
              <div className="size-14 rounded bg-white/5 flex items-center justify-center text-primary-gold border border-white/5 group-hover:scale-105 transition-transform">
                  <Globe size={28} />
              </div>
              <div className="space-y-1 text-center md:text-left">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-white">Browse Marketplace</h3>
                  <p className="text-[10px] text-muted-custom font-medium uppercase tracking-wider">Find new campaigns from top brands</p>
              </div>
          </div>
          <button className="h-9 px-6 rounded bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:bg-primary-gold transition-all flex items-center gap-2">
              Marketplace <ArrowUpRight size={14} />
          </button>
      </div>

      {/* ─── Active Briefs List ─── */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-muted-custom">My Campaigns</h2>
            <div className="flex gap-1.5 p-0.5 card-surface rounded-lg">
                {['ALL', 'PENDING', 'ACCEPTED'].map(f => (
                    <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1 rounded text-[8px] font-bold uppercase tracking-widest transition-all ${filter === f ? 'bg-primary-gold/15 text-primary-gold' : 'text-muted-custom'}`}>{f}</button>
                ))}
            </div>
        </div>

        <div className="space-y-3">
            {filteredBriefs.map((brief, i) => (
                <motion.div 
                    key={brief.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="card-surface rounded-lg p-4 flex flex-col lg:flex-row items-center gap-6 hover:border-white/20 transition-all group"
                >
                    <div className="flex items-center gap-4 flex-1 w-full">
                        <div className="size-14 rounded overflow-hidden border border-white/10 shrink-0 bg-white/5">
                            <img src={brief.campaign.brand.avatar} alt="" className="size-full object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-[11px] font-bold uppercase tracking-widest truncate text-white group-hover:text-primary-gold transition-colors">{brief.campaign.title}</h3>
                                <Badge gold>Premium</Badge>
                            </div>
                            <div className="flex items-center gap-3 text-[9px] font-bold text-muted-custom uppercase">
                                <span className="flex items-center gap-1.5"><Building2 size={12} className="text-primary-gold" /> {brief.campaign.brand.name}</span>
                                <span className="flex items-center gap-1.5"><Clock size={12} /> {brief.dueDate ? new Date(brief.dueDate).toLocaleDateString() : 'ASAP'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between lg:justify-end gap-6 w-full lg:w-auto border-t lg:border-none border-white/5 pt-4 lg:pt-0">
                        <div className="text-right flex flex-col items-end">
                            <span className="text-[8px] font-bold text-muted-custom uppercase tracking-widest mb-0.5">Payout</span>
                            <span className="text-base font-bold text-emerald-400 tabular-nums">KES {brief.payoutAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex gap-2">
                            <button className="h-8 px-4 rounded bg-white/5 border border-white/10 text-[9px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all">Details</button>
                            {brief.status === 'PENDING' && (
                                <button 
                                    onClick={() => handleAcceptBrief(brief.id)}
                                    disabled={isProcessing === brief.id}
                                    className="h-8 px-4 rounded bg-white text-black text-[9px] font-bold uppercase tracking-widest hover:bg-primary-gold transition-all disabled:opacity-50"
                                >
                                    {isProcessing === brief.id ? 'Loading...' : 'Accept'}
                                </button>
                            )}
                            {brief.status === 'ACCEPTED' && (
                                <button 
                                    onClick={() => setActiveBriefForDraft(brief.id)}
                                    className="h-8 px-4 rounded bg-primary-gold text-black text-[9px] font-bold uppercase tracking-widest hover:brightness-110 transition-all flex items-center gap-1.5"
                                >
                                    Submit Draft <ChevronRight size={14} strokeWidth={3} />
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            ))}
            {filteredBriefs.length === 0 && (
                <div className="py-16 text-center card-surface rounded-lg border-dashed border-white/10">
                    <Zap size={24} className="mx-auto text-white/5 mb-3" />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-custom">No active missions found</p>
                </div>
            )}
        </div>
      </div>

      <AnimatePresence>
          {showMarketplace && <MarketplaceModal onClose={() => setShowMarketplace(false)} onRefresh={refresh} />}
          {activeBriefForDraft && (
              <SubmitDraftModal 
                briefId={activeBriefForDraft}
                videos={videos || []}
                onClose={() => setActiveBriefForDraft(null)} 
                onRefresh={refresh}
              />
          )}
      </AnimatePresence>
    </motion.div>
  );
}
