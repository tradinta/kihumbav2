"use client";

import { motion } from "framer-motion";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock,
  ArrowUpRight,
  Eye,
  MousePointer2
} from "lucide-react";

export default function AnalyticsManager() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-main">Advanced Analytics</h1>
          <p className="text-[11px] font-bold text-muted-custom uppercase tracking-widest mt-1">
            Deep dive into your audience metrics
          </p>
        </div>
      </div>

      {/* Main Graph Placeholder */}
      <div className="card-surface p-6 rounded-2xl border border-custom min-h-[300px] flex flex-col justify-between">
         <div className="flex justify-between items-center mb-8">
           <h2 className="text-[12px] font-bold uppercase tracking-widest text-primary-gold flex items-center gap-2">
             <BarChart3 size={16} /> Views (Last 28 Days)
           </h2>
           <span className="text-[10px] font-bold uppercase tracking-widest text-muted-custom bg-[var(--pill-bg)] px-2 py-1 rounded">Daily</span>
         </div>
         
         {/* Fake Graph Lines */}
         <div className="w-full flex-1 flex items-end gap-1 sm:gap-2">
           {Array.from({ length: 28 }).map((_, i) => {
             const height = Math.floor(Math.random() * 80) + 10;
             return (
               <div 
                 key={i} 
                 className="flex-1 bg-primary-gold/20 hover:bg-primary-gold transition-colors rounded-t cursor-pointer"
                 style={{ height: `${height}%` }}
               />
             );
           })}
         </div>
         <div className="w-full border-t border-custom mt-2 pt-2 flex justify-between text-[8px] font-bold text-muted-custom">
            <span>Oct 01</span>
            <span>Oct 28</span>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card-surface p-5 rounded-2xl border border-custom relative overflow-hidden group">
           <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Eye size={60} /></div>
           <h3 className="text-[10px] uppercase font-bold text-muted-custom tracking-widest mb-1">Impressions</h3>
           <div className="flex items-baseline gap-2 relative z-10">
             <span className="text-2xl font-black text-main">4.2M</span>
             <span className="text-[10px] font-bold text-emerald-400 flex items-center"><ArrowUpRight size={10} /> 12%</span>
           </div>
        </div>
        <div className="card-surface p-5 rounded-2xl border border-custom relative overflow-hidden group">
           <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><MousePointer2 size={60} /></div>
           <h3 className="text-[10px] uppercase font-bold text-muted-custom tracking-widest mb-1">Click-Through Rate</h3>
           <div className="flex items-baseline gap-2 relative z-10">
             <span className="text-2xl font-black text-main">8.4%</span>
             <span className="text-[10px] font-bold text-emerald-400 flex items-center"><ArrowUpRight size={10} /> 2.1%</span>
           </div>
        </div>
        <div className="card-surface p-5 rounded-2xl border border-custom relative overflow-hidden group">
           <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Clock size={60} /></div>
           <h3 className="text-[10px] uppercase font-bold text-muted-custom tracking-widest mb-1">Avg. View Duration</h3>
           <div className="flex items-baseline gap-2 relative z-10">
             <span className="text-2xl font-black text-main">4:12</span>
             <span className="text-[10px] font-bold text-emerald-400 flex items-center"><ArrowUpRight size={10} /> 0.5%</span>
           </div>
        </div>
        <div className="card-surface p-5 rounded-2xl border border-custom relative overflow-hidden group">
           <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Users size={60} /></div>
           <h3 className="text-[10px] uppercase font-bold text-muted-custom tracking-widest mb-1">Unique Viewers</h3>
           <div className="flex items-baseline gap-2 relative z-10">
             <span className="text-2xl font-black text-main">850K</span>
             <span className="text-[10px] font-bold text-emerald-400 flex items-center"><ArrowUpRight size={10} /> 15%</span>
           </div>
        </div>
      </div>

    </div>
  );
}
