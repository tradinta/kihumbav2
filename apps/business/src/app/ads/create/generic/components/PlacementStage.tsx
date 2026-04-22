"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Layout, Zap, Play, Film, Monitor, LayoutGrid, MessageSquare, Users, Search, UserCircle, Info, TrendingUp, AlertCircle } from "lucide-react";

export interface Placement {
  id: string;
  name: string;
  desc: string;
  icon: any;
  pricing: string;
  price: string;
  allowedFormats: string[];
  intent: "Awareness" | "Engagement" | "Conversion";
  hotspot: boolean;
}

export const PLACEMENTS: Placement[] = [
  { id: "feed-post", name: "In-Feed Post", desc: "Native integration in the main scrolling feed.", icon: Layout, pricing: "CPC or CPM", price: "KES 8-15 / 200-400", allowedFormats: ["image", "carousel", "video"], intent: "Engagement", hotspot: true },
  { id: "sparks", name: "Sparks Interstitial", desc: "High-impact full-screen vertical video between content.", icon: Zap, pricing: "CPV", price: "KES 3-8", allowedFormats: ["vertical-video", "image"], intent: "Awareness", hotspot: true },
  { id: "pre-roll", name: "Video Pre-roll", desc: "Skippable or unskippable 5-15s ad before videos.", icon: Play, pricing: "CPV", price: "KES 5-12", allowedFormats: ["video"], intent: "Awareness", hotspot: false },
  { id: "mid-roll", name: "Video Mid-roll", desc: "Deeper engagement during long-form video content.", icon: Film, pricing: "CPV", price: "KES 8-15", allowedFormats: ["video"], intent: "Engagement", hotspot: false },
  { id: "overlay", name: "In-Video Overlay", desc: "Non-intrusive lower-third banner with direct CTA.", icon: Monitor, pricing: "CPC", price: "KES 5-10", allowedFormats: ["banner"], intent: "Conversion", hotspot: false },
  { id: "detail-sidebar", name: "Video Detail Sidebar", desc: "High-intent placement next to related video content.", icon: LayoutGrid, pricing: "CPM", price: "KES 150-300", allowedFormats: ["image", "carousel"], intent: "Engagement", hotspot: false },
  { id: "sponsored-comment", name: "Sponsored Comment", desc: "Direct brand interaction pinned in conversations.", icon: MessageSquare, pricing: "CPM", price: "KES 100-200", allowedFormats: ["text-thumbnail"], intent: "Engagement", hotspot: true },
  { id: "comment-insert", name: "Comment Feed Insert", desc: "Subtle native card between user discussions.", icon: MessageSquare, pricing: "CPM", price: "KES 80-150", allowedFormats: ["native-card"], intent: "Engagement", hotspot: false },
  { id: "feed-sidebar", name: "Feed Sidebar", desc: "Persistent visibility on home and feed sidebars.", icon: LayoutGrid, pricing: "CPM or Flat", price: "KES 200-500", allowedFormats: ["sticky-card", "banner", "carousel"], intent: "Awareness", hotspot: false },
  { id: "tribe-spotlight", name: "Tribe Spotlight", desc: "Drive community growth in the discovery tab.", icon: Users, pricing: "CPC", price: "KES 10-20", allowedFormats: ["tribe-card"], intent: "Conversion", hotspot: false },
  { id: "search-results", name: "Search Results", desc: "Capture high-intent users looking for specific topics.", icon: Search, pricing: "CPC", price: "KES 10-25", allowedFormats: ["result-card"], intent: "Conversion", hotspot: true },
  { id: "profile-redirect", name: "Profile Redirect", desc: "Incentivize followers with profile suggestions.", icon: UserCircle, pricing: "CPC", price: "KES 8-15", allowedFormats: ["profile-card"], intent: "Conversion", hotspot: false },
];

export default function PlacementStage({ selected, onSelect }: { selected: string | null, onSelect: (id: string) => void }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PLACEMENTS.map((p) => (
          <button 
            key={p.id}
            onClick={() => onSelect(p.id)}
            className={`flex items-start gap-4 p-5 rounded-xl border transition-all text-left group relative overflow-hidden ${
              selected === p.id 
               ? "border-primary-gold bg-primary-gold/5" 
               : "border-custom hover:border-white/20 bg-white/[0.02]"
            }`}
          >
            {p.hotspot && (
              <div className="absolute top-0 right-0 bg-primary-gold/20 text-primary-gold text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-bl-lg flex items-center gap-1">
                <TrendingUp size={10} /> Active Hotspot
              </div>
            )}
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
                  p.intent === 'Awareness' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                  p.intent === 'Engagement' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' :
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
      
      {/* Detailed Technical Specs (Conditional on Selection) */}
      <AnimatePresence>
        {selected && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-xl border border-primary-gold/20 bg-primary-gold/[0.02] flex items-start gap-4"
          >
            <div className="p-2 rounded bg-primary-gold/10 text-primary-gold"><Info size={20} /></div>
            <div>
               <h4 className="text-[10px] font-black uppercase tracking-widest text-primary-gold">Technical Blueprint: {PLACEMENTS.find(p => p.id === selected)?.name}</h4>
               <p className="text-[11px] font-medium text-main/70 mt-2 leading-relaxed">
                  This placement is served via our **{PLACEMENTS.find(p => p.id === selected)?.pricing} engine**. It bypasses standard ad-blockers by using native platform components. 
                  Expect a peak traffic window between **18:00 and 22:00 EAT**. 
                  Recommended for **{PLACEMENTS.find(p => p.id === selected)?.intent}** objectives.
               </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
