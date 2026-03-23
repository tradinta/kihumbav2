"use client";

import { motion } from "framer-motion";
import { 
  ArrowUpRight, 
  Wallet, 
  TrendingUp, 
  Star, 
  CheckCircle2, 
  Clock, 
  Award,
  ChevronRight
} from "lucide-react";

interface DashboardProps {
  analytics: {
    totalEarnings: number;
    avgEngagement: number;
    engagementTrend: number;
    campaignsWon: number;
    successScore: number;
  };
  activeTasks: Array<{
    id: string;
    campaign: string;
    task: string;
    status: string;
    dueDate: string;
    platform: string;
    reward: number;
  }>;
  recentEarnings: Array<{
    id: string;
    campaign: string;
    amount: number;
    date: string;
  }>;
}

export default function CreatorDashboard({ analytics, activeTasks, recentEarnings }: DashboardProps) {
  
  const StatusBadge = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
      Pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      Approved: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      Submitted: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      "Changes Requested": "bg-red-500/10 text-red-500 border-red-500/20",
    };
    return (
      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border ${styles[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="px-4">
        <h2 className="text-lg font-bold">Creator Hub</h2>
        <p className="text-[10px] uppercase font-bold tracking-widest text-muted-custom">Manage your influencer tasks</p>
      </div>

      {/* Metrics Grid */}
      <div className="px-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Earnings", value: `KES ${analytics.totalEarnings.toLocaleString()}`, icon: Wallet },
          { label: "Avg Engagement", value: `${analytics.avgEngagement}%`, icon: TrendingUp, trend: `+${analytics.engagementTrend}%` },
          { label: "Campaigns Won", value: analytics.campaignsWon, icon: Award },
          { label: "Success Score", value: `${analytics.successScore}%`, icon: Star },
        ].map((stat, i) => (
          <div key={i} className="card-surface p-4 rounded-xl relative overflow-hidden group hover:border-primary-gold/30 transition-colors">
            <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
              <stat.icon size={24} className="text-primary-gold" />
            </div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-muted-custom mb-1">{stat.label}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-xl font-bold">{stat.value}</h3>
              {stat.trend && (
                <span className="text-[9px] font-bold text-emerald-400 flex items-center">
                  <ArrowUpRight size={10} /> {stat.trend}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Tasks taking 2 columns */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-primary-gold">Active Tasks</h3>
            <button className="text-[9px] font-bold text-muted-custom hover:text-primary-gold flex items-center gap-1">
              View All <ChevronRight size={12} />
            </button>
          </div>
          
          <div className="space-y-3">
            {activeTasks.map((task) => (
              <div key={task.id} className="card-surface p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-primary-gold/30 transition-colors">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-[12px] font-bold">{task.task}</h4>
                    <span className="bg-[var(--pill-bg)] px-1.5 py-0.5 rounded text-[8px] font-bold text-muted-custom border border-custom">{task.platform}</span>
                  </div>
                  <p className="text-[10px] font-bold text-muted-custom">
                    {task.campaign} <span className="mx-1.5">·</span> Due {task.dueDate}
                  </p>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                  <div className="text-left sm:text-right">
                    <span className="block text-[11px] font-bold text-primary-gold">KES {task.reward.toLocaleString()}</span>
                  </div>
                  <StatusBadge status={task.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Earnings taking 1 column */}
        <div className="space-y-3">
           <div className="flex items-center justify-between mb-4">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-primary-gold">Recent Earnings</h3>
          </div>
          
          <div className="card-surface p-4 rounded-xl">
            <div className="space-y-4">
              {recentEarnings.map((earning, i) => (
                <div key={earning.id} className="flex items-center justify-between pb-4 border-b border-custom last:border-0 last:pb-0">
                  <div>
                    <h4 className="text-[11px] font-bold truncate max-w-[140px]">{earning.campaign}</h4>
                    <p className="text-[9px] font-bold text-muted-custom mt-0.5">{earning.date}</p>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-400">
                    +KES {earning.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-4 py-2 rounded text-[9px] font-bold uppercase tracking-widest text-primary-gold bg-primary-gold/10 hover:bg-primary-gold/20 transition-colors border border-primary-gold/20">
              Withdraw Funds
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
