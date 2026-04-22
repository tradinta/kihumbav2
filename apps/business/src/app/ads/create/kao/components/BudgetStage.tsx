"use client";

import { useState } from "react";
import { Wallet, DollarSign, Zap, RefreshCcw, Info, BarChart3, Clock, Lock } from "lucide-react";

export default function KaoBudgetStage() {
  const [budget, setBudget] = useState(15000);
  const [strategy, setStrategy] = useState("lowest-cost");
  const [pacing, setPacing] = useState("standard");
  const [frequency, setFrequency] = useState("2");

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Budget & Strategy Configuration */}
        <div className="lg:col-span-7 space-y-10">
           
           <section className="space-y-4">
              <div className="flex justify-between items-center">
                 <label className="text-[9px] font-black uppercase tracking-widest text-muted-custom flex items-center gap-2">
                    <DollarSign size={12} /> Daily Budget
                 </label>
                 <span className="text-sm font-black text-primary-gold font-inter">KES {budget.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min="2000" max="250000" step="1000" 
                value={budget} 
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full accent-primary-gold"
              />
              <div className="flex justify-between text-[8px] font-black text-muted-custom/60 uppercase tracking-widest">
                 <span>Kao Minimum: KES 2,000</span>
                 <span>Enterprise: KES 250k+</span>
              </div>
           </section>

           <section className="space-y-4">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-custom flex items-center gap-2">
                 <Zap size={12} /> Bidding Strategy
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                 <StrategyButton 
                   active={strategy === 'lowest-cost'} 
                   onClick={() => setStrategy('lowest-cost')}
                   label="Performance First" 
                   desc="Maximize high-intent property leads automatically." 
                   icon={<Zap size={16} />}
                 />
                 <StrategyButton 
                   active={strategy === 'bid-cap'} 
                   onClick={() => setStrategy('bid-cap')}
                   label="Target CPA" 
                   desc="Set a specific price goal for each property lead." 
                   icon={<Lock size={16} />}
                 />
              </div>
           </section>

           <section className="space-y-4">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-custom flex items-center gap-2">
                 <RefreshCcw size={12} /> Delivery Pacing
              </label>
              <div className="flex gap-2">
                 <button 
                   onClick={() => setPacing('standard')}
                   className={`flex-1 px-4 py-3 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all ${
                     pacing === 'standard' 
                       ? "bg-primary-gold text-black border-primary-gold" 
                       : "bg-white/5 border-white/10 text-muted-custom hover:border-white/20"
                   }`}
                 >
                    Standard
                 </button>
                 <button 
                   onClick={() => setPacing('accelerated')}
                   className={`flex-1 px-4 py-3 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all ${
                     pacing === 'accelerated' 
                       ? "bg-primary-gold text-black border-primary-gold" 
                       : "bg-white/5 border-white/10 text-muted-custom hover:border-white/20"
                   }`}
                 >
                    Accelerated
                 </button>
              </div>
              <p className="text-[9px] font-bold text-muted-custom leading-relaxed">
                 {pacing === 'standard' 
                   ? "Consistent visibility throughout the property search cycle." 
                   : "Front-load impressions during peak house-hunting hours."}
              </p>
           </section>

           <section className="space-y-4">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-custom flex items-center gap-2">
                 <BarChart3 size={12} /> Frequency Capping
              </label>
              <div className="flex items-center gap-4">
                 <input 
                   type="number" 
                   value={frequency}
                   onChange={(e) => setFrequency(e.target.value)}
                   className="w-20 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-xs font-black text-main focus:outline-none"
                 />
                 <p className="text-[10px] font-bold text-muted-custom">views per user per day.</p>
              </div>
           </section>
        </div>

        {/* Projected Outcome Panel */}
        <div className="lg:col-span-5">
           <div className="card-surface rounded-2xl border-custom p-6 sticky top-24 space-y-8 bg-black/40">
              <div className="flex justify-between items-start">
                 <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-primary-gold mb-2 font-inter">Kao Financial Intelligence</h4>
                    <p className="text-sm font-bold text-main/60">Optimizing KES {budget.toLocaleString()} daily spend.</p>
                 </div>
                 <div className="p-2 rounded bg-primary-gold/10 text-primary-gold"><Info size={16} /></div>
              </div>

              <div className="space-y-6">
                 <div className="flex justify-between items-end border-b border-white/5 pb-4">
                    <div>
                       <p className="text-[18px] font-black text-main font-inter">{Math.floor(budget / 45).toLocaleString()}</p>
                       <p className="text-[9px] font-black uppercase text-muted-custom font-inter">Est. Daily Leads</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[18px] font-black text-main font-inter">{(budget * 3).toLocaleString()}</p>
                       <p className="text-[9px] font-black uppercase text-muted-custom font-inter">Est. Daily Map Views</p>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                       <span className="text-muted-custom">Auction Strength</span>
                       <div className="flex gap-1">
                          <div className="w-4 h-1 bg-primary-gold rounded-full" />
                          <div className="w-4 h-1 bg-primary-gold rounded-full" />
                          <div className="w-4 h-1 bg-primary-gold rounded-full" />
                          <div className="w-4 h-1 bg-primary-gold rounded-full" />
                       </div>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                       <span className="text-muted-custom">Lead Readiness</span>
                       <span className="text-emerald-500 flex items-center gap-1 font-inter"><Zap size={10} /> Optimal</span>
                    </div>
                 </div>
              </div>

              <div className="p-4 rounded-xl border border-white/5 bg-white/5">
                 <div className="flex items-center gap-3 mb-3">
                    <Wallet size={16} className="text-muted-custom" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-main font-inter">Wallet Readiness</span>
                 </div>
                 <div className="flex justify-between items-baseline">
                    <span className="text-xl font-black text-main font-inter">KES 145,000</span>
                    <span className="text-[9px] font-black text-muted-custom uppercase font-inter">Available</span>
                 </div>
                 <p className="text-[8px] font-bold text-muted-custom mt-2 italic">Supports 9.6 days of this high-intent campaign.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function StrategyButton({ active, onClick, label, desc, icon }: any) {
   return (
      <button 
         onClick={onClick}
         className={`p-4 rounded-xl border text-left transition-all group ${
            active ? "border-primary-gold bg-primary-gold/5" : "border-custom hover:border-white/10 bg-white/[0.02]"
         }`}
      >
         <div className="flex items-center gap-3 mb-2">
            <div className={`p-1.5 rounded transition-colors ${active ? "bg-primary-gold/10 text-primary-gold" : "bg-white/5 text-muted-custom group-hover:text-main"}`}>
               {icon}
            </div>
            <p className={`text-xs font-black uppercase tracking-widest ${active ? "text-primary-gold" : "text-main"} font-inter`}>{label}</p>
         </div>
         <p className="text-[10px] font-medium text-muted-custom leading-relaxed font-inter">{desc}</p>
      </button>
   );
}
