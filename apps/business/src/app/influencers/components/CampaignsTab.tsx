"use client";

import { useState } from "react";
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Sparkles, 
  Users, 
  BarChart3, 
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useRouter } from "next/navigation";

const MOCK_BRIEFS = [
  { id: "BRF-901", name: "Summer Sneaker Drop", status: "Live", influencers: 14, deliverables: "42/50", reach: "120k", budget: "KES 240k" },
  { id: "BRF-882", name: "Eco-Friendly Kitchen Launch", status: "Draft", influencers: 0, deliverables: "0/10", reach: "0", budget: "KES 80k" },
  { id: "BRF-773", name: "Weekend Flash Sale", status: "Completed", influencers: 5, deliverables: "15/15", reach: "45k", budget: "KES 45k" },
];

export default function CampaignsTab() {
  const router = useRouter();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black tracking-tighter text-white">Campaign Architecture</h2>
          <p className="text-xs font-bold text-muted-custom uppercase tracking-widest mt-1">Manage creator briefs and live deliverable streams.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 focus-within:border-primary-gold/30 transition-all">
            <Search size={16} className="text-muted-custom" />
            <input 
              type="text" 
              placeholder="Search briefs..." 
              className="bg-transparent border-none text-[11px] font-black focus:outline-none w-48 uppercase tracking-widest" 
            />
          </div>
          <button 
            onClick={() => router.push("/influencers/create")}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-gold text-black text-[11px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-primary-gold/10"
          >
            <Plus size={16} /> Create Brief
          </button>
        </div>
      </div>

      <div className="border border-white/5 rounded-3xl overflow-hidden bg-white/[0.01]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-custom">Brief / ID</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-custom">Status</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-custom">Creators</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-custom text-right">Deliverables</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-custom text-right">Est. Reach</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-custom text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {MOCK_BRIEFS.map((brf) => (
              <tr key={brf.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-purple-500 border border-white/5">
                      <Sparkles size={18} />
                    </div>
                    <div>
                      <p className="text-[12px] font-black text-white">{brf.name}</p>
                      <p className="text-[9px] font-bold text-muted-custom font-mono mt-0.5 tracking-tighter">{brf.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    <div className={`size-1.5 rounded-full ${
                      brf.status === 'Live' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]' : 
                      brf.status === 'Draft' ? 'bg-amber-500' : 
                      'bg-muted-custom'
                    }`} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">{brf.status}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center -space-x-3">
                     {[1, 2, 3].map(i => (
                        <div key={i} className="size-7 rounded-full border-2 border-black bg-white/10 flex items-center justify-center text-[8px] font-black uppercase">
                           {brf.influencers > 0 ? <Users size={12} /> : '-'}
                        </div>
                     ))}
                     {brf.influencers > 3 && <span className="text-[9px] font-black text-muted-custom pl-4">+{brf.influencers - 3}</span>}
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <p className="text-[11px] font-black text-white">{brf.deliverables}</p>
                  <div className="w-24 h-1 bg-white/5 rounded-full ml-auto mt-2 overflow-hidden border border-white/5">
                    <div 
                      className="h-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.3)]" 
                      style={{ width: `${(Number(brf.deliverables.split('/')[0]) / Number(brf.deliverables.split('/')[1])) * 100}%` }} 
                    />
                  </div>
                </td>
                <td className="px-8 py-6 text-right text-[12px] font-black text-primary-gold">{brf.reach}</td>
                <td className="px-8 py-6 text-center">
                  <div className="flex justify-center gap-1">
                    <button className="p-2.5 rounded-xl hover:bg-white/5 text-muted-custom hover:text-white transition-all">
                      <BarChart3 size={18} />
                    </button>
                    <button className="p-2.5 rounded-xl hover:bg-white/5 text-muted-custom hover:text-white transition-all">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Verification Protocol Info */}
      <div className="p-6 rounded-3xl border border-purple-500/20 bg-purple-500/5 flex items-start gap-4">
         <AlertCircle size={20} className="text-purple-500 shrink-0 mt-1" />
         <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-purple-500 mb-1">Deliverable Integrity Protocol</h4>
            <p className="text-[11px] font-medium text-main/70 leading-relaxed uppercase">
               All influencer posts are automatically verified via the Kihumba AI Content Audit. 
               Payouts are released **72 hours** after post-verification to ensure minimum up-time compliance.
            </p>
         </div>
      </div>
    </div>
  );
}
