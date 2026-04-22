"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Plus, 
  Globe, 
  ArrowLeft, 
  TrendingUp, 
  BarChart3, 
  MousePointer2, 
  Eye, 
  Clock, 
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  Search
} from "lucide-react";

const MOCK_GENERIC_ADS = [
  { id: "GAD-901", name: "Eid Promo 2026", status: "Active", reach: "124,000", clicks: "4,200", ctr: "3.3%", spend: "KES 15,200", type: "In-Feed Post" },
  { id: "GAD-882", name: "Nightlife Weekend", status: "Completed", reach: "850,000", clicks: "12,100", ctr: "1.4%", spend: "KES 45,000", type: "Sparks" },
  { id: "GAD-773", name: "Tech Summit Pre-roll", status: "Paused", reach: "42,000", clicks: "1,800", ctr: "4.2%", spend: "KES 8,500", type: "Video Pre-roll" },
];

export default function GenericAdsManager() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-main font-inter text-main selection:bg-primary-gold/30">
      {/* Header */}
      <header className="border-b border-custom bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <button 
               onClick={() => router.push("/ads")}
               className="p-2 rounded-lg bg-white/5 border border-custom text-muted-custom hover:text-main transition-colors"
             >
                <ArrowLeft size={18} />
             </button>
             <div>
                <h1 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                   <Globe size={16} className="text-primary-gold" /> Generic Ad Management
                </h1>
                <p className="text-[10px] font-bold text-muted-custom uppercase tracking-widest mt-0.5">Global Reach • Social Surfaces</p>
             </div>
          </div>
          
          <button 
            onClick={() => router.push("/ads/create/generic")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-gold text-black text-[11px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-primary-gold/20"
          >
             <Plus size={16} /> New Generic Ad
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-12">
        
        {/* Aggregate Metrics Zone */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
           <MetricCard label="Total Reach" value="1.02M" sub="Past 30 Days" icon={<Eye size={18} />} />
           <MetricCard label="Avg. Click Rate" value="2.9%" sub="+0.4% vs last mo" icon={<TrendingUp size={18} />} />
           <MetricCard label="Total Spend" value="KES 68.7k" sub="12 active campaigns" icon={<BarChart3 size={18} />} />
           <MetricCard label="Avg. CPC" value="KES 11.2" sub="Optimized" icon={<MousePointer2 size={18} />} />
        </section>

        {/* Ledger Zone */}
        <section className="space-y-6">
           <div className="flex items-center justify-between">
              <h2 className="text-xs font-black uppercase tracking-widest text-muted-custom">Campaign Ledger</h2>
              <div className="flex items-center gap-3">
                 <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-custom">
                    <Search size={14} className="text-muted-custom" />
                    <input type="text" placeholder="Filter IDs..." className="bg-transparent border-none text-[10px] font-bold focus:outline-none w-32" />
                 </div>
              </div>
           </div>

           <div className="border border-custom rounded-2xl overflow-hidden bg-white/[0.02]">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="border-b border-custom bg-white/5">
                       <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-custom">Campaign ID / Name</th>
                       <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-custom">Status</th>
                       <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-custom">Format</th>
                       <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-custom text-right">Reach</th>
                       <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-custom text-right">Clicks</th>
                       <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-custom text-right">Spend</th>
                       <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-custom text-center">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-custom">
                    {MOCK_GENERIC_ADS.map((ad) => (
                       <tr key={ad.id} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="px-6 py-4">
                             <p className="text-[11px] font-black text-main">{ad.name}</p>
                             <p className="text-[9px] font-bold text-muted-custom font-mono mt-0.5">{ad.id}</p>
                          </td>
                          <td className="px-6 py-4">
                             <div className="flex items-center gap-2">
                                <div className={`size-1.5 rounded-full ${
                                   ad.status === 'Active' ? 'bg-emerald-500' : 
                                   ad.status === 'Paused' ? 'bg-amber-500' : 
                                   'bg-muted-custom'
                                }`} />
                                <span className="text-[10px] font-black uppercase tracking-widest">{ad.status}</span>
                             </div>
                          </td>
                          <td className="px-6 py-4 text-[10px] font-black text-muted-custom uppercase">{ad.type}</td>
                          <td className="px-6 py-4 text-right text-[11px] font-black text-main">{ad.reach}</td>
                          <td className="px-6 py-4 text-right">
                             <p className="text-[11px] font-black text-main">{ad.clicks}</p>
                             <p className="text-[9px] font-bold text-emerald-500">{ad.ctr} CTR</p>
                          </td>
                          <td className="px-6 py-4 text-right text-[11px] font-black text-primary-gold">{ad.spend}</td>
                          <td className="px-6 py-4 text-center">
                             <button className="p-2 rounded-lg hover:bg-white/5 text-muted-custom hover:text-main transition-colors">
                                <MoreVertical size={16} />
                             </button>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </section>

      </main>
    </div>
  );
}

function MetricCard({ label, value, sub, icon }: any) {
   return (
      <div className="p-6 rounded-2xl border border-custom bg-white/[0.02] space-y-4">
         <div className="flex items-center justify-between text-muted-custom">
            <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
            {icon}
         </div>
         <div>
            <p className="text-2xl font-black text-main tracking-tight">{value}</p>
            <p className="text-[10px] font-bold text-muted-custom mt-1 uppercase tracking-widest">{sub}</p>
         </div>
      </div>
   );
}
