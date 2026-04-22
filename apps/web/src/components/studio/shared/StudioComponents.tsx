"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, LucideIcon } from 'lucide-react';

export const Badge = ({ children, gold }: { children: React.ReactNode; gold?: boolean }) => (
  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[2px] text-[8px] font-black uppercase tracking-[0.15em] border ${
    gold ? 'bg-primary-gold/10 text-primary-gold border-primary-gold/20' : 'bg-white/5 text-muted-custom border-white/5'
  }`}>{children}</span>
);

export function StatCard({ label, value, trend, metric }: { label: string; value: string; trend: number; metric: string }) {
    const isPositive = trend > 0;
    return (
        <div className="bg-[#0A0A0A] p-4 lg:p-6 border border-white/10 relative group hover:border-primary-gold/40 transition-all cursor-default shadow-lg">
            <span className="text-[8px] lg:text-[9px] font-black uppercase tracking-[0.3em] text-muted-custom block mb-2">{label}</span>
            <div className="flex items-baseline justify-between gap-2">
                <span className="text-xl lg:text-2xl font-black text-white tracking-tighter tabular-nums">{value}</span>
                <span className={`text-[10px] font-black flex items-center gap-0.5 ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                    {isPositive ? <ArrowUpRight size={12} strokeWidth={3} /> : <ArrowDownRight size={12} strokeWidth={3} />} {Math.abs(trend)}%
                </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/5 group-hover:bg-primary-gold transition-colors" />
        </div>
    );
}

export function DetailStat({ label, value, sub, trend, success }: { label: string; value: string; sub?: string; trend?: number; success?: boolean }) {
    return (
        <div className="flex justify-between items-center py-4 border-b border-white/5 last:border-none">
            <div>
                <p className="text-[10px] font-black text-muted-custom uppercase tracking-[0.2em]">{label}</p>
                {sub && <p className={`text-[9px] font-bold mt-1 uppercase ${success ? 'text-emerald-400' : 'text-white/30'}`}>{sub}</p>}
            </div>
            <div className="text-right">
                <p className="text-[13px] font-black text-white tabular-nums tracking-tight">{value}</p>
                {trend !== undefined && (
                   <p className={`text-[9px] font-black flex items-center justify-end gap-1 ${trend > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                     {trend > 0 ? <ArrowUpRight size={10} strokeWidth={3} /> : <ArrowDownRight size={10} strokeWidth={3} />} {Math.abs(trend)}%
                   </p>
                )}
            </div>
        </div>
    );
}

export function DemoBar({ label, percent }: { label: string; percent: number }) {
    return (
        <div className="space-y-3">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-white/60">{label}</span>
                <span className="text-white">{percent}%</span>
            </div>
            <div className="w-full h-1 bg-white/5 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${percent}%` }} transition={{ duration: 1.5 }} className="h-full bg-primary-gold" />
            </div>
        </div>
    );
}

export function RevItem({ label, val, p, color = "bg-emerald-400" }: { label: string; val: number; p: number; color?: string }) {
    return (
        <div className="space-y-3">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-white/40">{label} ({p}%)</span>
                <span className="text-white">KES {val.toLocaleString()}</span>
            </div>
            <div className="w-full h-1 bg-white/5 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${p}%` }} transition={{ duration: 2 }} className={`h-full ${color}`} />
            </div>
        </div>
    );
}
