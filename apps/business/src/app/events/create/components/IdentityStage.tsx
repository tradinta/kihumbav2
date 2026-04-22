"use client";

import { Calendar, Tag, Sparkles, Zap } from "lucide-react";

export default function EventIdentityStage({ data, updateData }: any) {
  const CATEGORIES = ["Concert", "Nightlife", "Workshop", "Tech & Startup", "Cultural", "Dining"];

  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase tracking-widest text-muted-custom">Event Experience Name</label>
        <div className="relative">
          <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-custom" />
          <input 
            type="text" 
            placeholder="e.g. Nairobi Jazz Festival" 
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm font-black text-main focus:outline-none focus:border-primary-gold/50 transition-all"
            value={data.name}
            onChange={(e) => updateData({ name: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-custom">Experience Genre</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button 
                key={cat}
                onClick={() => updateData({ category: cat })}
                className={`px-4 py-2 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all ${
                  data.category === cat 
                    ? "bg-primary-gold text-black border-primary-gold" 
                    : "bg-white/5 border-white/10 text-muted-custom hover:border-white/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-custom">Experience Vibe</label>
          <div className="relative">
            <Sparkles size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-custom" />
            <input 
              type="text" 
              placeholder="e.g. chill, high-energy, boutique" 
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-[11px] font-black text-main focus:outline-none focus:border-primary-gold/50 transition-all uppercase tracking-widest"
              value={data.vibeTags}
              onChange={(e) => updateData({ vibeTags: e.target.value })}
            />
          </div>
          <p className="text-[9px] font-bold text-muted-custom uppercase tracking-widest">Comma separated vibe tags for discovery.</p>
        </div>
      </div>

      <div className="pt-8 border-t border-white/5 space-y-6">
        <div className="flex items-center justify-between">
           <h3 className="text-[10px] font-black uppercase tracking-widest text-primary-gold flex items-center gap-2">
              <Zap size={14} /> Flash Deal Integration (Optional)
           </h3>
           <span className="text-[9px] font-black text-muted-custom uppercase px-2 py-1 bg-white/5 rounded border border-white/10">Gamified Reward</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-custom">Deal Code</label>
              <input 
                type="text" 
                placeholder="e.g. JAZZ20" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-black text-main focus:outline-none font-mono"
                value={data.dealCode}
                onChange={(e) => updateData({ dealCode: e.target.value })}
              />
           </div>
           <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-custom">Deal Hook</label>
              <input 
                type="text" 
                placeholder="e.g. 20% off for the first 50 bookings!" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-black text-main focus:outline-none"
                value={data.dealDescription}
                onChange={(e) => updateData({ dealDescription: e.target.value })}
              />
           </div>
        </div>
      </div>
    </div>
  );
}
