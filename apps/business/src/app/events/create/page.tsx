"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Info,
  ShieldCheck,
  Zap,
  ChevronRight,
  X,
  Plus
} from "lucide-react";

// Modular Event Components
import IdentityStage from "./components/IdentityStage";
import LogisticsStage from "./components/LogisticsStage";
import TicketingStage from "./components/TicketingStage";
import ExperienceStage from "./components/ExperienceStage";

type Stage = "identity" | "logistics" | "ticketing" | "experience" | "review";

const HELP_CONTENT: Record<Stage, { title: string; points: string[] }> = {
  identity: {
    title: "Experience Identity",
    points: [
      "Choose a catchy name that reflects the event's core value.",
      "Vibe tags help our AI match your event with the right audience.",
      "Flash Deals create immediate booking urgency for early discovery."
    ]
  },
  logistics: {
    title: "Logistical Pulse",
    points: [
      "Ensure the venue pin is exact; this affects local 'Kao' targeting.",
      "Gate open times help manage attendee expectations.",
      "Verified locations gain higher ranking in the 'Nearby' discovery feed."
    ]
  },
  ticketing: {
    title: "Revenue Architecture",
    points: [
      "Tiered pricing (Regular, VIP) increases overall yield per attendee.",
      "Perks should be clearly defined to avoid gate disputes.",
      "Total capacity is hard-capped to prevent over-selling."
    ]
  },
  experience: {
    title: "Experience Narrative",
    points: [
      "The 'About' section is your primary conversion tool. Use bold copy.",
      "A clear schedule increases attendee confidence and early bookings.",
      "Artist lineups should include high-quality profile photos."
    ]
  },
  review: {
    title: "Final Verification",
    points: [
      "Review your ticket fees and payout channels before publishing.",
      "Published events are instantly discoverable on the Kihumba App.",
      "Edits to ticket pricing are restricted once sales begin."
    ]
  }
};

export default function CreateEventWizard() {
  const router = useRouter();
  const [stage, setStep] = useState<Stage>("identity");
  const [showHelp, setShowHelp] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "Concert",
    vibeTags: "",
    dealCode: "",
    dealDescription: "",
    date: "",
    time: "",
    venue: "",
    tickets: [
      { tier: 'Regular', price: 0, perks: 'General Access', capacity: 100 }
    ],
    schedule: [
       { time: '06:00 PM', title: 'Doors Open' }
    ],
    about: ""
  });

  const updateData = (newData: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const STAGES: Stage[] = ["identity", "logistics", "ticketing", "experience", "review"];
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
    <div className="min-h-screen bg-[#020202] font-inter text-main selection:bg-primary-gold/30 flex flex-col">
      
      {/* Wizard Header */}
      <header className="h-24 border-b border-white/5 flex items-center justify-between px-10 bg-black/40 backdrop-blur-xl sticky top-0 z-[60]">
        <div className="flex items-center gap-5">
           <button 
             onClick={handleBack}
             className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-muted-custom hover:text-main hover:border-white/20 transition-all"
           >
              <ArrowLeft size={20} />
           </button>
           <div>
              <h1 className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-3">
                 <Calendar size={16} className="text-primary-gold" /> Experience Architect
              </h1>
              <div className="flex items-center gap-2 mt-1">
                 <span className="text-[10px] font-black text-primary-gold uppercase">Stage {currentStageIndex + 1}: {stage}</span>
                 <span className="text-white/10">•</span>
                 <span className="text-[10px] font-bold text-muted-custom uppercase tracking-widest">Kihumba Events</span>
              </div>
           </div>
        </div>
        
        <div className="flex items-center gap-8">
           <div className="hidden md:flex gap-2">
              {STAGES.map((s, idx) => (
                 <div 
                   key={s} 
                   className={`h-1.5 w-12 rounded-full transition-all duration-500 ${
                     idx <= currentStageIndex ? 'bg-primary-gold' : 'bg-white/5'
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
              Guide
           </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Main Workspace */}
        <main className="flex-1 overflow-y-auto custom-scrollbar relative">
          <div className="max-w-4xl mx-auto px-6 py-20">
            <AnimatePresence mode="wait">
              
              {stage === "identity" && (
                <motion.div key="identity" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                   <IdentityStage data={formData} updateData={updateData} />
                </motion.div>
              )}

              {stage === "logistics" && (
                <motion.div key="logistics" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                   <LogisticsStage data={formData} updateData={updateData} />
                </motion.div>
              )}

              {stage === "ticketing" && (
                <motion.div key="ticketing" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                   <TicketingStage data={formData} updateData={updateData} />
                </motion.div>
              )}

              {stage === "experience" && (
                <motion.div key="experience" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                   <ExperienceStage data={formData} updateData={updateData} />
                </motion.div>
              )}

              {stage === "review" && (
                <motion.div key="review" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12 text-center py-10">
                   <div className="flex flex-col items-center gap-6">
                      <div className="size-24 rounded-full bg-emerald-500/10 border-2 border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.1)]">
                         <CheckCircle2 size={48} />
                      </div>
                      <div>
                        <h2 className="text-4xl font-black tracking-tighter">Architecture Ready.</h2>
                        <p className="text-sm font-medium text-muted-custom mt-3">Your experience is ready for platform deployment and ticketing activation.</p>
                      </div>
                   </div>

                   <div className="max-w-lg mx-auto bg-white/5 border border-white/5 rounded-3xl p-8 text-left space-y-5">
                      <ReviewItem label="Event Name" value={formData.name || "Untitled Experience"} />
                      <ReviewItem label="Genre" value={formData.category} />
                      <ReviewItem label="Venue" value={formData.venue || "TBD"} />
                      <ReviewItem label="Total Capacity" value={formData.tickets.reduce((a, b) => a + b.capacity, 0).toLocaleString()} />
                      <ReviewItem label="Revenue Potential" value={`KES ${formData.tickets.reduce((a, b) => a + (b.price * b.capacity), 0).toLocaleString()}`} />
                   </div>

                   <div className="flex flex-col items-center gap-6">
                      <button 
                        onClick={() => router.push("/events")}
                        className="px-16 py-6 rounded-2xl bg-primary-gold text-black text-[13px] font-black uppercase tracking-[0.25em] hover:brightness-110 transition-all shadow-2xl shadow-primary-gold/20 flex items-center gap-3"
                      >
                         Launch Experience <Zap size={18} />
                      </button>
                      <button className="text-[11px] font-black uppercase tracking-widest text-muted-custom hover:text-main transition-colors">
                         Save as Draft
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
                    <span className="text-[10px] font-black uppercase tracking-widest">Audited & Encrypted</span>
                 </div>
                 <button 
                    disabled={stage === "identity" && !formData.name}
                    onClick={handleNext}
                    className="flex items-center gap-3 px-12 py-5 rounded-2xl bg-primary-gold text-black text-[12px] font-black uppercase tracking-[0.15em] disabled:opacity-30 transition-all hover:brightness-110 shadow-lg shadow-primary-gold/20"
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
                  <h3 className="text-xs font-black uppercase tracking-widest text-primary-gold">Experience Support</h3>
                  <button onClick={() => setShowHelp(false)} className="text-muted-custom hover:text-main"><X size={20} /></button>
               </div>

               <div className="space-y-12">
                  <div>
                    <h4 className="text-2xl font-black text-main tracking-tight mb-3">{HELP_CONTENT[stage].title}</h4>
                    <p className="text-[11px] font-bold text-muted-custom uppercase tracking-widest">Strategy Protocol</p>
                  </div>

                  <div className="space-y-8">
                    {HELP_CONTENT[stage].points.map((point, idx) => (
                      <div key={idx} className="flex items-start gap-4">
                         <div className="size-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-[10px] font-black text-primary-gold">{idx + 1}</div>
                         <p className="text-[13px] font-medium text-main/80 leading-relaxed">{point}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10">
                     <p className="text-[11px] font-black uppercase tracking-widest text-main mb-3 flex items-center gap-2">
                        <Info size={14} className="text-primary-gold" /> Pro Tip
                     </p>
                     <p className="text-[12px] font-medium text-muted-custom leading-relaxed">
                        Events with **vibe tags** such as "high-energy" or "boutique" see 30% more clicks from the Kihumba discovery engine.
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
         <span className="text-xs font-black text-main uppercase">{value}</span>
      </div>
   );
}
