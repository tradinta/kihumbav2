"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, 
  Search, 
  Star,
  Plus,
  ArrowRight,
  Filter,
  Users,
  Wallet,
  Clock,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  FileText,
  X
} from "lucide-react";
import { businessData } from "@/data/businessData";

export default function InfluencerCampaignManager() {
  const { influencerCampaigns, directory, wallet } = businessData;
  const [showDeployModal, setShowDeployModal] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* ─── Business Suite Hero Stats ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Active Creators" value={influencerCampaigns.length.toString()} icon={Users} color="text-blue-500" />
        <StatCard label="Total Spent (YTD)" value={`KES ${(wallet.totalSpentYTD / 1000).toFixed(0)}k`} icon={Wallet} color="text-emerald-400" />
        <StatCard label="Average KTS" value="92.4" icon={ShieldCheck} color="text-amber-500" />
        <StatCard label="Pending Content" value="3 Drafts" icon={FileText} color="text-blue-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ─── Main Campaign Monitor (LEFT) ─── */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-main">Campaign Monitor</h1>
              <p className="text-[10px] font-bold text-muted-custom uppercase tracking-widest mt-1">Manage Handshakes & Escrow Releases</p>
            </div>
            <button 
                onClick={() => setShowDeployModal(true)}
                className="px-6 py-2.5 bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20"
            >
              <Plus size={16} strokeWidth={3} /> Deploy New Brief
            </button>
          </div>

          <div className="space-y-4">
            {influencerCampaigns.map((camp, i) => (
              <motion.div 
                key={camp.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="card-surface p-6 rounded-[2rem] border border-white/5 group hover:border-blue-500/30 transition-all flex flex-col md:flex-row gap-6 md:items-center relative overflow-hidden"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="size-14 rounded-2xl border border-white/10 overflow-hidden shrink-0 bg-white/5">
                    <img src={camp.creator.avatar} alt={camp.creator.handle} className="size-full object-cover" />
                  </div>
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-black text-white truncate">{camp.task}</h3>
                      <StatusPill status={camp.status} />
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-bold text-muted-custom tracking-widest uppercase">
                       <span className="text-blue-500">@{camp.creator.handle}</span>
                       <span className="flex items-center gap-1"><Clock size={12} /> {camp.dueDate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between lg:justify-end gap-6 lg:min-w-[320px] pt-4 md:pt-0 border-t border-white/5 md:border-none">
                  <div className="text-center md:text-right">
                    <span className="block text-[10px] uppercase font-black text-muted-custom tracking-widest mb-1">Contract</span>
                    <span className="block text-[14px] font-black text-emerald-400 tabular-nums">KES {camp.budget.toLocaleString()}</span>
                  </div>
                  <div className="flex gap-2">
                    {camp.status === 'Review Required' ? (
                        <button className="px-5 py-2 rounded-xl bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/10 active:scale-95 transition-all">Review Draft</button>
                    ) : (
                        <button className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Manage</button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ─── Creator Directory / Quick Add (RIGHT) ─── */}
        <div className="space-y-6">
           <div className="flex justify-between items-center">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-custom">Certified Network</h2>
              <button className="text-[10px] font-black uppercase tracking-widest text-blue-500 flex items-center gap-1">Browse All <ArrowRight size={12} /></button>
           </div>
           
           <div className="card-surface p-6 rounded-[2.5rem] border border-white/5 space-y-6">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-custom" />
                <input 
                  type="text" 
                  placeholder="Filter by niche..."
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-bold focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="space-y-3">
                {directory.slice(0, 4).map((creator, i) => (
                  <div key={creator.id} className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/5 group hover:border-blue-500/20 transition-all cursor-pointer">
                    <div className="flex items-center gap-3">
                      <img src={creator.avatar} alt="" className="size-10 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all" />
                      <div>
                        <p className="text-[11px] font-black text-white">{creator.name}</p>
                        <div className="flex items-center gap-1.5 text-[8px] font-bold text-muted-custom uppercase">
                            <span className="text-blue-500">{creator.niche}</span>
                            <span>•</span>
                            <span className="flex items-center gap-0.5">{creator.trustScore} <Star size={8} className="fill-current text-amber-500" /></span>
                        </div>
                      </div>
                    </div>
                    <button className="size-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 opacity-0 group-hover:opacity-100 transition-all"><Plus size={16} /></button>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 border-t border-white/5">
                <p className="text-[10px] font-bold text-muted-custom leading-relaxed">
                    <ShieldCheck size={12} className="inline mr-1 text-blue-500" /> All creators listed are Kihumba Partner Program (KPP) verified.
                </p>
              </div>
           </div>
        </div>

      </div>

      {/* ─── NEW BRIEF MODAL ─── */}
      <AnimatePresence>
        {showDeployModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setShowDeployModal(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-xl card-surface rounded-[3rem] border border-blue-500/20 p-8 md:p-10 shadow-2xl overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-8">
                    <button onClick={() => setShowDeployModal(false)} className="size-10 rounded-full bg-white/5 flex items-center justify-center text-muted-custom hover:text-white transition-colors"><X size={20} /></button>
                </div>

                <div className="mb-8">
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-2">Campaign Forge</p>
                    <h2 className="text-3xl font-black text-main tracking-tighter italic uppercase">Deploy Brief</h2>
                </div>

                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setShowDeployModal(false); }}>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-custom ml-1">Campaign Title</label>
                        <input type="text" placeholder="e.g. 5G Launch Campaign Part 2" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:border-blue-500 lg:text-base" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-custom ml-1">Platform</label>
                            <select className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:border-blue-500 appearance-none">
                                <option>TikTok</option>
                                <option>Instagram</option>
                                <option>YouTube</option>
                                <option>X Premium</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-custom ml-1">Total Payout (KES)</label>
                            <input type="number" placeholder="50,000" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:border-blue-500" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-custom ml-1">Deliverables & Brief</label>
                        <textarea rows={3} placeholder="Describe exactly what the creator needs to produce..." className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:border-blue-500" />
                    </div>

                    <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 flex gap-4">
                        <AlertCircle className="text-blue-500 shrink-0" size={20} />
                        <p className="text-[11px] font-bold text-blue-500/80 leading-relaxed">
                            Budget will be held in **Secure Kihumba Escrow** once the creator accepts. Funds are only released 72 hours after your final approval.
                        </p>
                    </div>

                    <button className="w-full py-5 rounded-[2rem] bg-blue-500 text-white text-[11px] font-black uppercase tracking-[0.3em] shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all">
                        Deploy Final Brief
                    </button>
                </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

// ─── Shared Components ───────────────────────────────────────────────────────

function StatCard({ label, value, icon: Icon, color }: any) {
    return (
        <div className="card-surface p-4 lg:p-6 rounded-2xl border border-white/5 relative group hover:border-blue-500/30 transition-all">
            <div className="flex justify-between items-start mb-2">
               <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-custom block">{label}</span>
               <Icon size={14} className={color} />
            </div>
            <span className="text-xl lg:text-2xl font-black text-main tracking-tight tabular-nums">{value}</span>
        </div>
    );
}

function StatusPill({ status }: { status: string }) {
    const styles: Record<string, string> = {
      Drafting: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      "Awaiting Acceptance": "bg-blue-500/10 text-blue-500 border-blue-500/20",
      "Review Required": "bg-purple-500/10 text-purple-500 border-purple-500/20",
      Published: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    };
    return (
      <span className={`px-2 py-0.5 rounded-[4px] text-[8px] font-black uppercase tracking-widest border ${styles[status]}`}>
        {status}
      </span>
    );
}
