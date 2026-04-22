"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Layout, MapPin, Monitor, LayoutGrid, Users, ShieldCheck, TrendingUp, Info, Search, FileText } from "lucide-react";

export interface KaoPlacement {
  id: string;
  name: string;
  desc: string;
  icon: any;
  pricing: string;
  price: string;
  allowedFormats: string[];
  intent: "Listing Views" | "Lead Gen" | "Brand Awareness";
}

export const KAO_PLACEMENTS: KaoPlacement[] = [
  { id: "featured-listing", name: "Featured Listing", desc: "Top of search results (slots 1-2) with gold border.", icon: Layout, pricing: "CPC", price: "KES 25-50", allowedFormats: ["property-card"], intent: "Listing Views" },
  { id: "map-pin", name: "Map Pin Highlight", desc: "Gold/pulsing pin on map with hover details.", icon: MapPin, pricing: "CPM", price: "KES 300-600", allowedFormats: ["map-pin"], intent: "Lead Gen" },
  { id: "search-banner", name: "Search Banner", desc: "Horizontal banner above property search results.", icon: Monitor, pricing: "CPM or Flat", price: "KES 400-800", allowedFormats: ["banner"], intent: "Brand Awareness" },
  { id: "detail-sidebar", name: "Property Detail Sidebar", desc: "Native cards on specific listing pages.", icon: LayoutGrid, pricing: "CPC", price: "KES 20-40", allowedFormats: ["property-card", "agent-card"], intent: "Listing Views" },
  { id: "category-header", name: "Category Header", desc: "Full-width banner at top of neighborhood pages.", icon: Monitor, pricing: "Flat Weekly", price: "KES 15k-30k", allowedFormats: ["banner"], intent: "Brand Awareness" },
  { id: "agent-spotlight", name: "Agent Spotlight", desc: "Featured agent card in discovery or sidebars.", icon: Users, pricing: "CPC", price: "KES 15-30", allowedFormats: ["agent-card"], intent: "Lead Gen" },
  { id: "app-flow", name: "Application Flow", desc: "Served after user submits a rental application.", icon: FileText, pricing: "CPA", price: "KES 50-150", allowedFormats: ["service-card"], intent: "Lead Gen" },
];

export default function KaoPlacementStage({ selected, onSelect }: { selected: string | null, onSelect: (id: string) => void }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {KAO_PLACEMENTS.map((p) => (
          <button 
            key={p.id}
            onClick={() => onSelect(p.id)}
            className={`flex items-start gap-4 p-5 rounded-xl border transition-all text-left group relative overflow-hidden ${
              selected === p.id 
               ? "border-primary-gold bg-primary-gold/5" 
               : "border-custom hover:border-white/20 bg-white/[0.02]"
            }`}
          >
            <div className={`p-3 rounded-lg border transition-all shrink-0 ${
              selected === p.id 
                ? "border-primary-gold/40 text-primary-gold" 
                : "border-white/10 text-muted-custom group-hover:text-main"
            }`}>
              <p.icon size={24} />
            </div>
            <div className="flex-1 min-w-0 pr-4">
              <div className="flex items-center gap-2">
                <p className="text-xs font-black uppercase tracking-widest">{p.name}</p>
                <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded border ${
                  p.intent === 'Listing Views' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                  p.intent === 'Lead Gen' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' :
                  'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                }`}>
                  {p.intent}
                </span>
              </div>
              <p className="text-[10px] font-medium text-muted-custom mt-2 leading-relaxed">{p.desc}</p>
              <div className="flex items-center gap-4 mt-4 text-[9px] font-black uppercase tracking-widest">
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
               <h4 className="text-[10px] font-black uppercase tracking-widest text-primary-gold">Kao Intelligence: {KAO_PLACEMENTS.find(p => p.id === selected)?.name}</h4>
               <p className="text-[11px] font-medium text-main/70 mt-2 leading-relaxed">
                  Real estate activity on Kihumba peaks during **Sundays (house hunting)** and **Mondays (agent outreach)**. 
                  This placement leverages the Kao search index to ensure 100% relevance to property-seeking users. 
                  Average lead conversion for this surface is **3.4%**.
               </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
