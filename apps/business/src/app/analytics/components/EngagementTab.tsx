"use client";

import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from "recharts";
import { MessageCircle, Heart, Share2, MapPin } from "lucide-react";

const COUNTY_DATA = [
  { name: "Nairobi", value: 45, color: "#D4AF37" },
  { name: "Mombasa", value: 15, color: "#8b5cf6" },
  { name: "Kiambu", value: 20, color: "#10b981" },
  { name: "Nakuru", value: 10, color: "#3b82f6" },
  { name: "Kisumu", value: 10, color: "#f59e0b" },
];

const INTERACTION_TYPES = [
  { name: "Likes", value: 42000 },
  { name: "Comments", value: 12500 },
  { name: "Shares", value: 8400 },
  { name: "Saves", value: 3200 },
];

export default function EngagementTab() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      
      {/* Interaction Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <EngageMetric label="Total Interactions" value="66.1k" delta="+18%" icon={<Heart size={18} />} />
        <EngageMetric label="Avg. Response" value="4m" sub="Corporate DMs" icon={<MessageCircle size={18} />} color="text-emerald-500" />
        <EngageMetric label="Viral Coefficient" value="1.4x" sub="Share Velocity" icon={<Share2 size={18} />} color="text-purple-500" />
        <EngageMetric label="County Reach" value="47" sub="All Counties Active" icon={<MapPin size={18} />} color="text-primary-gold" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* County Breakdown - Fancy Pie Chart */}
        <div className="lg:col-span-1 p-8 rounded-3xl border border-white/5 bg-white/[0.01] space-y-8">
           <h3 className="text-xs font-black uppercase tracking-widest text-muted-custom">Geographic Pulse (By County)</h3>
           <div className="h-64 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                       data={COUNTY_DATA}
                       cx="50%"
                       cy="50%"
                       innerRadius={60}
                       outerRadius={80}
                       paddingAngle={8}
                       dataKey="value"
                       stroke="none"
                    >
                       {COUNTY_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                       ))}
                    </Pie>
                    <Tooltip 
                       contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px' }}
                       itemStyle={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase' }}
                    />
                 </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="text-center">
                    <p className="text-2xl font-black text-white">100%</p>
                    <p className="text-[8px] font-black text-muted-custom uppercase">Coverage</p>
                 </div>
              </div>
           </div>
           
           <div className="space-y-3">
              {COUNTY_DATA.map(c => (
                 <div key={c.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <div className="size-2 rounded-full" style={{ backgroundColor: c.color }} />
                       <span className="text-[10px] font-black text-white uppercase">{c.name}</span>
                    </div>
                    <span className="text-[10px] font-black text-muted-custom">{c.value}%</span>
                 </div>
              ))}
           </div>
        </div>

        {/* Interaction Bar Chart */}
        <div className="lg:col-span-2 p-8 rounded-3xl border border-white/5 bg-white/[0.01] space-y-8">
           <h3 className="text-xs font-black uppercase tracking-widest text-muted-custom">Interaction Anatomy</h3>
           <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={INTERACTION_TYPES} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" horizontal={false} />
                    <XAxis type="number" hide />
                    <YAxis 
                       dataKey="name" 
                       type="category" 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{ fill: '#fff', fontSize: 10, fontWeight: 900 }} 
                       width={80}
                    />
                    <Tooltip 
                       cursor={{ fill: 'transparent' }}
                       contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px' }}
                       itemStyle={{ color: '#D4AF37', fontSize: 12, fontWeight: 900 }}
                    />
                    <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                       {INTERACTION_TYPES.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? '#D4AF37' : '#ffffff10'} />
                       ))}
                    </Bar>
                 </BarChart>
              </ResponsiveContainer>
           </div>
           
           <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
              <p className="text-[11px] font-medium text-muted-custom leading-relaxed uppercase italic">
                 Interaction volume is **18% higher** on weekdays between 7:00 PM and 9:00 PM (EAT).
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}

function EngageMetric({ label, value, delta, sub, icon, color = "text-white" }: any) {
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
        <p className="text-[10px] font-bold text-muted-custom uppercase mt-1 tracking-widest">{sub || "Social Interaction"}</p>
      </div>
    </div>
  );
}
