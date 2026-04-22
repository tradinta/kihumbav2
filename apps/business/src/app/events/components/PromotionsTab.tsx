"use client";

import { 
  Plus, 
  Trash2, 
  Search, 
  Tag, 
  Users, 
  TrendingUp, 
  Zap, 
  Percent,
  Calendar,
  Award
} from "lucide-react";

const MOCK_PROMOS = [
  { code: "JAZZ20", type: "Flash Deal", discount: "20%", usage: "45 / 50", status: "Active", impact: "KES 140k" },
  { code: "KH-CREATOR-01", type: "Influencer", discount: "15%", usage: "12 / 100", status: "Active", impact: "KES 42k" },
  { code: "EARLYBIRD", type: "Automatic", discount: "KES 500", usage: "200 / 200", status: "Expired", impact: "KES 310k" },
];

export default function PromotionsTab() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      
      {/* Marketing Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PromoMetric label="Promo Attribution" value="12%" sub="Total Sales via Codes" icon={<Tag size={20} />} />
        <PromoMetric label="Conversion Boost" value="+18%" sub="via Flash Deal Hooks" icon={<TrendingUp size={20} />} color="text-emerald-500" />
        <PromoMetric label="Active Campaigns" value="4" sub="Influence & Direct" icon={<Zap size={20} />} color="text-purple-500" />
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Campaign Ledger */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-widest text-muted-custom">Campaign Registry</h3>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-custom" />
                <input 
                  type="text" 
                  placeholder="Filter codes..." 
                  className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black focus:outline-none focus:border-primary-gold/30 w-48 uppercase tracking-widest"
                />
              </div>
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-gold text-black text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-primary-gold/10">
                <Plus size={14} /> New Code
              </button>
            </div>
          </div>

          <div className="border border-white/5 rounded-3xl overflow-hidden bg-white/[0.01]">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-6 py-4 font-black uppercase tracking-widest text-muted-custom">Code / Architecture</th>
                  <th className="px-6 py-4 font-black uppercase tracking-widest text-muted-custom">Discount</th>
                  <th className="px-6 py-4 font-black uppercase tracking-widest text-muted-custom text-center">Usage</th>
                  <th className="px-6 py-4 font-black uppercase tracking-widest text-muted-custom">Impact</th>
                  <th className="px-6 py-4 font-black uppercase tracking-widest text-muted-custom text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {MOCK_PROMOS.map((promo) => (
                  <tr key={promo.code} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-primary-gold">
                          <Tag size={16} />
                        </div>
                        <div>
                           <p className="font-black text-white font-mono tracking-widest">{promo.code}</p>
                           <p className="text-[9px] font-bold text-muted-custom uppercase tracking-widest mt-0.5">{promo.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-black text-[10px]">{promo.discount}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <div className="space-y-1">
                          <p className="font-black text-white">{promo.usage}</p>
                          <div className="w-16 h-1 bg-white/5 rounded-full mx-auto overflow-hidden">
                             <div 
                               className="h-full bg-primary-gold" 
                               style={{ width: `${(Number(promo.usage.split(' / ')[0]) / Number(promo.usage.split(' / ')[1])) * 100}%` }} 
                             />
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-4 font-black text-white">{promo.impact}</td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                          <button className="p-2 rounded-lg hover:bg-white/5 text-muted-custom hover:text-white transition-all">
                             <Award size={14} />
                          </button>
                          <button className="p-2 rounded-lg hover:bg-red-500/10 text-muted-custom hover:text-red-500 transition-all">
                             <Trash2 size={14} />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Promo Configuration Guide */}
        <div className="w-full md:w-80 space-y-6">
           <h3 className="text-xs font-black uppercase tracking-widest text-muted-custom">Incentive Strategy</h3>
           <div className="p-6 rounded-3xl border border-white/5 bg-white/[0.01] space-y-8">
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-primary-gold/10 text-primary-gold flex items-center justify-center"><Percent size={16} /></div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Dynamic Discounts</h4>
                 </div>
                 <p className="text-[11px] font-medium text-muted-custom leading-relaxed uppercase">
                    Early Bird logic automatically increases ticket prices as capacity thresholds are met.
                 </p>
              </div>

              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center"><Users size={16} /></div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Influencer Attribution</h4>
                 </div>
                 <p className="text-[11px] font-medium text-muted-custom leading-relaxed uppercase">
                    Generate unique referral codes for Kihumba Creators to track affiliate sales.
                 </p>
              </div>

              <div className="pt-6 border-t border-white/5">
                 <div className="p-4 rounded-xl bg-primary-gold/5 border border-primary-gold/10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary-gold mb-2 flex items-center gap-2">
                       <Zap size={14} /> Flash Hook Note
                    </p>
                    <p className="text-[11px] font-medium text-muted-custom/80 leading-relaxed italic uppercase">
                       Flash deals with restricted usage (e.g. first 50) have a 3x higher conversion rate in the events feed.
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function PromoMetric({ label, value, sub, icon, color = "text-white" }: any) {
  return (
    <div className="p-6 rounded-3xl border border-white/5 bg-white/[0.01] space-y-3">
      <div className="flex items-center justify-between text-muted-custom">
        <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
        {icon}
      </div>
      <div>
        <p className={`text-3xl font-black tracking-tighter ${color}`}>{value}</p>
        <p className="text-[10px] font-bold text-muted-custom uppercase mt-1 tracking-widest">{sub}</p>
      </div>
    </div>
  );
}
