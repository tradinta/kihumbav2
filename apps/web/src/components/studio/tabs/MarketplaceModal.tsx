"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, Wallet, Users, ChevronRight, Globe, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';

interface MarketplaceModalProps {
    onClose: () => void;
    onRefresh: () => void;
}

export default function MarketplaceModal({ onClose, onRefresh }: MarketplaceModalProps) {
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState<string | null>(null);

    useEffect(() => {
        fetchMarketplace();
    }, []);

    const fetchMarketplace = async () => {
        try {
            const res = await api.get('/partner/marketplace');
            setCampaigns(res);
        } catch (err) {
            console.error('Marketplace pulse failed', err);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async (campaignId: string) => {
        try {
            setApplying(campaignId);
            await api.post(`/partner/campaign/${campaignId}/apply`);
            onRefresh();
            onClose();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Application failed');
        } finally {
            setApplying(null);
        }
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/95 backdrop-blur-md"
            />
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 10 }}
                className="relative w-full max-w-5xl h-[85vh] bg-[#0A0A0A] border border-white/10 rounded-none flex flex-col overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)]"
            >
                {/* Header */}
                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">Industrial Marketplace</h2>
                        <p className="text-[10px] font-black text-primary-gold uppercase tracking-[0.4em] mt-2">Discover premium brand missions for Kihumba Partners</p>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-white/5 transition-colors">
                        <X size={28} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto no-scrollbar p-10">
                    {loading ? (
                        <div className="h-full flex flex-col items-center justify-center space-y-6">
                            <div className="size-16 border-2 border-primary-gold border-t-transparent animate-spin" />
                            <p className="text-[11px] font-black uppercase tracking-[0.5em] text-white/20">Syncing Marketplace Coordinates...</p>
                        </div>
                    ) : campaigns.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                            <Globe size={64} className="text-white/5" strokeWidth={1} />
                            <div className="space-y-2">
                                <h3 className="text-xl font-black text-white/40 uppercase tracking-[0.4em]">Empty Sector</h3>
                                <p className="text-[10px] text-white/10 max-w-xs mx-auto font-black uppercase tracking-widest">No active brand transmissions detected in this cycle.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {campaigns.map((campaign) => (
                                <div key={campaign.id} className="bg-[#0A0A0A] p-8 border border-white/10 group hover:border-primary-gold/40 transition-all flex flex-col justify-between rounded-none shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                        <Building2 size={80} />
                                    </div>
                                    <div className="space-y-8 relative z-10">
                                        <div className="flex justify-between items-start">
                                            <div className="size-20 border border-white/10 overflow-hidden bg-white/5 rounded-none group-hover:border-primary-gold/40 transition-colors shadow-inner">
                                                <img src={campaign.brand.avatar} alt={campaign.brand.name} className="size-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black text-emerald-400 uppercase tracking-widest rounded-none">
                                                Operational
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-3">
                                            <h3 className="text-2xl font-black text-white group-hover:text-primary-gold transition-colors leading-none uppercase tracking-tight">{campaign.title}</h3>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-black text-primary-gold uppercase tracking-[0.2em]">{campaign.brand.name}</span>
                                            </div>
                                            <p className="text-[11px] text-white/30 font-medium line-clamp-3 leading-relaxed uppercase tracking-wider">{campaign.description}</p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
                                            <div className="flex items-center gap-4">
                                                <div className="size-10 bg-white/5 border border-white/5 flex items-center justify-center text-primary-gold"><Wallet size={20} strokeWidth={2.5} /></div>
                                                <div>
                                                    <p className="text-xs font-black text-white uppercase tabular-nums tracking-tighter">KES {(campaign.budgetTotal / 10).toLocaleString()}</p>
                                                    <p className="text-[9px] font-black text-muted-custom uppercase tracking-widest">Avg Bounty</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="size-10 bg-white/5 border border-white/5 flex items-center justify-center text-blue-400"><Users size={20} strokeWidth={2.5} /></div>
                                                <div>
                                                    <p className="text-xs font-black text-white uppercase tabular-nums tracking-tighter">10 Nodes</p>
                                                    <p className="text-[9px] font-black text-muted-custom uppercase tracking-widest">Available</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={() => handleApply(campaign.id)}
                                        disabled={applying === campaign.id}
                                        className="mt-10 w-full py-5 bg-white text-black text-[12px] font-black uppercase tracking-[0.3em] shadow-[0_0_50px_rgba(0,0,0,1)] hover:bg-primary-gold transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 rounded-none"
                                    >
                                        {applying === campaign.id ? 'Authorizing Mission...' : (
                                            <>Initialize Mission <ChevronRight size={18} strokeWidth={3} /></>
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer Policy */}
                <div className="p-8 bg-white/[0.02] border-t border-white/10 flex items-center gap-6 text-left relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary-gold" />
                    <AlertCircle size={24} className="text-primary-gold shrink-0" strokeWidth={3} />
                    <p className="text-[10px] font-black text-muted-custom leading-normal uppercase tracking-widest">
                        INDUSTRIAL PROTOCOL: By initializing an application, you agree to the Kihumba Partner Terms. All missions are auto-authorized during this simulation cycle.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
