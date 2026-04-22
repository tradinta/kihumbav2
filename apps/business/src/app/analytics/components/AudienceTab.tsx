"use client";

import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { Users, Eye, TrendingUp, UserPlus } from "lucide-react";

const VIEWS_DATA = [
  { name: "Mon", views: 4000, followers: 240 },
  { name: "Tue", views: 3000, followers: 139 },
  { name: "Wed", views: 2000, followers: 980 },
  { name: "Thu", views: 2780, followers: 390 },
  { name: "Fri", views: 1890, followers: 480 },
  { name: "Sat", views: 2390, followers: 380 },
  { name: "Sun", views: 3490, followers: 430 },
];

export default function AudienceTab() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      
      {/* Audience Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard label="Total Page Views" value="1.2M" delta="+14.2%" icon={<Eye size={20} />} />
        <MetricCard label="Total Followers" value="840k" delta="+5.2%" icon={<Users size={20} />} />
        <MetricCard label="Follower Growth" value="14,200" sub="New this month" icon={<UserPlus size={20} />} color="text-emerald-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Page Views Chart */}
        <div className="p-8 rounded-3xl border border-white/5 bg-white/[0.01] space-y-6">
           <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-widest text-muted-custom">Page Views Velocity</h3>
              <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase">
                 <TrendingUp size={12} /> High Velocity
              </div>
           </div>
           <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={VIEWS_DATA}>
                    <defs>
                       <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis 
                       dataKey="name" 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{ fill: '#666', fontSize: 10, fontWeight: 900 }} 
                       dy={10}
                    />
                    <YAxis 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{ fill: '#666', fontSize: 10, fontWeight: 900 }} 
                    />
                    <Tooltip 
                       contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px' }}
                       itemStyle={{ color: '#D4AF37', fontSize: 12, fontWeight: 900 }}
                       labelStyle={{ display: 'none' }}
                    />
                    <Area type="monotone" dataKey="views" stroke="#D4AF37" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Follower Growth Chart */}
        <div className="p-8 rounded-3xl border border-white/5 bg-white/[0.01] space-y-6">
           <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-widest text-muted-custom">Follower Acquisition</h3>
              <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-purple-500/10 text-purple-500 text-[10px] font-black uppercase">
                 KPP Verified
              </div>
           </div>
           <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={VIEWS_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis 
                       dataKey="name" 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{ fill: '#666', fontSize: 10, fontWeight: 900 }} 
                       dy={10}
                    />
                    <YAxis 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{ fill: '#666', fontSize: 10, fontWeight: 900 }} 
                    />
                    <Tooltip 
                       contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px' }}
                       itemStyle={{ color: '#8b5cf6', fontSize: 12, fontWeight: 900 }}
                       labelStyle={{ display: 'none' }}
                    />
                    <Line type="monotone" dataKey="followers" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', r: 4 }} activeDot={{ r: 6 }} />
                 </LineChart>
              </ResponsiveContainer>
           </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, delta, sub, icon, color = "text-white" }: any) {
  return (
    <div className="p-6 rounded-3xl border border-white/5 bg-white/[0.01] space-y-3">
      <div className="flex items-center justify-between text-muted-custom">
        <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
        {icon}
      </div>
      <div>
        <div className="flex items-baseline gap-2">
           <p className={`text-3xl font-black tracking-tighter ${color}`}>{value}</p>
           {delta && <span className="text-[10px] font-black text-emerald-500 uppercase">{delta}</span>}
        </div>
        <p className="text-[10px] font-bold text-muted-custom uppercase mt-1 tracking-widest">{sub || "Platform Aggregate"}</p>
      </div>
    </div>
  );
}
