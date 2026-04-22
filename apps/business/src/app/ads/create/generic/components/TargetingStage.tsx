"use client";

import { useState } from "react";
import { Users, MapPin, Smartphone, Clock, Target, ArrowUpRight, ShieldCheck, TrendingUp } from "lucide-react";

const AGE_RANGES = ["13-17", "18-24", "25-34", "35-44", "45-54", "55-64", "65+"];
const GENDERS = ["All", "Men", "Women"];
const DEVICES = ["All", "iOS", "Android", "Web Desktop"];
const NETWORK = ["Any", "WiFi Only", "Cellular Only"];

export default function TargetingStage() {
  const [selectedAges, setSelectedAges] = useState<string[]>(["18-24", "25-34"]);
  const [selectedGender, setSelectedGender] = useState("All");
  const [selectedDevices, setSelectedDevices] = useState(["All"]);

  const toggleAge = (age: string) => {
    setSelectedAges(prev => 
      prev.includes(age) ? prev.filter(a => a !== age) : [...prev, age]
    );
  };

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Core Demographics */}
        <div className="lg:col-span-7 space-y-10">
           <section className="space-y-4">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-custom flex items-center gap-2">
                 <Users size={12} /> Age Demographic
              </label>
              <div className="flex flex-wrap gap-2">
                 {AGE_RANGES.map(age => (
                    <button 
                      key={age}
                      onClick={() => toggleAge(age)}
                      className={`px-4 py-2 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all ${
                         selectedAges.includes(age) 
                           ? "bg-primary-gold text-black border-primary-gold" 
                           : "bg-white/5 border-white/10 text-muted-custom hover:border-white/20"
                      }`}
                    >
                       {age}
                    </button>
                 ))}
              </div>
           </section>

           <section className="space-y-4">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-custom flex items-center gap-2">
                 <Users size={12} /> Gender
              </label>
              <div className="flex gap-2">
                 {GENDERS.map(gender => (
                    <button 
                      key={gender}
                      onClick={() => setSelectedGender(gender)}
                      className={`flex-1 px-4 py-2 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all ${
                         selectedGender === gender 
                           ? "bg-primary-gold text-black border-primary-gold" 
                           : "bg-white/5 border-white/10 text-muted-custom hover:border-white/20"
                      }`}
                    >
                       {gender}
                    </button>
                 ))}
              </div>
           </section>

           <section className="space-y-4">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-custom flex items-center gap-2">
                 <Smartphone size={12} /> Technical Targeting
              </label>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <p className="text-[8px] font-black uppercase tracking-widest text-muted-custom/60">Device OS</p>
                    <div className="flex gap-2">
                       {DEVICES.slice(0,3).map(dev => (
                          <button key={dev} className="flex-1 px-2 py-1.5 rounded bg-white/5 border border-white/10 text-[8px] font-black uppercase text-muted-custom">
                             {dev}
                          </button>
                       ))}
                    </div>
                 </div>
                 <div className="space-y-2">
                    <p className="text-[8px] font-black uppercase tracking-widest text-muted-custom/60">Network Type</p>
                    <div className="flex gap-2">
                       {NETWORK.slice(0,2).map(net => (
                          <button key={net} className="flex-1 px-2 py-1.5 rounded bg-white/5 border border-white/10 text-[8px] font-black uppercase text-muted-custom">
                             {net}
                          </button>
                       ))}
                    </div>
                 </div>
              </div>
           </section>

           <section className="space-y-4">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-custom flex items-center gap-2">
                 <Clock size={12} /> Dayparting (Schedule)
              </label>
              <div className="p-4 rounded-xl border border-custom bg-white/[0.02]">
                 <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-main">Standard 24/7 Delivery</span>
                    <button className="text-[10px] font-black text-primary-gold uppercase tracking-widest underline underline-offset-4">Customize Hours</button>
                 </div>
                 <div className="flex gap-1 h-8 items-end">
                    {Array.from({length: 24}).map((_, i) => (
                       <div key={i} className="flex-1 bg-primary-gold/40 rounded-t sm" style={{ height: `${20 + Math.random() * 80}%` }} />
                    ))}
                 </div>
              </div>
           </section>
        </div>

        {/* Reach Prediction Panel */}
        <div className="lg:col-span-5">
           <div className="card-surface rounded-2xl border-custom p-6 sticky top-24 space-y-8 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                 <Target size={120} />
              </div>
              
              <div>
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-primary-gold flex items-center gap-2 mb-6">
                    <TrendingUp size={14} /> Audience Intelligence
                 </h4>
                 <div className="space-y-1">
                    <p className="text-4xl font-black tracking-tighter text-main">842,000</p>
                    <p className="text-[10px] font-bold text-muted-custom uppercase tracking-widest">Est. Weekly Impressions</p>
                 </div>
              </div>

              <div className="space-y-4">
                 <PredictionItem label="Reach Quality" value="High" color="text-emerald-500" />
                 <PredictionItem label="Competitive Bid" value="KES 12.4" color="text-main" />
                 <PredictionItem label="Liquidity" value="Ample" color="text-main" />
              </div>

              <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 flex items-start gap-3">
                 <ShieldCheck size={16} className="text-blue-500 shrink-0" />
                 <p className="text-[10px] font-bold text-blue-500/80 leading-relaxed">
                    Kihumba AI confirms your targeting is consistent with current platform usage trends for the **Gen-Z / Millennial** demographic.
                 </p>
              </div>

              <div className="pt-6 border-t border-custom">
                 <p className="text-[9px] font-black uppercase tracking-widest text-muted-custom mb-3">Geographic Precision</p>
                 <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                    <MapPin size={16} className="text-primary-gold" />
                    <div>
                       <p className="text-[10px] font-black text-main">Selected: Nairobi (Kilimani, Westlands)</p>
                       <p className="text-[8px] font-bold text-muted-custom uppercase mt-0.5">5km Radius from Business Hub</p>
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
      <div className="flex justify-between items-center py-2 border-b border-white/5">
         <span className="text-[9px] font-black text-muted-custom uppercase tracking-widest">{label}</span>
         <span className={`text-xs font-black ${color} uppercase`}>{value}</span>
      </div>
   );
}
