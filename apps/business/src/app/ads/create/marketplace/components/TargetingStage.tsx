"use client";

import { useState } from "react";
import { Package, Tag, Star, DollarSign, Target, TrendingUp, ShieldCheck, Map } from "lucide-react";

const CATEGORIES = ["Electronics", "Fashion", "Home & Living", "Health & Beauty", "Automotive", "Collectibles"];
const CONDITIONS = ["Any", "Brand New", "Refurbished", "Used"];
const SELLER_RATINGS = ["All Sellers", "4.0+ Stars", "Top-Rated Plus"];
const PRICE_SEGMENTS = ["Under 5k", "5k - 15k", "15k - 50k", "50k - 150k", "150k+"];

export default function MarketplaceTargetingStage() {
  const [selectedCats, setSelectedCats] = useState<string[]>(["Electronics"]);
  const [selectedCondition, setSelectedCondition] = useState("Brand New");
  const [selectedRating, setSelectedRating] = useState("All Sellers");

  const toggleCat = (cat: string) => {
    setSelectedCats(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Core Commerce Demographics */}
        <div className="lg:col-span-7 space-y-10">
           <section className="space-y-4">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-custom flex items-center gap-2">
                 <Package size={12} /> Product Categories
              </label>
              <div className="flex flex-wrap gap-2">
                 {CATEGORIES.map(cat => (
                    <button 
                      key={cat}
                      onClick={() => toggleCat(cat)}
                      className={`px-4 py-2 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all ${
                         selectedCats.includes(cat) 
                           ? "bg-primary-gold text-black border-primary-gold" 
                           : "bg-white/5 border-white/10 text-muted-custom hover:border-white/20"
                      }`}
                    >
                       {cat}
                    </button>
                 ))}
              </div>
           </section>

           <section className="space-y-4">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-custom flex items-center gap-2">
                 <Tag size={12} /> Item Condition
              </label>
              <div className="flex gap-2">
                 {CONDITIONS.map(cond => (
                    <button 
                      key={cond}
                      onClick={() => setSelectedCondition(cond)}
                      className={`flex-1 px-4 py-2 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all ${
                         selectedCondition === cond 
                           ? "bg-primary-gold text-black border-primary-gold" 
                           : "bg-white/5 border-white/10 text-muted-custom hover:border-white/20"
                      }`}
                    >
                       {cond}
                    </button>
                 ))}
              </div>
           </section>

           <section className="space-y-4">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-custom flex items-center gap-2">
                 <Star size={12} /> Target Seller Reputation
              </label>
              <div className="flex gap-2">
                 {SELLER_RATINGS.map(rate => (
                    <button 
                      key={rate}
                      onClick={() => setSelectedRating(rate)}
                      className={`flex-1 px-4 py-2 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all ${
                         selectedRating === rate 
                           ? "bg-primary-gold text-black border-primary-gold" 
                           : "bg-white/5 border-white/10 text-muted-custom hover:border-white/20"
                      }`}
                    >
                       {rate}
                    </button>
                 ))}
              </div>
           </section>

           <section className="space-y-4">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-custom flex items-center gap-2">
                 <DollarSign size={12} /> Consumer Spending Bracket
              </label>
              <div className="grid grid-cols-2 gap-3">
                 {PRICE_SEGMENTS.map(range => (
                    <button key={range} className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-muted-custom hover:border-primary-gold/30 transition-all text-left">
                       {range}
                    </button>
                 ))}
              </div>
           </section>
        </div>

        {/* Reach Prediction Panel */}
        <div className="lg:col-span-5">
           <div className="card-surface rounded-2xl border-custom p-6 sticky top-24 space-y-8 overflow-hidden relative bg-[#0d0d0d]">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none text-emerald-500">
                 <Package size={150} />
              </div>
              
              <div>
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-primary-gold flex items-center gap-2 mb-6">
                    <TrendingUp size={14} /> Market Intensity
                 </h4>
                 <div className="space-y-1">
                    <p className="text-4xl font-black tracking-tighter text-main">312,400</p>
                    <p className="text-[10px] font-bold text-muted-custom uppercase tracking-widest">Active High-Intent Shoppers (7d)</p>
                 </div>
              </div>

              <div className="space-y-4">
                 <PredictionItem label="Bid Competitiveness" value="High" color="text-amber-500" />
                 <PredictionItem label="Targeting Match" value="98%" color="text-emerald-500" />
                 <PredictionItem label="Inventory Velocity" value="Fast" color="text-main" />
              </div>

              <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-start gap-3">
                 <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
                 <p className="text-[10px] font-bold text-emerald-500/80 leading-relaxed font-inter">
                    Your targeting overlaps with the **Electronics pay-day spike**. Consumers in your selected bracket are 40% more likely to convert today.
                 </p>
              </div>

              <div className="pt-6 border-t border-white/10">
                 <p className="text-[9px] font-black uppercase tracking-widest text-muted-custom mb-3">Audience Location</p>
                 <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                    <Map size={16} className="text-primary-gold" />
                    <div>
                       <p className="text-[10px] font-black text-main">Nationwide (Nairobi Focus)</p>
                       <p className="text-[8px] font-bold text-muted-custom uppercase mt-0.5">Delivery Corridor Optimized</p>
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
