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
  Calendar
} from "lucide-react";

// Modular Event Stage Components
import PlacementStage, { EVENT_PLACEMENTS } from "./components/PlacementStage";
import MaterialStage from "./components/MaterialStage";
import TargetingStage from "./components/TargetingStage";
import BudgetStage from "./components/BudgetStage";

type Stage = "placement" | "format" | "targeting" | "budget" | "review";

const HELP_CONTENT: Record<Stage, { title: string; points: string[] }> = {
  placement: {
    title: "Event Inventory",
    points: [
      "Featured Events dominate the first 2 slots of discovery.",
      "Sponsor Spotlights integrate your brand directly into event pages.",
      "Post-Purchase Upsell targets high-intent ticket buyers.",
      "Category Banners are best for genre-specific (e.g. Jazz) dominance."
    ]
  },
  format: {
    title: "Event Ad Formats",
    points: [
      "Event Cards sync live posters, dates, and confirmed guest counts.",
      "Sponsor Badges require a high-res transparent PNG logo.",
      "Offer Cards are optimized for post-purchase secondary sales.",
      "Ads are auto-paused if an event is postponed or cancelled."
    ]
  },
  targeting: {
    title: "Audience Proximity",
    points: [
      "Date targeting ensures you reach users looking for 'This Weekend'.",
      "Category targeting isolates fans of specific genres or tech niches.",
      "Ticket spending power filters for users in specific price brackets.",
      "Venue radius targeting ensures reach within the event neighborhood."
    ]
  },
  budget: {
    title: "RSVP Bidding Logic",
    points: [
      "RSVP Velocity bidding maximizes confirmed guest lists.",
      "Accelerated delivery is ideal for the 48h lead-up to an event.",
      "Bidding is more competitive on Thursdays and Fridays.",
      "CPA tracking is built-in for all event ticket conversion types."
    ]
  },
  review: {
    title: "Deployment Summary",
    points: [
      "Event ads go live after a quick 10-minute technical sync.",
      "Budget is managed via your centralized business console wallet.",
      "Ticketing links are verified in real-time for consistency.",
      "Performance metrics include RSVP rate and Ticket Sales (CPA)."
    ]
  }
};

export default function EventAdWizard() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("placement");
  const [selectedPlacement, setSelectedPlacement] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  const currentPlacement = useMemo(() => 
    EVENT_PLACEMENTS.find(p => p.id === selectedPlacement), 
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
                   <Calendar size={16} className="text-primary-gold" /> Event Ad Architect
                </h1>
                <div className="flex items-center gap-2 mt-1">
                   <span className="text-[10px] font-black text-primary-gold uppercase">Sector: Experiences</span>
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
                      <h2 className="text-3xl font-black tracking-tighter">Event Inventory</h2>
                      <p className="text-sm font-medium text-muted-custom mt-2">Choose the discovery surface where your event or sponsorship will be featured.</p>
                   </div>
                   <PlacementStage selected={selectedPlacement} onSelect={setSelectedPlacement} />
                </motion.div>
              )}

              {/* STAGE 2: FORMAT */}
              {stage === "format" && (
                <motion.div key="format" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                   <div className="mb-12">
                      <h2 className="text-3xl font-black tracking-tighter">Experience Material</h2>
                      <p className="text-sm font-medium text-muted-custom mt-2">Sync your verified event posters or sponsor profiles to the campaign engine.</p>
                   </div>
                   <MaterialStage allowedFormats={currentPlacement?.allowedFormats || []} selected={selectedFormat} onSelect={setSelectedFormat} />
                </motion.div>
              )}

              {/* STAGE 3: TARGETING */}
              {stage === "targeting" && (
                <motion.div key="targeting" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                   <div className="mb-12">
                      <h2 className="text-3xl font-black tracking-tighter">Fan Segments</h2>
                      <p className="text-sm font-medium text-muted-custom mt-2">Target specific genres, date proximities, and attendee demographics.</p>
                   </div>
                   <TargetingStage />
                </motion.div>
              )}

              {/* STAGE 4: BUDGET */}
              {stage === "budget" && (
                <motion.div key="budget" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                   <div className="mb-12">
                      <h2 className="text-3xl font-black tracking-tighter">Event Bidding</h2>
                      <p className="text-sm font-medium text-muted-custom mt-2">Configure RSVP-optimized bidding for the lead-up to your experience.</p>
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
                        <h2 className="text-4xl font-black tracking-tighter">Experience Verified</h2>
                        <p className="text-sm font-medium text-muted-custom mt-3">Your event campaign is synced and ready for platform deployment.</p>
                      </div>
                   </div>

                   <div className="max-w-lg mx-auto bg-white/5 border border-custom rounded-2xl p-8 text-left space-y-5">
                      <ReviewItem label="Engine Type" value="Events (Experiences)" />
                      <ReviewItem label="Placement" value={currentPlacement?.name || "N/A"} />
                      <ReviewItem label="Format" value={selectedFormat?.toUpperCase() || "N/A"} />
                      <ReviewItem label="Daily Spend" value="KES 5,000" />
                      <ReviewItem label="Est. Duration" value="29 Days" />
                   </div>

                   <div className="flex flex-col items-center gap-6">
                      <button 
                        onClick={() => router.push("/ads")}
                        className="px-16 py-6 rounded-2xl bg-primary-gold text-black text-[13px] font-black uppercase tracking-[0.25em] hover:brightness-110 transition-all shadow-2xl shadow-primary-gold/20 flex items-center gap-3"
                      >
                         Launch Event Campaign <Zap size={18} />
                      </button>
                      <button className="text-[11px] font-black uppercase tracking-widest text-muted-custom hover:text-main transition-colors flex items-center gap-2">
                         Download Sector Audit <ChevronRight size={14} />
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
                    <span className="text-[10px] font-black uppercase tracking-widest">Ticketing Compliance Passed</span>
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
                  <h3 className="text-xs font-black uppercase tracking-widest text-primary-gold">Experience Support</h3>
                  <button onClick={() => setShowHelp(false)} className="text-muted-custom hover:text-main"><X size={20} /></button>
               </div>

               <div className="space-y-10">
                  <div>
                    <h4 className="text-lg font-black text-main tracking-tight mb-2">{HELP_CONTENT[stage].title}</h4>
                    <p className="text-[11px] font-medium text-muted-custom uppercase tracking-widest">Event Context</p>
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
                        <Info size={14} className="text-primary-gold" /> Event Insight
                     </p>
                     <p className="text-[12px] font-medium text-muted-custom leading-relaxed">
                        Campaigns featuring **RSVP Confirmation** triggers see a 42% higher ticket conversion rate on the day of the event.
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
