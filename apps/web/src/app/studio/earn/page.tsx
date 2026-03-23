"use client";

import { motion } from "framer-motion";
import { 
  Building2, 
  ArrowUpRight,
  Filter,
  Search,
  MessageSquare,
  Clock,
  Wallet,
  ArrowRightLeft,
  CircleDollarSign,
  Download
} from "lucide-react";
import { studioData } from "@/data/studioData";

export default function EarnManager() {
  const { recentPayouts, analyticsOverview, eligibility } = studioData;

  const StatusPill = ({ status }: { status: string }) => (
    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
      {status}
    </span>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-main">Ledger & Earn</h1>
          <p className="text-[11px] font-bold text-muted-custom uppercase tracking-widest mt-1">
            Manage your unified Creator Wallet
          </p>
        </div>
        
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-primary-gold text-black rounded-lg text-[10px] font-bold uppercase tracking-widest hover:brightness-110 transition-colors flex items-center gap-2">
            <ArrowRightLeft size={14} /> Withdraw Funds
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Wallet Balance Card */}
        <div className="card-surface p-6 rounded-2xl border border-primary-gold/30 bg-gradient-to-br from-primary-gold/10 to-transparent relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all">
            <Wallet size={80} className="text-primary-gold" />
          </div>
          
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-primary-gold mb-8 flex items-center gap-2 relative z-10">
            Current Balance
          </h2>
          
          <div className="relative z-10">
            <span className="text-sm font-bold text-muted-custom mb-1 block">Available KES</span>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-5xl font-black tracking-tight">185,200</span>
            </div>
            
            <div className="flex gap-4 border-t border-primary-gold/20 pt-4">
               <div>
                 <span className="block text-[9px] uppercase font-bold text-primary-gold tracking-widest mb-0.5">Ad Revenue</span>
                 <span className="block text-sm font-bold">+ {analyticsOverview.adRevenueKES.toLocaleString()}</span>
               </div>
               <div className="w-px bg-primary-gold/20" />
               <div>
                 <span className="block text-[9px] uppercase font-bold text-primary-gold tracking-widest mb-0.5">Campaigns</span>
                 <span className="block text-sm font-bold">+ {analyticsOverview.campaignRevenueKES.toLocaleString()}</span>
               </div>
            </div>
          </div>
        </div>

        {/* Partner Program Status */}
        <div className="lg:col-span-2 card-surface p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10">
             <CircleDollarSign size={80} className="text-emerald-500" />
           </div>
           
           <h2 className="text-[12px] font-bold uppercase tracking-widest text-emerald-500 mb-6 flex items-center gap-2 relative z-10">
             ✓ Kihumba Partner Program Active
           </h2>
           
           <p className="text-[11px] font-bold text-muted-custom leading-relaxed max-w-lg mb-6 relative z-10">
             You meet all minimum requirements for monetization. Your account is actively earning a 55% split on Long-Form videos, participating in the Sparks Creator Fund, and is eligible to receive direct Campaign Briefs from brands.
           </p>
           
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
              <div className="bg-[var(--pill-bg)] rounded-xl p-3 border border-emerald-500/20 flex flex-col justify-center text-center">
                 <span className="text-lg font-black text-emerald-400">{(eligibility.impressions.current / 1000).toFixed(0)}k</span>
                 <span className="text-[8px] uppercase font-bold text-muted-custom tracking-widest">30d Impressions</span>
              </div>
              <div className="bg-[var(--pill-bg)] rounded-xl p-3 border border-emerald-500/20 flex flex-col justify-center text-center">
                 <span className="text-lg font-black text-emerald-400">Active</span>
                 <span className="text-[8px] uppercase font-bold text-muted-custom tracking-widest">Premium Status</span>
              </div>
              <div className="bg-[var(--pill-bg)] rounded-xl p-3 border border-emerald-500/20 flex flex-col justify-center text-center">
                 <span className="text-lg font-black text-emerald-400">{eligibility.kihumbaScore.current}</span>
                 <span className="text-[8px] uppercase font-bold text-muted-custom tracking-widest">Trust Score</span>
              </div>
           </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="card-surface rounded-2xl border border-custom overflow-hidden">
        <div className="p-5 border-b border-custom flex justify-between items-center">
          <h3 className="text-[12px] font-bold uppercase tracking-widest text-main">Ledger History</h3>
          <button className="text-[9px] uppercase font-bold tracking-widest text-primary-gold hover:text-white transition-colors flex items-center gap-1">
            <Download size={12} /> Export CSV
          </button>
        </div>
        
        <div className="w-full overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-custom bg-[var(--pill-bg)]">
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-muted-custom">Date</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-muted-custom">Source</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-muted-custom">Amount</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-muted-custom text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentPayouts.map((payout, i) => (
                <motion.tr 
                  key={payout.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-custom/50 hover:bg-white/5 transition-colors"
                >
                  <td className="p-4">
                    <span className="text-[11px] font-bold text-muted-custom">{payout.date}</span>
                  </td>
                  
                  <td className="p-4">
                    <span className="text-[12px] font-bold text-main">{payout.source}</span>
                  </td>

                  <td className="p-4">
                    <span className="text-[12px] font-black text-emerald-400">+KES {payout.amount.toLocaleString()}</span>
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex justify-end">
                      <StatusPill status={payout.status} />
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
