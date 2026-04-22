"use client";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { Megaphone, MousePointer2, TrendingUp, Zap } from "lucide-react";

const AD_PERFORMANCE = [
  { name: "Video Ads", views: 450000, ctr: "2.4%" },
  { name: "Image Ads", views: 280000, ctr: "1.8%" },
  { name: "Kao Featured", views: 120000, ctr: "4.2%" },
  { name: "Marketplace", views: 340000, ctr: "3.1%" },
];

export default function AdsTab() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      
      {/* Ad Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <AdMetric label="Total Ad Views" value="1.19M" delta="+8%" icon={<Megaphone size={18} />} />
        <AdMetric label="Average CTR" value="2.8%" sub="Platform-wide" icon={<MousePointer2 size={18} />} color="text-primary-gold" />
        <AdMetric label="Conversion Rate" value="4.2%" delta="+0.4%" icon={<Zap size={18} />} color="text-emerald-500" />
        <AdMetric label="Est. ROI" value="4.2x" sub="Revenue Attributed" icon={<TrendingUp size={18} />} />
      </div>

      <div className="p-8 rounded-3xl border border-white/5 bg-white/[0.01] space-y-8">
         <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-widest text-muted-custom">Ad Unit Velocity (Views)</h3>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 text-[10px] font-black text-white uppercase"><div className="size-2 rounded-full bg-primary-gold" /> Impressions</div>
            </div>
         </div>
         
         <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
               <BarChart data={AD_PERFORMANCE}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis 
                     dataKey="name" 
                     axisLine={false} 
                     tickLine={false} 
                     tick={{ fill: '#666', fontSize: 10, fontWeight: 900, textTransform: 'uppercase' }} 
                     dy={10}
                  />
                  <YAxis 
                     axisLine={false} 
                     tickLine={false} 
                     tick={{ fill: '#666', fontSize: 10, fontWeight: 900 }} 
                  />
                  <Tooltip 
                     cursor={{ fill: '#ffffff05' }}
                     contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px' }}
                     itemStyle={{ color: '#D4AF37', fontSize: 12, fontWeight: 900 }}
                  />
                  <Bar dataKey="views" radius={[8, 8, 0, 0]}>
                     {AD_PERFORMANCE.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#D4AF37' : '#ffffff10'} />
                     ))}
                  </Bar>
               </BarChart>
            </ResponsiveContainer>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-8 border-t border-white/5">
            {AD_PERFORMANCE.map(unit => (
               <div key={unit.name} className="space-y-2">
                  <p className="text-[9px] font-black text-muted-custom uppercase tracking-widest">{unit.name}</p>
                  <div className="flex items-baseline gap-2">
                     <p className="text-lg font-black text-white">{unit.ctr}</p>
                     <span className="text-[9px] font-black text-emerald-500 uppercase">CTR</span>
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
}

function AdMetric({ label, value, delta, sub, icon, color = "text-white" }: any) {
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
        <p className="text-[10px] font-bold text-muted-custom uppercase mt-1 tracking-widest">{sub || "Campaign Aggregate"}</p>
      </div>
    </div>
  );
}
