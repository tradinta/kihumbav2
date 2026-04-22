"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Play, Zap, DollarSign, Heart, 
  Users, Globe, Shield, LayoutGrid, 
  ArrowUpRight, BarChart2, TrendingUp,
  Clock, MapPin
} from 'lucide-react';

interface OverviewTabProps {
  data: any;
  content: any[];
  heatmap: number[];
}

const Badge = ({ children, gold }: { children: React.ReactNode; gold?: boolean }) => (
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border ${
    gold
      ? 'bg-primary-gold/10 text-primary-gold border-primary-gold/30'
      : 'bg-white/5 text-muted-custom border-white/10'
  }`}>
    {children}
  </span>
);

export default function OverviewTab({ data, content, heatmap }: OverviewTabProps) {
    const latest = content[0];
    const topAssets = [...content].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0)).slice(0, 4);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="space-y-6"
        >
            {/* ─── Metric Summary Grid ─── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Total Views" value={data?.totalViews?.toLocaleString() || "0"} trend="+12%" icon={<Zap size={14} />} />
                <StatCard label="Earnings" value={`KES ${data?.estimatedEarnings?.toLocaleString() || "0"}`} trend="+8%" icon={<DollarSign size={14} />} color="text-primary-gold" />
                <StatCard label="Upvotes" value={data?.totalUpvotes?.toLocaleString() || "0"} trend="+5%" icon={<Heart size={14} />} color="text-red-400" />
                <StatCard label="Followers" value="1.2K" trend="+2%" icon={<Users size={14} />} color="text-blue-400" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Latest Video Card — Matching KAO Listing Style */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-[10px] font-bold uppercase tracking-widest text-muted-custom px-1">Latest Upload</h2>
                    {latest ? (
                        <div className="card-surface rounded-lg overflow-hidden group">
                            <div className="flex flex-col md:flex-row">
                                <div className="w-full md:w-72 aspect-video relative overflow-hidden shrink-0">
                                    <img 
                                        src={latest.thumbnailUrl || `https://image.mux.com/${latest.playbackId}/thumbnail.jpg`} 
                                        className="size-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                        alt="" 
                                    />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="size-10 rounded-full bg-primary-gold text-black flex items-center justify-center shadow-lg"><Play size={18} fill="currentColor" /></div>
                                    </div>
                                    <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/60 text-[9px] font-bold text-white backdrop-blur-sm">
                                        {latest.duration ? `${Math.floor(latest.duration / 60)}:${(latest.duration % 60).toString().padStart(2, '0')}` : '0:00'}
                                    </div>
                                </div>
                                <div className="p-4 flex-1 flex flex-col justify-between">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-sm font-bold uppercase tracking-tight text-white group-hover:text-primary-gold transition-colors">{latest.title}</h3>
                                            <Badge gold>Active</Badge>
                                        </div>
                                        <p className="text-[10px] text-muted-custom line-clamp-2 leading-relaxed">{latest.description || 'No description provided'}</p>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-4">
                                        <div className="flex gap-4">
                                            <div className="space-y-1">
                                                <p className="text-[8px] font-bold text-muted-custom uppercase">Views</p>
                                                <p className="text-xs font-bold text-white">{(latest.viewCount || 0).toLocaleString()}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[8px] font-bold text-muted-custom uppercase">Interactions</p>
                                                <p className="text-xs font-bold text-white">0</p>
                                            </div>
                                        </div>
                                        <button className="h-7 px-3 rounded bg-white/5 border border-white/10 text-[9px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
                                            Analytics <ArrowUpRight size={12} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="py-20 text-center card-surface rounded-lg border-dashed border-white/10">
                            <Play size={32} className="mx-auto text-white/5 mb-4" />
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-custom">No content found</p>
                        </div>
                    )}
                </div>

                {/* Popular Content List */}
                <div className="space-y-4">
                    <h2 className="text-[10px] font-bold uppercase tracking-widest text-muted-custom px-1">Top Performing</h2>
                    <div className="card-surface rounded-lg p-4 space-y-4">
                        {topAssets.map((asset, i) => (
                            <div key={asset.id} className="flex items-center justify-between gap-4 group cursor-pointer">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="size-10 rounded bg-white/5 overflow-hidden shrink-0 border border-white/5">
                                        <img src={asset.thumbnailUrl || `https://image.mux.com/${asset.playbackId}/thumbnail.jpg`} className="size-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-bold text-white uppercase truncate group-hover:text-primary-gold transition-colors">{asset.title}</p>
                                        <p className="text-[8px] font-bold text-muted-custom uppercase tracking-widest mt-0.5">{(asset.viewCount || 0).toLocaleString()} views</p>
                                    </div>
                                </div>
                                <div className="size-6 rounded-full bg-white/5 flex items-center justify-center text-primary-gold opacity-0 group-hover:opacity-100 transition-all">
                                    <ArrowUpRight size={12} />
                                </div>
                            </div>
                        ))}
                        <button className="w-full py-2.5 mt-2 border border-white/10 rounded text-[9px] font-bold text-muted-custom uppercase tracking-widest hover:bg-white/5 transition-all">
                            View all content
                        </button>
                    </div>
                </div>
            </div>

            {/* Performance Snapshot */}
            <div className="card-surface rounded-lg p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <div className="space-y-1">
                        <h2 className="text-[10px] font-bold uppercase tracking-widest text-white">Channel Pulse</h2>
                        <p className="text-[8px] font-bold text-muted-custom uppercase tracking-widest">Performance over the last 24 hours</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="size-1.5 rounded-full bg-primary-gold animate-pulse" />
                        <span className="text-[9px] font-bold text-primary-gold uppercase tracking-widest">Live Sync</span>
                    </div>
                </div>
                
                <div className="h-24 flex items-end justify-between gap-1.5">
                    {heatmap.map((val: number, i: number) => (
                        <div 
                            key={i} 
                            className={`flex-1 rounded-sm transition-all ${val > 70 ? 'bg-primary-gold/40' : 'bg-white/5 hover:bg-white/10'}`} 
                            style={{ height: `${val}%` }} 
                        />
                    ))}
                </div>
                <div className="flex justify-between text-[8px] font-bold text-muted-custom uppercase tracking-widest pt-2 border-t border-white/5">
                    <span>Yesterday</span>
                    <span>Now</span>
                </div>
            </div>
        </motion.div>
    );
}

function StatCard({ label, value, trend, icon, color = "text-primary-gold" }: any) {
    return (
        <div className="card-surface rounded-lg p-4 space-y-3 hover:border-white/20 transition-all group">
            <div className="flex justify-between items-start">
                <div className={`size-7 rounded bg-white/5 flex items-center justify-center ${color} border border-white/5 group-hover:scale-110 transition-transform`}>
                    {icon}
                </div>
                <div className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-400">
                    <TrendingUp size={10} />
                    {trend}
                </div>
            </div>
            <div className="space-y-0.5">
                <p className="text-[9px] font-bold text-muted-custom uppercase tracking-widest">{label}</p>
                <h3 className="text-lg font-bold text-white tabular-nums">{value}</h3>
            </div>
        </div>
    );
}
