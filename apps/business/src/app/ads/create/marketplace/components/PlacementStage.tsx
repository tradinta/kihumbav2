"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Search, Layout, LayoutGrid, Monitor, Store, ShoppingCart, TrendingUp, Info } from "lucide-react";

export interface MarketplacePlacement {
  id: string;
  name: string;
  desc: string;
  icon: any;
  pricing: string;
  price: string;
  allowedFormats: string[];
  intent: "Sales" | "Traffic" | "Brand";
}

export const MARKETPLACE_PLACEMENTS: MarketplacePlacement[] = [
  { id: "boosted-listing", name: "Boosted Listing", desc: "Top 2-4 slots in search results with 'Sponsored' badge.", icon: ShoppingBag, pricing: "CPC", price: "KES 10-25", allowedFormats: ["product-card"], intent: "Sales" },
  { id: "search-banner", name: "Search Top Banner", desc: "Horizontal banner above results for store/brand promo.", icon: Monitor, pricing: "CPM or Flat", price: "KES 300-500", allowedFormats: ["banner"], intent: "Brand" },
  { id: "category-spotlight", name: "Category Spotlight", desc: "Large hero card at the top of category headers.", icon: Layout, pricing: "Flat Daily", price: "KES 8k-20k", allowedFormats: ["product-card"], intent: "Sales" },
  { id: "detail-cross-sell", name: "Detail Cross-sell", desc: "Sponsored items in the 'Similar Products' section.", icon: LayoutGrid, pricing: "CPC", price: "KES 8-18", allowedFormats: ["product-card"], intent: "Sales" },
  { id: "marketplace-sidebar", name: "Marketplace Sidebar", desc: "Sticky store banner or product carousel (desktop).", icon: LayoutGrid, pricing: "CPM", price: "KES 200-400", allowedFormats: ["banner", "carousel"], intent: "Traffic" },
  { id: "checkout-cross-sell", name: "Checkout Cross-sell", desc: "Post-purchase or add-to-cart conversion offers.", icon: ShoppingCart, pricing: "CPA", price: "KES 30-80", allowedFormats: ["product-card", "offer-card"], intent: "Sales" },
  { id: "store-spotlight", name: "Store Spotlight", desc: "Featured store card in the 'Top Sellers' directory.", icon: Store, pricing: "CPC", price: "KES 15-30", allowedFormats: ["store-card"], intent: "Brand" },
];

export default function MarketplacePlacementStage({ selected, onSelect }: { selected: string | null, onSelect: (id: string) => void }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MARKETPLACE_PLACEMENTS.map((p) => (
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
                  p.intent === 'Sales' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                  p.intent === 'Traffic' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
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
               <h4 className="text-[10px] font-black uppercase tracking-widest text-primary-gold">Marketplace Intelligence: {MARKETPLACE_PLACEMENTS.find(p => p.id === selected)?.name}</h4>
               <p className="text-[11px] font-medium text-main/70 mt-2 leading-relaxed">
                  Traffic on Kihumba Marketplace spikes during **Payday weekends** and **Lunch hours (12:00-14:00)**. 
                  Placements on the **{MARKETPLACE_PLACEMENTS.find(p => p.id === selected)?.name}** surface typically see a **15-20% higher conversion rate** when combined with free shipping offers.
               </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
