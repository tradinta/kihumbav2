"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Monitor, LayoutGrid, Ticket, Award, TrendingUp, Info } from "lucide-react";

export interface EventPlacement {
  id: string;
  name: string;
  desc: string;
  icon: any;
  pricing: string;
  price: string;
  allowedFormats: string[];
  intent: "Ticket Sales" | "RSVPs" | "Brand Sponsorship";
}

export const EVENT_PLACEMENTS: EventPlacement[] = [
  { id: "featured-event", name: "Featured Event", desc: "Top 2 slots in event listings with gold 'Featured' badge.", icon: Calendar, pricing: "CPC", price: "KES 20-40", allowedFormats: ["event-card"], intent: "Ticket Sales" },
  { id: "category-banner", name: "Category Banner", desc: "Full-width event poster at the top of category pages.", icon: Monitor, pricing: "Flat Weekly", price: "KES 15k-25k", allowedFormats: ["banner"], intent: "Ticket Sales" },
  { id: "detail-sidebar", name: "Event Detail Sidebar", desc: "Sponsored 'More Events' or brand cards on detail pages.", icon: LayoutGrid, pricing: "CPM", price: "KES 200-400", allowedFormats: ["event-card"], intent: "RSVPs" },
  { id: "post-purchase", name: "Post-Purchase Upsell", desc: "Targeted offers on the ticket confirmation page.", icon: Ticket, pricing: "CPA", price: "KES 40-100", allowedFormats: ["offer-card"], intent: "Ticket Sales" },
  { id: "sponsor-spotlight", name: "Sponsor Spotlight", desc: "Integrated 'Sponsored by' branding on event detail pages.", icon: Award, pricing: "Flat per Event", price: "KES 10k-50k", allowedFormats: ["sponsor-badge"], intent: "Brand Sponsorship" },
];

export default function EventPlacementStage({ selected, onSelect }: { selected: string | null, onSelect: (id: string) => void }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {EVENT_PLACEMENTS.map((p) => (
          <button 
            key={p.id}
            onClick={() => onSelect(p.id)}
            className={`flex flex-col gap-4 p-5 rounded-xl border transition-all text-left group relative overflow-hidden ${
              selected === p.id 
               ? "border-primary-gold bg-primary-gold/5" 
               : "border-custom hover:border-white/20 bg-white/[0.02]"
            }`}
          >
            <div className={`p-3 rounded-lg border transition-all w-fit ${
              selected === p.id 
                ? "border-primary-gold/40 text-primary-gold" 
                : "border-white/10 text-muted-custom group-hover:text-main"
            }`}>
              <p.icon size={22} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[10px] font-black uppercase tracking-widest">{p.name}</p>
                <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded border ${
                  p.intent === 'Ticket Sales' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                  p.intent === 'RSVPs' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                  'bg-purple-500/10 text-purple-500 border-purple-500/20'
                }`}>
                  {p.intent}
                </span>
              </div>
              <p className="text-[10px] font-medium text-muted-custom mt-2 leading-relaxed h-8 line-clamp-2">{p.desc}</p>
              <div className="flex items-center justify-between mt-4 text-[9px] font-black uppercase tracking-widest">
                <span className="text-main">{p.pricing}</span>
                <span className="text-primary-gold">{p.price}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
      
      <AnimatePresence>
        {selected && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-xl border border-primary-gold/20 bg-primary-gold/[0.02] flex items-start gap-4"
          >
            <div className="p-2 rounded bg-primary-gold/10 text-primary-gold"><Info size={20} /></div>
            <div>
               <h4 className="text-[10px] font-black uppercase tracking-widest text-primary-gold">Event Intelligence: {EVENT_PLACEMENTS.find(p => p.id === selected)?.name}</h4>
               <p className="text-[11px] font-medium text-main/70 mt-2 leading-relaxed">
                  Event discovery on Kihumba peaks **72 hours before the weekend**. 
                  Campaigns on the **{EVENT_PLACEMENTS.find(p => p.id === selected)?.name}** surface typically see a **25% lift in RSVPs** when they include a "Last Few Tickets" urgency tag.
               </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
