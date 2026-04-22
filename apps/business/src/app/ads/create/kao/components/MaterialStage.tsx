"use client";

import { useState } from "react";
import { Layout, MapPin, Monitor, Users, FileText, ChevronRight, Check, AlertCircle } from "lucide-react";

export const KAO_FORMAT_DATA: Record<string, { name: string; desc: string; icon: any; specs: string }> = {
  "property-card": { name: "Property Card", desc: "Native listing format with gold 'Featured' accent.", icon: Layout, specs: "Requires valid Kao Property ID" },
  "agent-card": { name: "Agent Card", desc: "Agent profile with name, rating & listing count.", icon: Users, specs: "Agent Profile Sync mandatory" },
  "banner": { name: "Horizontal Banner", desc: "Standard 728x90px or 320x50px graphic.", icon: Monitor, specs: "Max 2MB • JPG/PNG/GIF" },
  "map-pin": { name: "Map Pin", desc: "Custom icon with integrated hover popup card.", icon: MapPin, specs: "Custom SVG icon support included" },
  "service-card": { name: "Service Card", desc: "Full card for moving/insurance/utilities.", icon: FileText, specs: "CPA conversion tracking integrated" },
};

const KAO_CTA_OPTIONS = ["View Property", "Contact Agent", "Schedule Viewing", "Get Quote", "Apply Now"];

export default function KaoMaterialStage({ 
  allowedFormats, 
  selected, 
  onSelect 
}: { 
  allowedFormats: string[], 
  selected: string | null, 
  onSelect: (id: string) => void 
}) {
  const [listingId, setListingId] = useState("");
  const [cta, setCta] = useState(KAO_CTA_OPTIONS[0]);

  return (
    <div className="space-y-12">
      {/* Format Selection Grid */}
      <div className="space-y-4">
        <label className="text-[9px] font-black uppercase tracking-widest text-muted-custom">Select Property Ad Format</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allowedFormats.map((fId) => {
            const f = KAO_FORMAT_DATA[fId];
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
                <div className={`size-12 rounded-lg border flex items-center justify-center transition-all ${
                  selected === fId 
                    ? "border-primary-gold/40 text-primary-gold" 
                    : "border-white/10 text-muted-custom group-hover:text-main"
                }`}>
                  <f.icon size={24} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest">{f.name}</p>
                  <p className="text-[10px] font-medium text-muted-custom mt-1 leading-relaxed">{f.desc}</p>
                  <p className="text-[8px] font-black text-primary-gold/60 uppercase mt-3">{f.specs}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Property Details (Conditional on Selection) */}
      {selected && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pt-8 border-t border-custom">
          <div className="md:col-span-7 space-y-8">
             <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-muted-custom mb-3">
                  {selected === 'agent-card' ? 'Agent ID' : 'Kao Property ID'}
                </label>
                <div className="flex gap-2">
                   <input 
                     type="text" 
                     value={listingId}
                     onChange={(e) => setListingId(e.target.value)}
                     placeholder={selected === 'agent-card' ? "e.g. AGENT-9281" : "e.g. PROP-4401-KILIMANI"} 
                     className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm font-black text-main focus:outline-none focus:border-primary-gold/50 transition-all font-mono"
                   />
                   <button className="px-6 py-3 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                      Sync
                   </button>
                </div>
                {listingId && (
                   <div className="mt-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-center gap-3">
                      <div className="size-10 bg-white/10 rounded-md shrink-0" />
                      <div>
                         <p className="text-[10px] font-black text-main uppercase">Verified: 3BR Modern Apartment</p>
                         <p className="text-[9px] font-bold text-muted-custom">Kilimani, Nairobi • KES 120,000</p>
                      </div>
                      <Check className="text-emerald-500 ml-auto" size={16} />
                   </div>
                )}
             </div>

             <div className="p-6 rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex flex-col items-center justify-center gap-4 group cursor-pointer hover:bg-white/5 transition-all">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-custom">Dynamic Preview Engine</p>
                <div className="w-full aspect-video bg-black rounded-lg border border-white/5 flex items-center justify-center">
                   <p className="text-[9px] font-black uppercase text-white/20">Rendered Card Preview</p>
                </div>
             </div>
          </div>

          <div className="md:col-span-5 space-y-8">
             <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-muted-custom mb-3">Engagement CTA</label>
                <div className="grid grid-cols-1 gap-2">
                   {KAO_CTA_OPTIONS.map((option) => (
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

             <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 flex items-start gap-3">
                <AlertCircle size={16} className="text-amber-500 shrink-0" />
                <p className="text-[9px] font-bold text-amber-500/80 leading-relaxed">
                   Property ads must include a physical address and verified price. Misleading listings will be auto-rejected.
                </p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
