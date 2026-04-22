"use client";

import { useState } from "react";
import { Music, MapPin, Calendar, Users, Target, TrendingUp, ShieldCheck, Map } from "lucide-react";

const EVENT_CATEGORIES = ["Music & Festivals", "Tech & Business", "Art & Culture", "Workshops", "Networking", "Nightlife"];
const DATE_TARGETING = ["Last Minute (Next 48h)", "This Weekend", "Upcoming (Next 30 Days)", "Long Term"];
const ATTENDEE_CAPACITY = ["Boutique (<100)", "Medium (100-500)", "Large (500-2k)", "Festival (2k+)"];
const TICKET_BRACKETS = ["Free", "Under 1k", "1k - 5k", "5k - 10k", "VVIP (10k+)"];

export default function EventTargetingStage() {
  const [selectedCats, setSelectedCats] = useState<string[]>(["Music & Festivals"]);
  const [selectedDates, setSelectedDates] = useState<string[]>(["This Weekend"]);
  const [selectedBracket, setSelectedBracket] = useState("1k - 5k");

  const toggleCat = (cat: string) => {
    setSelectedCats(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const toggleDate = (date: string) => {
    setSelectedDates(prev => 
      prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date]
    );
  };

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Core Event Demographics */}
        <div className="lg:col-span-7 space-y-10">
           <section className="space-y-4">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-custom flex items-center gap-2">
                 <Music size={12} /> Event Categories
              </label>
              <div className="flex flex-wrap gap-2">
                 {EVENT_CATEGORIES.map(cat => (
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
                 <Calendar size={12} /> Proximity Targeting (Dates)
              </label>
              <div className="flex flex-wrap gap-2">
                 {DATE_TARGETING.map(date => (
                    <button 
                      key={date}
                      onClick={() => toggleDate(date)}
                      className={`px-4 py-2 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all ${
                         selectedDates.includes(date) 
                           ? "bg-primary-gold text-black border-primary-gold" 
                           : "bg-white/5 border-white/10 text-muted-custom hover:border-white/20"
                      }`}
                    >
                       {date}
                    </button>
                 ))}
              </div>
           </section>

           <section className="space-y-4">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-custom flex items-center gap-2">
                 <Users size={12} /> Attendee Intent (Capacity Preference)
              </label>
              <div className="grid grid-cols-2 gap-3">
                 {ATTENDEE_CAPACITY.map(cap => (
                    <button key={cap} className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-muted-custom hover:border-primary-gold/30 transition-all text-left">
                       {cap}
                    </button>
                 ))}
              </div>
           </section>

           <section className="space-y-4">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-custom flex items-center gap-2">
                 <MapPin size={12} /> Ticket Spending Power
              </label>
              <div className="flex flex-wrap gap-2">
                 {TICKET_BRACKETS.map(bracket => (
                    <button 
                      key={bracket}
                      onClick={() => setSelectedBracket(bracket)}
                      className={`px-4 py-2 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all ${
                         selectedBracket === bracket 
                           ? "bg-primary-gold text-black border-primary-gold" 
                           : "bg-white/5 border-white/10 text-muted-custom hover:border-white/20"
                      }`}
                    >
                       {bracket}
                    </button>
                 ))}
              </div>
           </section>
        </div>

        {/* Reach Prediction Panel */}
        <div className="lg:col-span-5">
           <div className="card-surface rounded-2xl border-custom p-6 sticky top-24 space-y-8 overflow-hidden relative bg-[#0d0910]">
              <div className="absolute top-0 right-0 p-8 opacity-[0.05] pointer-events-none text-purple-500">
                 <Calendar size={150} />
              </div>
              
              <div>
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-primary-gold flex items-center gap-2 mb-6">
                    <TrendingUp size={14} /> Event Pulse
                 </h4>
                 <div className="space-y-1">
                    <p className="text-4xl font-black tracking-tighter text-main">86,500</p>
                    <p className="text-[10px] font-bold text-muted-custom uppercase tracking-widest">Active Event Seekers (7d)</p>
                 </div>
              </div>

              <div className="space-y-4">
                 <PredictionItem label="Discovery Density" value="Very High" color="text-emerald-500" />
                 <PredictionItem label="Bid Landscape" value="Competitive" color="text-amber-500" />
                 <PredictionItem label="RSVP Propensity" value="94%" color="text-emerald-500" />
              </div>

              <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20 flex items-start gap-3">
                 <ShieldCheck size={16} className="text-purple-500 shrink-0" />
                 <p className="text-[10px] font-bold text-purple-500/80 leading-relaxed font-inter">
                    Your targeting is synchronized with the **Nairobi Nightlife** peak. Consumers in this segment have a 60% higher ticket-buy rate on Thursdays.
                 </p>
              </div>

              <div className="pt-6 border-t border-white/10">
                 <p className="text-[9px] font-black uppercase tracking-widest text-muted-custom mb-3">Geographic Pulse</p>
                 <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                    <Map size={16} className="text-primary-gold" />
                    <div>
                       <p className="text-[10px] font-black text-main">Nairobi & Environs</p>
                       <p className="text-[8px] font-bold text-muted-custom uppercase mt-0.5">Venue Radius Targeting Active</p>
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
