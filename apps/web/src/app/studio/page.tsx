"use client";

import { motion } from "framer-motion";
import { 
  TrendingUp, 
  BarChart3, 
  Wallet,
  ArrowUpRight,
  Eye,
  Clock,
  Video
} from "lucide-react";
import { studioData } from "@/data/studioData";

export default function StudioDashboard() {
  const { analyticsOverview: data, content } = studioData;
  const latestVideo = content[0];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-main">Channel Dashboard</h1>
          <p className="text-[11px] font-bold text-muted-custom uppercase tracking-widest mt-1">
            Overview · Last 28 Days
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Latest Video Performance */}
        <div className="card-surface p-6 rounded-2xl border border-primary-gold/10">
          <h2 className="text-[12px] font-bold uppercase tracking-widest text-primary-gold mb-4 flex items-center gap-2">
            <Video size={16} /> Latest Performance
          </h2>
          
          <div className="aspect-video w-full rounded-xl overflow-hidden relative mb-4">
            <img src={latestVideo.thumbnail} alt={latestVideo.title} className="w-full h-full object-cover" />
            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[9px] font-bold text-white tracking-widest uppercase">
              {latestVideo.type}
            </div>
          </div>
          
          <h3 className="text-sm font-bold truncate mb-4">{latestVideo.title}</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-custom">
              <span className="text-[11px] font-bold text-muted-custom">Views</span>
              <span className="text-[12px] font-bold">{latestVideo.views.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-custom">
              <span className="text-[11px] font-bold text-muted-custom">Likes</span>
              <span className="text-[12px] font-bold">{latestVideo.likes.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-custom">
              <span className="text-[11px] font-bold text-muted-custom">Est. Revenue</span>
              <span className="text-[12px] font-bold text-emerald-400">KES {latestVideo.revenue.toLocaleString()}</span>
            </div>
          </div>
          
          <button className="w-full mt-4 text-[10px] uppercase font-bold text-primary-gold hover:text-white transition-colors">
            Go to Video Analytics
          </button>
        </div>

        {/* Channel Analytics Summary */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card-surface p-6 rounded-2xl border border-custom">
            <h2 className="text-[12px] font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
              <BarChart3 size={16} className="text-primary-gold" /> Channel Analytics
            </h2>
            
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[var(--pill-bg)] border border-custom">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-custom mb-1 flex items-center justify-between">
                  Views <Eye size={12} className="text-primary-gold/50" />
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black">{(data.views28Days / 1000000).toFixed(1)}M</span>
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center">
                    <ArrowUpRight size={12} /> {data.viewsTrend}%
                  </span>
                </div>
              </div>
              
              <div className="p-4 rounded-xl bg-[var(--pill-bg)] border border-custom">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-custom mb-1 flex items-center justify-between">
                  Watch Time (hrs) <Clock size={12} className="text-primary-gold/50" />
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black">{data.watchTimeHours.toLocaleString()}</span>
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center">
                    <ArrowUpRight size={12} /> {data.watchTimeTrend}%
                  </span>
                </div>
              </div>
              
              <div className="p-4 rounded-xl bg-[var(--pill-bg)] border border-custom lg:col-span-1 col-span-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-custom mb-1 flex items-center justify-between">
                  Subscribers <TrendingUp size={12} className="text-primary-gold/50" />
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black">+{data.followersGained.toLocaleString()}</span>
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center">
                    <ArrowUpRight size={12} /> {data.followersTrend}%
                  </span>
                </div>
              </div>
            </div>
            
            <button className="mt-6 text-[10px] uppercase font-bold text-primary-gold hover:text-white transition-colors">
              Go to Full Analytics
            </button>
          </div>

          <div className="card-surface p-6 rounded-2xl border border-primary-gold/10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary-gold opacity-5 group-hover:opacity-10 transition-opacity" />
            
            <h2 className="text-[12px] font-bold uppercase tracking-widest text-primary-gold mb-6 flex items-center gap-2">
              <Wallet size={16} /> Revenue Breakdown
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-custom mb-1">Total Ad Revenue</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-emerald-400">KES {(data.adRevenueKES / 1000).toFixed(1)}k</span>
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center">
                    <ArrowUpRight size={12} /> {data.adRevenueTrend}%
                  </span>
                </div>
              </div>
              
              <div className="w-px bg-custom hidden sm:block" />
              
              <div className="flex-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-custom mb-1">Direct Brand Tasks</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-primary-gold">KES {(data.campaignRevenueKES / 1000).toFixed(1)}k</span>
                  <span className="text-[10px] font-bold text-red-400 flex items-center">
                    <ArrowUpRight size={12} className="rotate-90" /> {Math.abs(data.campaignRevenueTrend)}%
                  </span>
                </div>
              </div>
            </div>
            
            <button className="mt-6 text-[10px] uppercase font-bold text-main hover:text-primary-gold transition-colors underline decoration-custom underline-offset-4">
              Manage Payouts
            </button>
          </div>
        </div>
      </div>
    
    </div>
  );
}
