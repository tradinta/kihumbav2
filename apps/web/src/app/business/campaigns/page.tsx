"use client";

import { motion } from "framer-motion";
import { 
  Building2, 
  Search, 
  Star,
  Plus,
  ArrowRight
} from "lucide-react";
import { businessData } from "@/data/businessData";

export default function InfluencerCampaignManager() {
  const { influencerCampaigns, directory } = businessData;

  const StatusBadge = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
      Drafting: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      "Awaiting Acceptance": "bg-blue-500/10 text-blue-500 border-blue-500/20",
      "Review Required": "bg-purple-500/10 text-purple-500 border-purple-500/20",
      Published: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    };
    return (
      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border ${styles[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Active Campaigns Tracking */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-main">Active Briefs</h1>
            <p className="text-[11px] font-bold text-muted-custom uppercase tracking-widest mt-1">
              Track your deployed influencer campaigns
            </p>
          </div>
          
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:brightness-110 transition-colors flex items-center gap-2">
            <Plus size={14} /> Send New Brief
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {influencerCampaigns.map((camp, i) => (
            <motion.div 
              key={camp.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card-surface p-5 rounded-2xl border border-custom group hover:border-blue-500/30 transition-all flex flex-col gap-4"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                   <img src={camp.creator.avatar} alt={camp.creator.handle} className="size-10 rounded-full object-cover border border-custom" />
                   <div>
                     <h3 className="text-[12px] font-bold">{camp.creator.name}</h3>
                     <p className="text-[10px] font-bold text-muted-custom">@{camp.creator.handle}</p>
                   </div>
                </div>
                <StatusBadge status={camp.status} />
              </div>
              
              <div className="bg-[var(--pill-bg)] rounded-xl p-3 border border-custom">
                <p className="text-[11px] font-bold mb-1">{camp.task}</p>
                <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-muted-custom">
                   <span>{camp.platform}</span>
                   <span className="text-blue-500">Due {camp.dueDate}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-2">
                 <span className="text-[13px] font-black">KES {camp.budget.toLocaleString()}</span>
                 <button className="text-[9px] uppercase font-bold text-main hover:text-blue-500 transition-colors flex items-center gap-1 group/btn">
                   Manage <ArrowRight size={10} className="group-hover/btn:translate-x-1 transition-transform" />
                 </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Creator Directory */}
      <div className="pt-8 border-t border-custom">
        <div className="flex flex-col mb-6">
           <h2 className="text-xl font-black tracking-tight text-main mb-1">Creator Directory</h2>
           <p className="text-[11px] font-bold text-muted-custom uppercase tracking-widest">
             Browse and hire top-rated Kihumba certified creators
           </p>
        </div>

        <div className="relative mb-6">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-custom" />
          <input 
            type="text" 
            placeholder="Search by niche, name, or handle..."
            className="w-full pl-9 pr-4 py-3 bg-[var(--pill-bg)] border border-custom rounded-xl text-[12px] font-bold focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
           {directory.map((creator, i) => (
             <motion.div 
               key={creator.id}
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: i * 0.05 }}
               className="card-surface p-5 rounded-2xl border border-custom flex flex-col items-center text-center group hover:border-custom-hover transition-colors"
             >
                <img src={creator.avatar} alt={creator.name} className="size-16 rounded-full object-cover mb-3 shadow-lg" />
                <h3 className="text-[13px] font-bold">{creator.name}</h3>
                <p className="text-[10px] text-muted-custom font-bold mb-2">@{creator.handle} · {creator.niche}</p>
                
                <div className="flex gap-4 mb-4">
                   <div className="text-center">
                     <span className="block text-[11px] font-black text-main">{(creator.followers / 1000).toFixed(0)}k</span>
                     <span className="block text-[8px] uppercase font-bold text-muted-custom tracking-widest">Followers</span>
                   </div>
                   <div className="text-center">
                     <span className="flex items-center justify-center gap-1 text-[11px] font-black text-amber-500">
                        {creator.trustScore} <Star size={10} className="fill-current" />
                     </span>
                     <span className="block text-[8px] uppercase font-bold text-muted-custom tracking-widest">Trust Score</span>
                   </div>
                </div>

                <button className="w-full py-2 bg-[var(--pill-bg)] border border-custom rounded-lg text-[10px] font-bold uppercase tracking-widest text-blue-500 hover:bg-blue-500/10 hover:border-blue-500/30 transition-all">
                  From KES {(creator.minimumRate / 1000).toFixed(0)}k
                </button>
             </motion.div>
           ))}
        </div>
      </div>

    </div>
  );
}
