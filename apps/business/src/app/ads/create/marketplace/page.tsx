"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2,
  Info,
  HelpCircle,
  ShieldCheck,
  Zap,
  ChevronRight,
  X,
  ShoppingBag
} from "lucide-react";

// Modular Marketplace Stage Components
import PlacementStage, { MARKETPLACE_PLACEMENTS } from "./components/PlacementStage";
import MaterialStage from "./components/MaterialStage";
import TargetingStage from "./components/TargetingStage";
import BudgetStage from "./components/BudgetStage";

type Stage = "placement" | "format" | "targeting" | "budget" | "review";

const HELP_CONTENT: Record<Stage, { title: string; points: string[] }> = {
  placement: {
    title: "Marketplace Inventory",
    points: [
      "Boosted Listings dominate the first 4 slots of search results.",
      "Checkout Cross-sell targets users with high purchase intent.",
      "Store Spotlights are best for building seller brand equity.",
      "Search Banners are ideal for announcing store-wide flash sales."
    ]
  },
  format: {
    title: "Commerce Ad Formats",
    points: [
      "Product Cards sync live price, stock, and rating data.",
      "Offer Cards require a valid platform promotion code.",
      "Carousels are optimized for multi-item store discovery.",
      "Ads are auto-paused if linked items go out of stock."
    ]
  },
  targeting: {
    title: "Consumer Segmentation",
    points: [
      "Category targeting isolates shoppers by product interest.",
      "Condition targeting (New/Refurbished) filters by buyer preference.",
      "Spending brackets target users based on historical checkout values.",
      "Nationwide reach is default, but focus remains on delivery hubs."
    ]
  },
  budget: {
    title: "Sales Bidding Logic",
    points: [
      "Sales Velocity bidding maximizes purchases within your budget.",
      "Frequency capping prevents 'Ad Fatigue' for repeat shoppers.",
      "Payday weekend spikes typically require 2x higher daily budgets.",
      "CPA tracking is enabled for all Marketplace campaign types."
    ]
  },
  review: {
    title: "Deployment Summary",
    points: [
      "Marketplace ads go live after a 15-minute technical validation.",
      "Budget is managed via your centralized business console wallet.",
      "Inventory sync is checked every 300 seconds for consistency.",
      "Performance metrics include ROAS and Conversion Rate (CVR)."
    ]
  }
};

export default function MarketplaceAdWizard() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("placement");
  const [selectedPlacement, setSelectedPlacement] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  const currentPlacement = useMemo(() => 
    MARKETPLACE_PLACEMENTS.find(p => p.id === selectedPlacement), 
    [selectedPlacement]
  );

  const STAGES: Stage[] = ["placement", "format", "targeting", "budget", "review"];
  const currentStageIndex = STAGES.indexOf(stage);

  const handleNext = () => {
    if (currentStageIndex < STAGES.length - 1) {
      setStage(STAGES[currentStageIndex + 1]);
    }
  };

  const handleBack = () => {
    if (currentStageIndex > 0) {
      setStage(STAGES[currentStageIndex - 1]);
    } else {
      router.back();
    }
  };

  return (
    <div className="min-h-screen bg-main font-inter text-main selection:bg-primary-gold/30 flex flex-col">
      
      {/* Dynamic Header */}
      <header className="border-b border-custom bg-black/40 backdrop-blur-xl sticky top-0 z-[60]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-5">
             <button 
               onClick={handleBack}
               className="p-2.5 rounded-xl bg-white/5 border border-custom text-muted-custom hover:text-main hover:border-white/20 transition-all"
             >
                <ArrowLeft size={20} />
             </button>
             <div>
                <h1 className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-3">
                   <ShoppingBag size={16} className="text-primary-gold" /> Marketplace Architect
                </h1>
                <div className="flex items-center gap-2 mt-1">
                   <span className="text-[10px] font-black text-primary-gold uppercase">Sector: Commerce</span>
                   <span className="text-custom">•</span>
                   <span className="text-[10px] font-bold text-muted-custom uppercase tracking-widest">{stage}</span>
                </div>
             </div>
          </div>
          
          <div className="flex items-center gap-8">
             <div className="hidden md:flex gap-2">
                {STAGES.map((s, idx) => (
                   <div 
                     key={s} 
                     className={`h-1.5 w-10 rounded-full transition-all duration-500 ${
                       idx <= currentStageIndex ? 'bg-primary-gold' : 'bg-white/10'
                     }`} 
                   />
                ))}
             </div>
             <button 
               onClick={() => setShowHelp(!showHelp)}
               className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all ${
                 showHelp ? 'bg-primary-gold text-black border-primary-gold' : 'bg-white/5 border-white/10 text-muted-custom hover:text-main'
               }`}
             >
                <HelpCircle size={14} /> Help
             </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Main Workspace */}
        <main className="flex-1 overflow-y-auto custom-scrollbar relative">
          <div className="max-w-4xl mx-auto px-6 py-16">
            <AnimatePresence mode="wait">
              
              {/* STAGE 1: PLACEMENT */}
              {stage === "placement" && (
                <motion.div key="placement" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                   <div className="mb-12">
                      <h2 className="text-3xl font-black tracking-tighter">Surface Inventory</h2>
                      <p className="text-sm font-medium text-muted-custom mt-2">Identify the core commerce surface where your product or store will be featured.</p>
                   </div>
                   <PlacementStage selected={selectedPlacement} onSelect={setSelectedPlacement} />
                </motion.div>
              )}

              {/* STAGE 2: FORMAT */}
              {stage === "format" && (
                <motion.div key="format" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                   <div className="mb-12">
                      <h2 className="text-3xl font-black tracking-tighter">Sales Material</h2>
                      <p className="text-sm font-medium text-muted-custom mt-2">Sync your live product inventory or store profile to the campaign engine.</p>
                   </div>
                   <MaterialStage allowedFormats={currentPlacement?.allowedFormats || []} selected={selectedFormat} onSelect={setSelectedFormat} />
                </motion.div>
              )}

              {/* STAGE 3: TARGETING */}
              {stage === "targeting" && (
                <motion.div key="targeting" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                   <div className="mb-12">
                      <h2 className="text-3xl font-black tracking-tighter">Shopper Segments</h2>
                      <p className="text-sm font-medium text-muted-custom mt-2">Define the product categories and consumer spending brackets for your reach.</p>
                   </div>
                   <TargetingStage />
                </motion.div>
              )}

              {/* STAGE 4: BUDGET */}
              {stage === "budget" && (
                <motion.div key="budget" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                   <div className="mb-12">
                      <h2 className="text-3xl font-black tracking-tighter">Sales Bidding</h2>
                      <p className="text-sm font-medium text-muted-custom mt-2">Configure conversion-optimized bidding for high-intent shoppers.</p>
                   </div>
                   <BudgetStage />
                </motion.div>
              )}

              {/* STAGE 5: REVIEW */}
              {stage === "review" && (
                <motion.div key="review" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12 text-center py-10">
                   <div className="flex flex-col items-center gap-6">
                      <div className="size-24 rounded-full bg-emerald-500/10 border-2 border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.1)]">
                         <CheckCircle2 size={48} />
                      </div>
                      <div>
                        <h2 className="text-4xl font-black tracking-tighter">Commerce Verified</h2>
                        <p className="text-sm font-medium text-muted-custom mt-3">Your marketplace campaign is synced and ready for store deployment.</p>
                      </div>
                   </div>

                   <div className="max-w-lg mx-auto bg-white/5 border border-custom rounded-2xl p-8 text-left space-y-5">
                      <ReviewItem label="Engine Type" value="Marketplace (Commerce)" />
                      <ReviewItem label="Placement" value={currentPlacement?.name || "N/A"} />
                      <ReviewItem label="Format" value={selectedFormat?.toUpperCase() || "N/A"} />
                      <ReviewItem label="Daily Spend" value="KES 8,000" />
                      <ReviewItem label="Est. Duration" value="18.1 Days" />
                   </div>

                   <div className="flex flex-col items-center gap-6">
                      <button 
                        onClick={() => router.push("/ads")}
                        className="px-16 py-6 rounded-2xl bg-primary-gold text-black text-[13px] font-black uppercase tracking-[0.25em] hover:brightness-110 transition-all shadow-2xl shadow-primary-gold/20 flex items-center gap-3"
                      >
                         Launch Sales Campaign <Zap size={18} />
                      </button>
                      <button className="text-[11px] font-black uppercase tracking-widest text-muted-custom hover:text-main transition-colors flex items-center gap-2">
                         Export Commerce Report <ChevronRight size={14} />
                      </button>
                   </div>
                </motion.div>
              )}

            </AnimatePresence>

            {/* Navigation Bar */}
            {stage !== "review" && (
              <div className="mt-20 pt-10 border-t border-custom flex justify-between items-center">
                 <div className="flex items-center gap-3 text-emerald-500">
                    <ShieldCheck size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Inventory Sync Verified</span>
                 </div>
                 <button 
                    disabled={stage === "placement" && !selectedPlacement || stage === "format" && !selectedFormat}
                    onClick={handleNext}
                    className="flex items-center gap-3 px-10 py-5 rounded-2xl bg-primary-gold text-black text-[12px] font-black uppercase tracking-[0.15em] disabled:opacity-30 transition-all hover:brightness-110 shadow-lg shadow-primary-gold/20"
                  >
                     Proceed to {STAGES[currentStageIndex + 1]} <ArrowRight size={18} />
                  </button>
              </div>
            )}
          </div>
        </main>

        {/* HELP SIDEBAR */}
        <AnimatePresence>
          {showHelp && (
            <motion.aside 
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              className="w-96 border-l border-custom bg-[#050505] p-10 z-[70] flex flex-col"
            >
               <div className="flex items-center justify-between mb-10">
                  <h3 className="text-xs font-black uppercase tracking-widest text-primary-gold">Marketplace Support</h3>
                  <button onClick={() => setShowHelp(false)} className="text-muted-custom hover:text-main"><X size={20} /></button>
               </div>

               <div className="space-y-10">
                  <div>
                    <h4 className="text-lg font-black text-main tracking-tight mb-2">{HELP_CONTENT[stage].title}</h4>
                    <p className="text-[11px] font-medium text-muted-custom uppercase tracking-widest">Commerce Context</p>
                  </div>

                  <div className="space-y-6">
                    {HELP_CONTENT[stage].points.map((point, idx) => (
                      <div key={idx} className="flex items-start gap-4">
                         <div className="size-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-[10px] font-black text-primary-gold">{idx + 1}</div>
                         <p className="text-[13px] font-medium text-main/80 leading-relaxed">{point}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-10 p-5 rounded-xl bg-white/5 border border-white/10">
                     <p className="text-[11px] font-black uppercase tracking-widest text-main mb-3 flex items-center gap-2">
                        <Info size={14} className="text-primary-gold" /> Sales Pro Tip
                     </p>
                     <p className="text-[12px] font-medium text-muted-custom leading-relaxed">
                        Campaigns featuring **Limited Time Offers** on Checkout pages see a 34% reduction in cart abandonment.
                     </p>
                  </div>
               </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ReviewItem({ label, value }: { label: string, value: string }) {
   return (
      <div className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
         <span className="text-[10px] font-black uppercase text-muted-custom tracking-widest">{label}</span>
         <span className="text-xs font-black text-main">{value}</span>
      </div>
   );
}
