"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Info,
  ShieldCheck,
  Zap,
  ChevronRight,
  X,
  Target
} from "lucide-react";

// Modular Campaign Components
import BriefStage from "./components/BriefStage";
import TargetingStage from "./components/TargetingStage";
import ProtocolStage from "./components/ProtocolStage";
import BudgetStage from "./components/BudgetStage";

type Stage = "brief" | "targeting" | "protocol" | "budget" | "review";

const HELP_CONTENT: Record<Stage, { title: string; points: string[] }> = {
  brief: {
    title: "The Brief Narrative",
    points: [
      "Keep your goals focused on a single KPI (e.g. Sales or Awareness).",
      "Talking points should be concise; creators value creative freedom.",
      "A catchy title increases influencer application rates by 40%."
    ]
  },
  targeting: {
    title: "Precision Targeting",
    points: [
      "Genre matching ensures your product fits the creator's audience.",
      "Multi-tier targeting (Nano + Macro) provides both reach and trust.",
      "KPP verified creators have audited follower authenticity."
    ]
  },
  protocol: {
    title: "Deliverable Protocol",
    points: [
      "Video content typically generates 3x higher engagement than photos.",
      "Up-time persistence is strictly enforced by our AI Content Guard.",
      "Rule compliance is required for creator payout authorization."
    ]
  },
  budget: {
    title: "Budget & Payout",
    points: [
      "Total budget includes all creator fees and platform commissions.",
      "Per-deliverable fees can be negotiated once a creator applies.",
      "Escrow protection ensures funds are safe until deliverable audit."
    ]
  },
  review: {
    title: "Final Activation",
    points: [
      "Review all talking points and deliverable rules carefully.",
      "Once deployed, the brief becomes visible to all matched creators.",
      "Campaign edits are restricted once creators begin applying."
    ]
  }
};

export default function CreateCampaignWizard() {
  const router = useRouter();
  const [stage, setStep] = useState<Stage>("brief");
  const [showHelp, setShowHelp] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    goal: "",
    message: "",
    targetGenres: [] as string[],
    targetTier: "Micro (10k-100k)",
    minFollowers: 10000,
    deliverableType: "video",
    rules: ["Tag the Brand Profile", "Include Campaign #Hashtags"],
    uptimeDays: 7,
    budget: 0,
    perDeliverableFee: 0
  });

  const updateData = (newData: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const STAGES: Stage[] = ["brief", "targeting", "protocol", "budget", "review"];
  const currentStageIndex = STAGES.indexOf(stage);

  const handleNext = () => {
    if (currentStageIndex < STAGES.length - 1) {
      setStep(STAGES[currentStageIndex + 1]);
    }
  };

  const handleBack = () => {
    if (currentStageIndex > 0) {
      setStep(STAGES[currentStageIndex - 1]);
    } else {
      router.back();
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] font-inter text-main selection:bg-purple-500/30 flex flex-col">
      
      {/* Wizard Header */}
      <header className="h-24 border-b border-white/5 flex items-center justify-between px-10 bg-black/40 backdrop-blur-xl sticky top-0 z-[60]">
        <div className="flex items-center gap-5">
           <button 
             onClick={handleBack}
             className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-muted-custom hover:text-white hover:border-white/20 transition-all"
           >
              <ArrowLeft size={20} />
           </button>
           <div>
              <h1 className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-3">
                 <Sparkles size={16} className="text-purple-500" /> Campaign Architect
              </h1>
              <div className="flex items-center gap-2 mt-1">
                 <span className="text-[10px] font-black text-purple-500 uppercase">Stage {currentStageIndex + 1}: {stage}</span>
                 <span className="text-white/10">•</span>
                 <span className="text-[10px] font-bold text-muted-custom uppercase tracking-widest">Kihumba Influencers</span>
              </div>
           </div>
        </div>
        
        <div className="flex items-center gap-8">
           <div className="hidden md:flex gap-2">
              {STAGES.map((s, idx) => (
                 <div 
                   key={s} 
                   className={`h-1.5 w-12 rounded-full transition-all duration-500 ${
                     idx <= currentStageIndex ? 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.3)]' : 'bg-white/5'
                   }`} 
                 />
              ))}
           </div>
           <button 
             onClick={() => setShowHelp(!showHelp)}
             className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all ${
               showHelp ? 'bg-purple-500 text-white border-purple-500' : 'bg-white/5 border-white/10 text-muted-custom hover:text-white'
             }`}
           >
              Brief Guide
           </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Main Workspace */}
        <main className="flex-1 overflow-y-auto custom-scrollbar relative">
          <div className="max-w-4xl mx-auto px-6 py-20">
            <AnimatePresence mode="wait">
              
              {stage === "brief" && (
                <motion.div key="brief" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                   <BriefStage data={formData} updateData={updateData} />
                </motion.div>
              )}

              {stage === "targeting" && (
                <motion.div key="targeting" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                   <TargetingStage data={formData} updateData={updateData} />
                </motion.div>
              )}

              {stage === "protocol" && (
                <motion.div key="protocol" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                   <ProtocolStage data={formData} updateData={updateData} />
                </motion.div>
              )}

              {stage === "budget" && (
                <motion.div key="budget" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                   <BudgetStage data={formData} updateData={updateData} />
                </motion.div>
              )}

              {stage === "review" && (
                <motion.div key="review" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12 text-center py-10">
                   <div className="flex flex-col items-center gap-6">
                      <div className="size-24 rounded-full bg-purple-500/10 border-2 border-purple-500/20 flex items-center justify-center text-purple-500 shadow-[0_0_50px_rgba(168,85,247,0.1)]">
                         <CheckCircle2 size={48} />
                      </div>
                      <div>
                        <h2 className="text-4xl font-black tracking-tighter">Brief Ready.</h2>
                        <p className="text-sm font-medium text-muted-custom mt-3">Your campaign is ready for creator inbound and platform distribution.</p>
                      </div>
                   </div>

                   <div className="max-w-lg mx-auto bg-white/5 border border-white/5 rounded-3xl p-8 text-left space-y-5">
                      <ReviewItem label="Campaign" value={formData.name || "Untitled Brief"} />
                      <ReviewItem label="Influence Tier" value={formData.targetTier} />
                      <ReviewItem label="Deliverable" value={formData.deliverableType} />
                      <ReviewItem label="Uptime Rule" value={`${formData.uptimeDays} Days`} />
                      <ReviewItem label="Total Budget" value={`KES ${(formData.budget * 1.05).toLocaleString()}`} />
                   </div>

                   <div className="flex flex-col items-center gap-6">
                      <button 
                        onClick={() => router.push("/influencers")}
                        className="px-16 py-6 rounded-2xl bg-purple-500 text-white text-[13px] font-black uppercase tracking-[0.25em] hover:brightness-110 transition-all shadow-2xl shadow-purple-500/20 flex items-center gap-3"
                      >
                         Launch Campaign <Zap size={18} />
                      </button>
                      <button className="text-[11px] font-black uppercase tracking-widest text-muted-custom hover:text-white transition-colors">
                         Save as Draft Brief
                      </button>
                   </div>
                </motion.div>
              )}

            </AnimatePresence>

            {/* Navigation Bar */}
            {stage !== "review" && (
              <div className="mt-20 pt-10 border-t border-white/5 flex justify-between items-center">
                 <div className="flex items-center gap-3 text-emerald-500">
                    <ShieldCheck size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest">KPP Content Guard Active</span>
                 </div>
                 <button 
                    disabled={stage === "brief" && !formData.name}
                    onClick={handleNext}
                    className="flex items-center gap-3 px-12 py-5 rounded-2xl bg-purple-500 text-white text-[12px] font-black uppercase tracking-[0.15em] disabled:opacity-30 transition-all hover:brightness-110 shadow-lg shadow-purple-500/20"
                  >
                     {currentStageIndex === STAGES.length - 2 ? "Final Review" : "Next Stage"} <ArrowRight size={18} />
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
              className="w-96 border-l border-white/5 bg-black p-12 z-[70] flex flex-col shadow-2xl"
            >
               <div className="flex items-center justify-between mb-12">
                  <h3 className="text-xs font-black uppercase tracking-widest text-purple-500">Campaign Support</h3>
                  <button onClick={() => setShowHelp(false)} className="text-muted-custom hover:text-white"><X size={20} /></button>
               </div>

               <div className="space-y-12">
                  <div>
                    <h4 className="text-2xl font-black text-white tracking-tight mb-3">{HELP_CONTENT[stage].title}</h4>
                    <p className="text-[11px] font-bold text-muted-custom uppercase tracking-widest">Impact Protocol</p>
                  </div>

                  <div className="space-y-8">
                    {HELP_CONTENT[stage].points.map((point, idx) => (
                      <div key={idx} className="flex items-start gap-4">
                         <div className="size-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-[10px] font-black text-purple-500">{idx + 1}</div>
                         <p className="text-[13px] font-medium text-white/80 leading-relaxed">{point}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10">
                     <p className="text-[11px] font-black uppercase tracking-widest text-white mb-3 flex items-center gap-2">
                        <Info size={14} className="text-purple-500" /> Pro Tip
                     </p>
                     <p className="text-[12px] font-medium text-muted-custom leading-relaxed">
                        Campaigns with **video protocols** and **30-day persistence** rules see a 40% increase in brand recall among the Kihumba audience.
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
         <span className="text-xs font-black text-white uppercase">{value}</span>
      </div>
   );
}
