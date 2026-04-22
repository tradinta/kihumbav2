"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, TrendingUp, ArrowUpRight, ShieldCheck, 
  CreditCard, Wallet, Activity, Database, Zap,
  Lock, Clock, ChevronRight, BarChart2, CheckCircle2
} from 'lucide-react';

interface RevenueTabProps {
  data: any;
  payouts: number;
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

export default function RevenueTab({ data, payouts }: RevenueTabProps) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="space-y-6"
        >
            {/* ─── Balance Summary ─── */}
            <div className="card-surface rounded-lg p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 pointer-events-none transition-opacity">
                    <Wallet size={120} className="text-primary-gold" />
                </div>
                <div className="space-y-3 relative z-10 text-center md:text-left">
                    <p className="text-[10px] font-bold text-muted-custom uppercase tracking-[0.2em]">Current Balance</p>
                    <div className="flex items-baseline justify-center md:justify-start gap-2">
                        <span className="text-xl font-bold text-white/40">KES</span>
                        <h2 className="text-5xl font-bold text-white tracking-tighter tabular-nums">
                            {(data?.payouts || 0).toLocaleString()}
                        </h2>
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-2 pt-2">
                        <Badge gold>Verified Payouts</Badge>
                        <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                            <TrendingUp size={10} /> +12.4% vs last mo
                        </span>
                    </div>
                </div>
                <div className="flex flex-col gap-3 w-full md:w-auto relative z-10">
                    <button className="h-11 px-8 rounded bg-primary-gold text-black text-[11px] font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-primary-gold/10 flex items-center justify-center gap-2 active:scale-95">
                        Withdraw Funds <ArrowUpRight size={16} strokeWidth={3} />
                    </button>
                    <button className="h-11 px-8 rounded bg-white/5 border border-white/10 text-[11px] font-bold text-white uppercase tracking-widest hover:bg-white/10 transition-all">
                        Account Settings
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Secondary Stats */}
                <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                    <RevenueStat label="Life-time Earnings" value={`KES ${(data?.estimatedEarnings || 0).toLocaleString()}`} icon={<BarChart2 size={16} />} />
                    <RevenueStat label="Pending Payouts" value={`KES ${(data?.pendingPayout || 0).toLocaleString()}`} icon={<Clock size={16} />} color="text-amber-400" />
                </div>

                {/* Verification Card */}
                <div className="card-surface rounded-lg p-5 flex items-center gap-4">
                    <div className="size-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 shadow-inner">
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-white uppercase tracking-widest">Identity Verified</p>
                        <p className="text-[9px] font-bold text-muted-custom uppercase mt-1">Tier 1 Partner Authorization</p>
                    </div>
                </div>
            </div>

            {/* ─── Payout History ─── */}
            <div className="space-y-4">
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-muted-custom px-1">Payout History</h2>
                <div className="card-surface rounded-lg overflow-hidden">
                    <div className="overflow-x-auto no-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/[0.02] text-[9px] font-bold uppercase tracking-widest text-muted-custom border-b border-white/5">
                                    <th className="px-6 py-4">Reference</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4 text-right">Amount</th>
                                    <th className="px-6 py-4 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {[...Array(3)].map((_, i) => (
                                    <tr key={i} className="hover:bg-white/[0.01] transition-colors group cursor-pointer">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded bg-white/5 flex items-center justify-center text-muted-custom group-hover:text-primary-gold transition-colors">
                                                    <Zap size={14} />
                                                </div>
                                                <span className="text-[11px] font-bold text-white uppercase tracking-tight">KHB-PAY-{1024 + i}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-[10px] font-bold text-muted-custom uppercase">{new Date().toLocaleDateString()}</span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <span className="text-xs font-bold text-white tabular-nums">KES 0.00</span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold text-emerald-400 uppercase tracking-widest">
                                                <CheckCircle2 size={10} /> Paid
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Empty State if no payouts */}
                    <div className="p-10 text-center bg-white/[0.01]">
                        <p className="text-[10px] font-bold text-muted-custom/40 uppercase tracking-widest">End of History</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function RevenueStat({ label, value, icon, color = "text-primary-gold" }: any) {
    return (
        <div className="card-surface rounded-lg p-5 space-y-3">
            <div className={`size-8 rounded bg-white/5 flex items-center justify-center ${color} border border-white/5 shadow-inner`}>
                {icon}
            </div>
            <div className="space-y-1">
                <p className="text-[9px] font-bold text-muted-custom uppercase tracking-widest">{label}</p>
                <p className="text-base font-bold text-white tabular-nums">{value}</p>
            </div>
        </div>
    );
}
