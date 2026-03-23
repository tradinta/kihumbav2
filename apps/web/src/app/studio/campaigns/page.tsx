"use client";

import { motion } from "framer-motion";
import { 
  Building2, 
  ArrowUpRight,
  Filter,
  Search,
  MessageSquare,
  Clock
} from "lucide-react";
import { studioData } from "@/data/studioData";

export default function CampaignsManager() {
  const { campaigns } = studioData;

  const StatusBadge = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
      Drafting: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      Approved: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      Submitted: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      "Changes Requested": "bg-red-500/10 text-red-500 border-red-500/20",
    };
    return (
      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border ${styles[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-main">Direct Campaigns</h1>
          <p className="text-[11px] font-bold text-muted-custom uppercase tracking-widest mt-1">
            Manage your active brand tasks and drafts
          </p>
        </div>
        
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-primary-gold text-black rounded-lg text-[10px] font-bold uppercase tracking-widest hover:brightness-110 transition-colors flex items-center gap-2">
            <Building2 size={14} /> Browse Brands
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Campaign Stats */}
        <div className="card-surface p-5 rounded-2xl border border-custom flex flex-col justify-center">
           <h3 className="text-[10px] uppercase font-bold text-muted-custom tracking-widest mb-1">Active Tasks</h3>
           <div className="flex items-baseline gap-2">
             <span className="text-3xl font-black">2</span>
             <span className="text-[10px] font-bold text-emerald-400">Needing Action</span>
           </div>
        </div>
        <div className="card-surface p-5 rounded-2xl border border-custom flex flex-col justify-center">
           <h3 className="text-[10px] uppercase font-bold text-muted-custom tracking-widest mb-1">Awaiting Approval</h3>
           <div className="flex items-baseline gap-2">
             <span className="text-3xl font-black">1</span>
             <span className="text-[10px] font-bold text-blue-400">Under Review</span>
           </div>
        </div>
        <div className="card-surface p-5 rounded-2xl border border-custom flex flex-col justify-center">
           <h3 className="text-[10px] uppercase font-bold text-muted-custom tracking-widest mb-1">Total Earned (YTD)</h3>
           <div className="flex items-baseline gap-2">
             <span className="text-3xl font-black text-primary-gold">120k</span>
             <span className="text-[10px] font-bold text-emerald-400">KES</span>
           </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        <h2 className="text-[12px] font-bold uppercase tracking-widest text-primary-gold mt-4">Active & Pending</h2>
        
        {campaigns.map((task, i) => (
          <motion.div 
            key={task.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card-surface p-5 rounded-2xl border border-custom group hover:border-primary-gold/30 transition-all flex flex-col md:flex-row gap-6 md:items-center"
          >
            <div className="flex items-start gap-4 flex-1">
              <div className="size-12 rounded-lg border border-custom overflow-hidden shrink-0 bg-[var(--pill-bg)]">
                <img src={task.brandAvatar} alt={task.brand} className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-[13px] font-bold text-main">{task.task}</h3>
                  <span className="px-1.5 py-0.5 rounded bg-[var(--pill-bg)] border border-custom text-[8px] font-bold text-muted-custom tracking-widest uppercase">
                    {task.platform}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-bold text-muted-custom tracking-widest uppercase">
                  <span className="text-primary-gold">{task.brand}</span>
                  <span className="flex items-center gap-1"><Clock size={10} /> {task.dueDate}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-6 md:min-w-[300px] pt-4 md:pt-0 border-t border-custom md:border-none">
              <div className="text-left md:text-right flex-1">
                <span className="block text-[10px] uppercase font-bold text-muted-custom tracking-widest mb-0.5">Payout</span>
                <span className="block text-[13px] font-black text-emerald-400">KES {task.payout.toLocaleString()}</span>
              </div>
              <div className="flex flex-col items-end gap-3 shrink-0">
                <StatusBadge status={task.status} />
                <button className="text-[9px] uppercase font-bold tracking-widest text-primary-gold hover:text-white transition-colors flex items-center gap-1">
                  View Brief <ArrowUpRight size={10} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
}
