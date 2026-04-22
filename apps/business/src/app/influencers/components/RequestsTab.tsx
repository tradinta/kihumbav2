"use client";

import { useState } from "react";
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Sparkles,
  ChevronRight,
  TrendingUp,
  Star
} from "lucide-react";

const MOCK_REQUESTS = [
  { id: "REQ-001", name: "Elsa Majimbo", followers: "2.4M", niche: "Comedy", rating: "4.9", campaign: "Summer Sneaker Drop" },
  { id: "REQ-002", name: "Azziad Nasenya", followers: "4.1M", niche: "Lifestyle", rating: "4.8", campaign: "Summer Sneaker Drop" },
  { id: "REQ-003", name: "Nviiri the Storyteller", followers: "850k", niche: "Music", rating: "5.0", campaign: "Weekend Flash Sale" },
];

export default function RequestsTab() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black tracking-tighter text-white">Creator Inbound</h2>
          <p className="text-xs font-bold text-muted-custom uppercase tracking-widest mt-1">Review and authorize influencer applications for your active briefs.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 focus-within:border-primary-gold/30 transition-all">
            <Search size={16} className="text-muted-custom" />
            <input 
              type="text" 
              placeholder="Search creators..." 
              className="bg-transparent border-none text-[11px] font-black focus:outline-none w-48 uppercase tracking-widest" 
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_REQUESTS.map((req) => (
          <div key={req.id} className="p-8 rounded-3xl border border-white/5 bg-white/[0.01] hover:border-purple-500/30 transition-all group relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-[0.03] grayscale group-hover:grayscale-0 transition-all group-hover:opacity-[0.1] pointer-events-none">
                <Sparkles size={100} className="text-purple-500" />
             </div>

             <div className="flex items-center gap-4 mb-8">
                <div className="size-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-xl font-black text-primary-gold">
                   {req.name[0]}
                </div>
                <div>
                   <h3 className="text-sm font-black text-white">{req.name}</h3>
                   <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold text-muted-custom uppercase tracking-widest">{req.niche}</span>
                      <span className="text-white/10">•</span>
                      <div className="flex items-center gap-1 text-primary-gold">
                         <Star size={10} fill="currentColor" />
                         <span className="text-[10px] font-black">{req.rating}</span>
                      </div>
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                   <p className="text-[9px] font-black text-muted-custom uppercase tracking-widest">Followers</p>
                   <p className="text-sm font-black text-white mt-1">{req.followers}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                   <p className="text-[9px] font-black text-muted-custom uppercase tracking-widest">Avg. ER</p>
                   <p className="text-sm font-black text-emerald-500 mt-1">4.2%</p>
                </div>
             </div>

             <div className="space-y-4">
                <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10">
                   <p className="text-[9px] font-black text-purple-400 uppercase tracking-widest mb-1">Applying for</p>
                   <p className="text-[11px] font-black text-white uppercase">{req.campaign}</p>
                </div>

                <div className="flex gap-2">
                   <button className="flex-1 py-3 rounded-xl bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all">
                      Authorize
                   </button>
                   <button className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-muted-custom text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                      Decline
                   </button>
                </div>
             </div>
          </div>
        ))}
      </div>

    </div>
  );
}
