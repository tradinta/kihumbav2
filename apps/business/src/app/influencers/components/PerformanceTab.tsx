"use client";

import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Zap, 
  ArrowUpRight, 
  PieChart,
  MessageSquare,
  Share2,
  Heart
} from "lucide-react";

export default function PerformanceTab() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      
      {/* Campaign Aggregate Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <PerfMetric label="Total Platform Reach" value="2.4M" delta="+22%" icon={<Users size={18} />} />
        <PerfMetric label="Avg. Engagement Rate" value="4.8%" sub="via Kihumba Audit" icon={<Heart size={18} />} color="text-purple-500" />
        <PerfMetric label="Direct Conversions" value="1,842" sub="Attributed Sales" icon={<Zap size={18} />} color="text-primary-gold" />
        <PerfMetric label="Campaign ROI" value="4.2x" delta="+0.4" icon={<TrendingUp size={18} />} color="text-emerald-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Engagement Breakdown */}
        <div className="md:col-span-2 p-8 rounded-3xl border border-white/5 bg-white/[0.01] space-y-8">
           <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-widest text-muted-custom">Engagement Narrative</h3>
              <div className="flex gap-4">
                 <div className="flex items-center gap-2 text-[10px] font-black text-white uppercase"><Heart size={14} className="text-red-500" /> Likes</div>
                 <div className="flex items-center gap-2 text-[10px] font-black text-white uppercase"><MessageSquare size={14} className="text-blue-500" /> Comments</div>
                 <div className="flex items-center gap-2 text-[10px] font-black text-white uppercase"><Share2 size={14} className="text-emerald-500" /> Shares</div>
              </div>
           </div>
           
           <div className="h-64 flex items-end gap-2 px-4 border-b border-white/5 pb-2">
              {[60, 45, 80, 55, 90, 70, 85, 40, 65, 75, 50, 95].map((h, i) => (
                 <div key={i} className="flex-1 flex flex-col gap-1 items-center group">
                    <div className="w-full bg-purple-500/10 rounded-t-lg relative overflow-hidden flex flex-col justify-end" style={{ height: `${h}%` }}>
                       <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                       <div className="w-full bg-purple-500 h-1/3 opacity-50" />
                    </div>
                    <span className="text-[8px] font-bold text-muted-custom/50 uppercase tracking-tighter">Apr {1+i}</span>
                 </div>
              ))}
           </div>
           
           <div className="grid grid-cols-3 gap-6">
              <div className="space-y-1">
                 <p className="text-[9px] font-black text-muted-custom uppercase">Total Interactions</p>
                 <p className="text-xl font-black text-white">420.5k</p>
              </div>
              <div className="space-y-1">
                 <p className="text-[9px] font-black text-muted-custom uppercase">Audience Sentiment</p>
                 <p className="text-xl font-black text-emerald-500">92% Positive</p>
              </div>
              <div className="space-y-1">
                 <p className="text-[9px] font-black text-muted-custom uppercase">Viral Velocity</p>
                 <p className="text-xl font-black text-purple-500">High</p>
              </div>
           </div>
        </div>

        {/* Top Performers */}
        <div className="space-y-6">
           <h3 className="text-xs font-black uppercase tracking-widest text-muted-custom">Top Performers</h3>
           <div className="p-6 rounded-3xl border border-white/5 bg-white/[0.01] space-y-6">
              {[
                { name: "Elsa Majimbo", reach: "1.2M", er: "5.4%" },
                { name: "Azziad Nasenya", reach: "840k", er: "4.2%" },
                { name: "Nviiri", reach: "410k", er: "6.1%" },
              ].map((inf, idx) => (
                <div key={idx} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0">
                   <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-black text-primary-gold border border-white/5">{idx + 1}</div>
                      <div>
                         <p className="text-[11px] font-black text-white uppercase">{inf.name}</p>
                         <p className="text-[9px] font-bold text-muted-custom uppercase tracking-widest">{inf.reach} Reach</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-[11px] font-black text-emerald-500">{inf.er}</p>
                      <p className="text-[9px] font-bold text-muted-custom uppercase tracking-widest">ER</p>
                   </div>
                </div>
              ))}
              
              <button className="w-full py-3 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/5 transition-all">
                 View All Creator ROI
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}

function PerfMetric({ label, value, delta, sub, icon, color = "text-white" }: any) {
  return (
    <div className="p-6 rounded-3xl border border-white/5 bg-white/[0.01] space-y-3">
      <div className="flex items-center justify-between text-muted-custom">
        <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
        {icon}
      </div>
      <div>
        <div className="flex items-baseline gap-2">
           <p className={`text-2xl font-black tracking-tighter ${color}`}>{value}</p>
           {delta && <span className="text-[10px] font-black text-emerald-500 uppercase">{delta}</span>}
        </div>
        <p className="text-[10px] font-bold text-muted-custom uppercase mt-1 tracking-widest">{sub || "Historical Aggregate"}</p>
      </div>
    </div>
  );
}
