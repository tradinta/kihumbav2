"use client";

import { useState } from "react";
import { Calendar, Award, Monitor, Ticket, ChevronRight, Check, AlertCircle, Users } from "lucide-react";

export const EVENT_FORMAT_DATA: Record<string, { name: string; desc: string; icon: any; specs: string }> = {
  "event-card": { name: "Event Card", desc: "Native listing format with poster & 'Featured' badge.", icon: Calendar, specs: "Requires valid Event ID" },
  "sponsor-badge": { name: "Sponsor Badge", desc: "Integrated logo placement on event detail pages.", icon: Award, specs: "Transparent PNG • 512x512px" },
  "banner": { name: "Category Banner", desc: "Horizontal hero poster for category headers.", icon: Monitor, specs: "1920x480px recommended • Max 5MB" },
  "offer-card": { name: "Offer Card", desc: "Post-purchase upsell for related events.", icon: Ticket, specs: "Direct ticket link mandatory" },
};

const EVENT_CTA_OPTIONS = ["Get Tickets", "View Event", "RSVP", "Learn More", "Visit Sponsor"];

export default function EventMaterialStage({ 
  allowedFormats, 
  selected, 
  onSelect 
}: { 
  allowedFormats: string[], 
  selected: string | null, 
  onSelect: (id: string) => void 
}) {
  const [eventId, setEventId] = useState("");
  const [cta, setCta] = useState(EVENT_CTA_OPTIONS[0]);

  return (
    <div className="space-y-12">
      {/* Format Selection Grid */}
      <div className="space-y-4">
        <label className="text-[9px] font-black uppercase tracking-widest text-muted-custom">Select Event Ad Format</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {allowedFormats.map((fId) => {
            const f = EVENT_FORMAT_DATA[fId];
            return (
              <button 
                key={fId}
                onClick={() => onSelect(fId)}
                className={`flex flex-col gap-4 p-5 rounded-xl border transition-all text-left group ${
                  selected === fId 
                   ? "border-primary-gold bg-primary-gold/5" 
                   : "border-custom hover:border-white/20 bg-white/[0.02]"
                }`}
              >
                <div className={`size-10 rounded-lg border flex items-center justify-center transition-all ${
                  selected === fId 
                    ? "border-primary-gold/40 text-primary-gold" 
                    : "border-white/10 text-muted-custom group-hover:text-main"
                }`}>
                  <f.icon size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest">{f.name}</p>
                  <p className="text-[9px] font-medium text-muted-custom mt-1 leading-relaxed">{f.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sync Section (Conditional on Format Selection) */}
      {selected && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pt-8 border-t border-custom">
          <div className="md:col-span-7 space-y-8">
             <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-muted-custom mb-3">
                  {selected === 'sponsor-badge' ? 'Sponsor Profile ID' : 'Verified Event ID'}
                </label>
                <div className="flex gap-2">
                   <input 
                     type="text" 
                     value={eventId}
                     onChange={(e) => setEventId(e.target.value)}
                     placeholder={selected === 'sponsor-badge' ? "e.g. SPONSOR-772" : "e.g. EVENT-9001-JAZZ"} 
                     className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm font-black text-main focus:outline-none focus:border-primary-gold/50 transition-all font-mono"
                   />
                   <button className="px-6 py-3 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                      Sync
                   </button>
                </div>
                {eventId && (
                   <div className="mt-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-center gap-3">
                      <div className="size-10 bg-white/10 rounded-md shrink-0 flex items-center justify-center text-muted-custom">
                         <Calendar size={20} />
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-main uppercase">Linked: Nairobi Jazz Festival</p>
                         <p className="text-[9px] font-bold text-muted-custom">April 25, 2026 • 2.4k Confirmed</p>
                      </div>
                      <Check className="text-emerald-500 ml-auto" size={16} />
                   </div>
                )}
             </div>

             <div className="p-6 rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex flex-col items-center justify-center gap-4 group cursor-pointer hover:bg-white/5 transition-all">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-custom">Poster Rendering Engine</p>
                <div className="w-full aspect-[3/4] max-w-[200px] bg-black rounded-lg border border-white/5 flex items-center justify-center">
                   <p className="text-[9px] font-black uppercase text-white/20">Event Poster Preview</p>
                </div>
             </div>
          </div>

          <div className="md:col-span-5 space-y-8">
             <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-muted-custom mb-3">Call to Action (CTA)</label>
                <div className="grid grid-cols-1 gap-2">
                   {EVENT_CTA_OPTIONS.map((option) => (
                      <button 
                        key={option}
                        onClick={() => setCta(option)}
                        className={`px-4 py-3 rounded-lg border text-left text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-between group ${
                           cta === option 
                             ? "bg-primary-gold text-black border-primary-gold" 
                             : "bg-white/5 border-white/10 text-muted-custom hover:border-white/20"
                        }`}
                      >
                         {option}
                         <ChevronRight size={14} className={cta === option ? "opacity-100" : "opacity-0 group-hover:opacity-100 transition-opacity"} />
                      </button>
                   ))}
                </div>
             </div>

             <div className="p-4 rounded-xl border border-purple-500/20 bg-purple-500/5 flex items-start gap-3">
                <AlertCircle size={16} className="text-purple-500 shrink-0" />
                <p className="text-[9px] font-bold text-purple-500/80 leading-relaxed">
                   Event ads must have active ticketing links. If an event is cancelled or postponed, the ad engine will pause automatically.
                </p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
