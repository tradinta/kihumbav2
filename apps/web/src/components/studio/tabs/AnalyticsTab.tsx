"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, Users, Globe, Zap, ArrowUpRight, 
  BarChart3, Target, MousePointer2, Clock,
  ShieldCheck, TrendingUp, Search
} from 'lucide-react';

interface AnalyticsTabProps {
  data: any;
  content: any[];
  heatmap: number[];
}

export default function AnalyticsTab({ data, content, heatmap }: AnalyticsTabProps) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="space-y-6"
        >
            {/* ─── Top Level Stats ─── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <AnalyticModule label="Total Reach" value="1.2M" sub="+12.4% vs last mo" icon={<Zap size={16} />} />
                <AnalyticModule label="Avg. Views" value="8.4K" sub="+8.2% vs last mo" icon={<Activity size={16} />} color="text-primary-gold" />
                <AnalyticModule label="Followers" value="12.8K" sub="+1.2% vs last mo" icon={<Users size={16} />} color="text-blue-400" />
                <AnalyticModule label="Watch Time" value="4.2Kh" sub="+5.6% vs last mo" icon={<Clock size={16} />} color="text-emerald-400" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Growth Chart */}
                <div className="lg:col-span-2 card-surface rounded-lg p-6 space-y-6">
                    <div className="flex justify-between items-center px-1">
                        <div className="space-y-1">
                            <h2 className="text-[10px] font-bold uppercase tracking-widest text-white">Audience Growth</h2>
                            <p className="text-[8px] font-bold text-muted-custom uppercase tracking-widest">Views over the last 30 days</p>
                        </div>
                        <div className="flex gap-1.5 p-0.5 card-surface rounded-lg">
                            {['7D', '30D', '90D'].map(p => (
                                <button key={p} className={`px-3 py-1 rounded text-[8px] font-bold uppercase tracking-widest transition-all ${p === '30D' ? 'bg-primary-gold/15 text-primary-gold' : 'text-muted-custom'}`}>{p}</button>
                            ))}
                        </div>
                    </div>

                    <div className="h-64 w-full relative group">
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path 
                                d="M 0 80 Q 15 75, 30 40 T 50 35 T 70 60 T 90 55 T 100 20" 
                                fill="none" 
                                stroke="rgba(212,175,55,0.2)" 
                                strokeWidth="1" 
                                strokeDasharray="2 2"
                            />
                            <motion.path 
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                                d="M 0 95 Q 15 90, 30 40 T 50 35 T 70 60 T 90 55 T 100 30" 
                                fill="none" 
                                stroke="#d4af37" 
                                strokeWidth="2" 
                            />
                        </svg>
                    </div>

                    <div className="flex justify-between text-[8px] font-bold text-muted-custom uppercase tracking-widest pt-4 border-t border-white/5">
                        <span>1 Apr</span>
                        <span>15 Apr</span>
                        <span>Today</span>
                    </div>
                </div>

                {/* Demographic Mini Card */}
                <div className="card-surface rounded-lg p-6 space-y-6">
                    <h2 className="text-[10px] font-bold uppercase tracking-widest text-white px-1">Audience Location</h2>
                    <div className="space-y-4">
                        <DemoItem label="Nairobi" percent={70} />
                        <DemoItem label="Mombasa" percent={18} />
                        <DemoItem label="Kisumu" percent={7} />
                        <DemoItem label="Others" percent={5} />
                    </div>
                    <button className="w-full py-2.5 mt-4 border border-white/10 rounded text-[9px] font-bold text-muted-custom uppercase tracking-widest hover:bg-white/5 transition-all">
                        Full Demographics
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

function AnalyticModule({ label, value, sub, icon, color = "text-white" }: any) {
    return (
        <div className="card-surface rounded-lg p-4 space-y-3 hover:border-white/20 transition-all group">
            <div className="flex justify-between items-start">
                <div className={`size-7 rounded bg-white/5 flex items-center justify-center ${color} border border-white/5 group-hover:scale-110 transition-transform shadow-inner`}>
                    {icon}
                </div>
                <div className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
                    <TrendingUp size={10} />
                </div>
            </div>
            <div className="space-y-0.5">
                <p className="text-[9px] font-bold text-muted-custom uppercase tracking-widest">{label}</p>
                <h3 className="text-lg font-bold text-white tabular-nums">{value}</h3>
                <p className="text-[8px] font-bold text-muted-custom/60 uppercase tracking-widest mt-1">{sub}</p>
            </div>
        </div>
    );
}

function DemoItem({ label, percent }: { label: string, percent: number }) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest">
                <span className="text-white">{label}</span>
                <span className="text-muted-custom">{percent}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-primary-gold/40 rounded-full" style={{ width: `${percent}%` }} />
            </div>
        </div>
    );
}
