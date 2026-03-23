"use client";

import { motion } from "framer-motion";
import { 
  Building2, 
  TrendingUp, 
  Users, 
  Megaphone,
  ArrowUpRight,
  MousePointer2,
  Wallet
} from "lucide-react";
import { businessData } from "@/data/businessData";

export default function BusinessDashboard() {
  const { overview, wallet } = businessData;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-main">Business Overview</h1>
          <p className="text-[11px] font-bold text-muted-custom uppercase tracking-widest mt-1">
            Performance summary · Last 30 Days
          </p>
        </div>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:brightness-110 transition-colors flex items-center gap-2">
          <Megaphone size={14} /> Quick Ad
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Wallet & Spend Snapshot */}
        <div className="card-surface p-6 rounded-2xl border border-blue-500/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Wallet size={80} className="text-blue-500" />
          </div>
          
          <h2 className="text-[12px] font-bold uppercase tracking-widest text-blue-500 mb-6 flex items-center gap-2 relative z-10">
            Ad Account Balance
          </h2>
          
          <div className="relative z-10">
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-3xl font-black text-main">KES {(wallet.availableBalanceKES / 1000).toFixed(1)}k</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-custom">
                <span className="text-[10px] uppercase font-bold text-muted-custom tracking-widest">Total Spent (YTD)</span>
                <span className="text-[12px] font-bold">KES {(wallet.totalSpentYTD / 1000).toFixed(1)}k</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-custom">
                <span className="text-[10px] uppercase font-bold text-muted-custom tracking-widest">Active Ads</span>
                <span className="text-[12px] font-bold text-blue-500">{overview.totalActiveAds}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-custom">
                <span className="text-[10px] uppercase font-bold text-muted-custom tracking-widest">Active Influencers</span>
                <span className="text-[12px] font-bold text-blue-500">{overview.totalActiveInfluencers}</span>
              </div>
            </div>
            
            <button className="w-full mt-4 text-[10px] uppercase font-bold text-main hover:text-blue-500 transition-colors underline decoration-custom underline-offset-4">
              Add Funds
            </button>
          </div>
        </div>

        {/* Campaign Analytics Summary */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card-surface p-6 rounded-2xl border border-custom">
            <h2 className="text-[12px] font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
              <TrendingUp size={16} className="text-blue-500" /> Return on Ad Spend (ROAS)
            </h2>
            
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[var(--pill-bg)] border border-custom">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-custom mb-1 flex items-center justify-between">
                  Ad Reach <Users size={12} className="text-blue-500/50" />
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black">{(overview.totalReach30d / 1000000).toFixed(1)}M</span>
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center">
                    <ArrowUpRight size={12} /> {overview.reachTrend}%
                  </span>
                </div>
              </div>
              
              <div className="p-4 rounded-xl bg-[var(--pill-bg)] border border-custom">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-custom mb-1 flex items-center justify-between">
                  Conversions <MousePointer2 size={12} className="text-blue-500/50" />
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black">{(overview.totalConversions30d / 1000).toFixed(1)}k</span>
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center">
                    <ArrowUpRight size={12} /> {overview.conversionTrend}%
                  </span>
                </div>
              </div>
              
              <div className="p-4 rounded-xl bg-[var(--pill-bg)] border border-custom lg:col-span-1 col-span-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-custom mb-1 flex items-center justify-between">
                  Avg. CPC <TrendingUp size={12} className="text-blue-500/50" />
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black">KES {overview.avgCPC}</span>
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center">
                    <ArrowUpRight size={12} className="rotate-90 text-emerald-400" /> {Math.abs(overview.cpcTrend)}%
                  </span>
                </div>
              </div>
            </div>
            
            {/* Fake Graph */}
            <div className="mt-8 h-32 flex items-end gap-1 w-full opacity-60">
              {Array.from({ length: 30 }).map((_, i) => {
                const height = Math.floor(Math.random() * 80) + 20;
                return (
                  <div key={i} className="flex-1 bg-blue-500/20 hover:bg-blue-500/50 transition-colors rounded-t" style={{ height: `${height}%` }} />
                );
              })}
            </div>
            
          </div>
        </div>

      </div>
    
    </div>
  );
}
