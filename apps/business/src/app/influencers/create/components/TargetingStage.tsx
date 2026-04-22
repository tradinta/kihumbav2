"use client";

import { Users, Filter, Star } from "lucide-react";

export default function TargetingStage({ data, updateData }: any) {
  const TIERS = ["Nano (<10k)", "Micro (10k-100k)", "Macro (100k-1M)", "Mega (1M+)"];
  const GENRES = ["Lifestyle", "Tech", "Fashion", "Comedy", "Music", "Business", "Sports"];

  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase tracking-widest text-muted-custom">Creator Archetype (Genres)</label>
        <div className="flex flex-wrap gap-2">
          {GENRES.map(genre => (
            <button 
              key={genre}
              onClick={() => {
                const genres = data.targetGenres.includes(genre)
                  ? data.targetGenres.filter((g: string) => g !== genre)
                  : [...data.targetGenres, genre];
                updateData({ targetGenres: genres });
              }}
              className={`px-4 py-2 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all ${
                data.targetGenres.includes(genre) 
                  ? "bg-purple-500 text-white border-purple-500" 
                  : "bg-white/5 border-white/10 text-muted-custom hover:border-white/20"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-custom">Influence Tier</label>
          <div className="space-y-2">
            {TIERS.map(tier => (
              <button 
                key={tier}
                onClick={() => updateData({ targetTier: tier })}
                className={`w-full px-6 py-4 rounded-xl border text-left text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-between ${
                  data.targetTier === tier 
                    ? "bg-white/5 border-purple-500/50 text-white" 
                    : "bg-white/5 border-white/10 text-muted-custom hover:border-white/20"
                }`}
              >
                {tier}
                {data.targetTier === tier && <Star size={14} className="text-purple-500 fill-current" />}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
           <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-custom">Minimum Follower Count</label>
              <div className="relative">
                <Users size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-custom" />
                <input 
                  type="number" 
                  placeholder="e.g. 50000" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm font-black text-main focus:outline-none focus:border-purple-500/50 transition-all"
                  value={data.minFollowers}
                  onChange={(e) => updateData({ minFollowers: Number(e.target.value) })}
                />
              </div>
           </div>

           <div className="p-6 rounded-2xl border border-blue-500/20 bg-blue-500/5">
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-2 flex items-center gap-2">
                 <Filter size={14} /> Estimated Creator Pool
              </p>
              <p className="text-[11px] font-medium text-main/80 leading-relaxed uppercase">
                 Based on your targeting, there are **420 Creators** in the Kihumba Partner Program that match this archetype.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
