"use client";

import { useState } from "react";
import { Home, MapPin, Bed, Briefcase, Target, TrendingUp, ShieldCheck, Map } from "lucide-react";

const PROPERTY_TYPES = ["Apartments", "Houses", "Land", "Commercial", "Bedsitters"];
const BEDROOM_COUNTS = ["Studio", "1 BR", "2 BR", "3 BR", "4+ BR"];
const FURNISHING = ["All", "Furnished", "Unfurnished"];
const BUDGET_RANGES = ["Under 25k", "25k - 50k", "50k - 100k", "100k - 200k", "200k+"];

export default function KaoTargetingStage() {
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["Apartments"]);
  const [selectedBeds, setSelectedBeds] = useState<string[]>(["2 BR", "3 BR"]);
  const [selectedFurnishing, setSelectedFurnishing] = useState("All");

  const toggleType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleBed = (bed: string) => {
    setSelectedBeds(prev => 
      prev.includes(bed) ? prev.filter(b => b !== bed) : [...prev, bed]
    );
  };

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Core Property Demographics */}
        <div className="lg:col-span-7 space-y-10">
           <section className="space-y-4">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-custom flex items-center gap-2">
                 <Home size={12} /> Property Categories
              </label>
              <div className="flex flex-wrap gap-2">
                 {PROPERTY_TYPES.map(type => (
                    <button 
                      key={type}
                      onClick={() => toggleType(type)}
                      className={`px-4 py-2 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all ${
                         selectedTypes.includes(type) 
                           ? "bg-primary-gold text-black border-primary-gold" 
                           : "bg-white/5 border-white/10 text-muted-custom hover:border-white/20"
                      }`}
                    >
                       {type}
                    </button>
                 ))}
              </div>
           </section>

           <section className="space-y-4">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-custom flex items-center gap-2">
                 <Bed size={12} /> Bedroom Configuration
              </label>
              <div className="flex flex-wrap gap-2">
                 {BEDROOM_COUNTS.map(count => (
                    <button 
                      key={count}
                      onClick={() => toggleBed(count)}
                      className={`px-4 py-2 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all ${
                         selectedBeds.includes(count) 
                           ? "bg-primary-gold text-black border-primary-gold" 
                           : "bg-white/5 border-white/10 text-muted-custom hover:border-white/20"
                      }`}
                    >
                       {count}
                    </button>
                 ))}
              </div>
           </section>

           <section className="space-y-4">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-custom flex items-center gap-2">
                 <Briefcase size={12} /> Furnishing Status
              </label>
              <div className="flex gap-2">
                 {FURNISHING.map(f => (
                    <button 
                      key={f}
                      onClick={() => setSelectedFurnishing(f)}
                      className={`flex-1 px-4 py-2 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all ${
                         selectedFurnishing === f 
                           ? "bg-primary-gold text-black border-primary-gold" 
                           : "bg-white/5 border-white/10 text-muted-custom hover:border-white/20"
                      }`}
                    >
                       {f}
                    </button>
                 ))}
              </div>
           </section>

           <section className="space-y-4">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-custom flex items-center gap-2">
                 <Target size={12} /> Search Budget Range (Target Audience)
              </label>
              <div className="grid grid-cols-2 gap-3">
                 {BUDGET_RANGES.map(range => (
                    <button key={range} className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-muted-custom hover:border-primary-gold/30 transition-all text-left">
                       {range}
                    </button>
                 ))}
              </div>
           </section>
        </div>

        {/* Reach Prediction Panel */}
        <div className="lg:col-span-5">
           <div className="card-surface rounded-2xl border-custom p-6 sticky top-24 space-y-8 overflow-hidden relative bg-[#0a100d]">
              <div className="absolute top-0 right-0 p-8 opacity-[0.05] pointer-events-none">
                 <Map size={150} className="text-primary-gold" />
              </div>
              
              <div>
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-primary-gold flex items-center gap-2 mb-6">
                    <TrendingUp size={14} /> Kao Market Coverage
                 </h4>
                 <div className="space-y-1">
                    <p className="text-4xl font-black tracking-tighter text-main">142,500</p>
                    <p className="text-[10px] font-bold text-muted-custom uppercase tracking-widest">Active Property Hunters (7d)</p>
                 </div>
              </div>

              <div className="space-y-4">
                 <PredictionItem label="Listing Competition" value="Moderate" color="text-amber-500" />
                 <PredictionItem label="Targeting Precision" value="92%" color="text-emerald-500" />
                 <PredictionItem label="Market Liquidity" value="High" color="text-main" />
              </div>

              <div className="p-4 rounded-xl bg-primary-gold/5 border border-primary-gold/20 flex items-start gap-3">
                 <ShieldCheck size={16} className="text-primary-gold shrink-0" />
                 <p className="text-[10px] font-bold text-primary-gold/80 leading-relaxed font-inter">
                    Your targeting is synchronized with the **Kilimani Residential Corridor**. This neighborhood currently has the highest search volume for **3BR Furnished** units.
                 </p>
              </div>

              <div className="pt-6 border-t border-white/10">
                 <p className="text-[9px] font-black uppercase tracking-widest text-muted-custom mb-3">Map Isolation</p>
                 <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                    <MapPin size={16} className="text-primary-gold" />
                    <div>
                       <p className="text-[10px] font-black text-main">Nairobi: Kilimani / Kileleshwa</p>
                       <p className="text-[8px] font-bold text-muted-custom uppercase mt-0.5">Primary Search Radius Locked</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function PredictionItem({ label, value, color }: { label: string, value: string, color: string }) {
   return (
      <div className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
         <span className="text-[9px] font-black text-muted-custom uppercase tracking-widest">{label}</span>
         <span className={`text-xs font-black ${color} uppercase`}>{value}</span>
      </div>
   );
}
