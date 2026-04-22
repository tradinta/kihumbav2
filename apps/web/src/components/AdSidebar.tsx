"use client";

import { ExternalLink, Sparkles, Info, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

interface AdSidebarProps {
  type?: 'GENERAL' | 'PROPERTY' | 'MARKETPLACE';
}

export default function AdSidebar({ type = 'GENERAL' }: AdSidebarProps) {
  const content = {
    GENERAL: {
      title: "Sponsored Content",
      desc: "Promote your brand or community to thousands of Kihumba citizens.",
      cta: "Contact Sales",
    },
    PROPERTY: {
      title: "Featured Property",
      desc: "Find premium rentals and vetted roommates in Nairobi's best neighborhoods.",
      cta: "Browse Listings",
    },
    MARKETPLACE: {
      title: "Promoted Products",
      desc: "Get your products in front of buyers looking for quality and value.",
      cta: "List Now",
    }
  }[type];

  return (
    <aside className="space-y-4 sticky top-20 w-full">
      {/* Primary Ad Unit */}
      <div className="card-surface p-6 rounded-sm border border-custom flex flex-col items-center justify-center min-h-[420px] text-center gap-5 group cursor-pointer hover:border-primary-gold/20 transition-all">
        <div className="size-14 rounded-sm bg-white/5 border border-custom flex items-center justify-center text-muted-custom group-hover:text-primary-gold transition-all duration-500 shadow-inner">
           <Sparkles size={28} />
        </div>
        
        <div className="space-y-2">
           <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-custom group-hover:text-primary-gold transition-colors">
              {content.title}
           </h3>
           <p className="text-[11px] text-muted-custom font-medium uppercase tracking-widest leading-relaxed px-2">
              {content.desc}
           </p>
        </div>

        <button className="h-10 px-8 rounded-sm bg-white/5 border border-custom text-[9px] font-bold uppercase tracking-widest text-muted-custom hover:bg-primary-gold hover:text-black hover:border-primary-gold transition-all flex items-center gap-2 shadow-lg">
           <ExternalLink size={14} /> {content.cta}
        </button>
      </div>

      {/* Secondary Ad / Support Unit */}
      <div className="card-surface p-5 rounded-sm border border-custom bg-gradient-to-br from-transparent to-primary-gold/5">
        <div className="flex items-center gap-2 mb-3">
           <Info className="text-primary-gold" size={16} />
           <h3 className="text-[10px] font-bold uppercase tracking-widest text-main">Ad Solutions</h3>
        </div>
        <p className="text-[9px] text-muted-custom font-medium uppercase tracking-widest leading-relaxed mb-4">
           Launch targeted {type.toLowerCase()} campaigns within the Kihumba ecosystem.
        </p>
        <div className="h-px bg-white/5 mb-4" />
        <button className="text-[9px] font-bold uppercase text-primary-gold hover:underline flex items-center gap-1">
           Partner with us <ExternalLink size={10} />
        </button>
      </div>
    </aside>
  );
}
