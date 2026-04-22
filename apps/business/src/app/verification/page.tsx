"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2,
  Clock,
  Info,
  ShieldAlert,
  ChevronRight,
  Loader2
} from "lucide-react";

// Modular Verification Stages
import ContactStage from "./components/ContactStage";
import ProfileStage from "./components/ProfileStage";
import LocationStage from "./components/LocationStage";
import VaultStage from "./components/VaultStage";
import SettlementStage from "./components/SettlementStage";

type VerificationStep = "contact" | "profile" | "location" | "documents" | "settlement" | "submitting" | "success";

const STEP_GUIDES = {
  contact: {
    title: "Communication Protocol",
    points: [
      "Phone number must be a valid Kenyan MSISDN for OTP delivery.",
      "Email will be used for high-security alerts and legal notices.",
      "Secondary contact is optional but recommended for recovery."
    ]
  },
  profile: {
    title: "Legal Identity",
    points: [
      "Legal Name must exactly match your Certificate of Incorporation.",
      "Industry Category determines your specific tax and commission bracket.",
      "Trade Name (DBA) is how your store appears to customers."
    ]
  },
  location: {
    title: "Physical Presence",
    points: [
      "Exact building and floor are required for logistics (Marketplace).",
      "Kao (Property) ads require verified neighborhood coordinates.",
      "Utility bills must be dated within the last 3 months."
    ]
  },
  documents: {
    title: "Regulatory Vault",
    points: [
      "Upload high-resolution scans of all legal documents.",
      "KRA PIN certificates must be in the current format with QR code.",
      "National IDs should show both front and back on a single scan."
    ]
  },
  settlement: {
    title: "Settlement Architecture",
    points: [
      "M-Pesa Till/Paybill numbers are verified via the Safaricom portal.",
      "Bank accounts must be under the registered business legal name.",
      "Payouts are processed every 24 hours for verified entities."
    ]
  }
};

export default function ModularVerificationCentre() {
  const router = useRouter();
  const [step, setStep] = useState<VerificationStep>("contact");
  
  // Centralized Form State
  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    legalName: "",
    tradeName: "",
    entityType: "Company",
    city: "Nairobi",
    street: "",
    building: "",
    kraPin: "",
    bankName: "Safaricom (M-Pesa)",
    accountNo: "",
    settlementType: "Bank"
  });

  const updateData = (newData: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const handleNext = () => {
    const steps: VerificationStep[] = ["contact", "profile", "location", "documents", "settlement", "submitting", "success"];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
       if (steps[currentIndex + 1] === "submitting") {
          simulateSubmission();
       } else {
          setStep(steps[currentIndex + 1]);
       }
    }
  };

  const handleBack = () => {
    const steps: VerificationStep[] = ["contact", "profile", "location", "documents", "settlement", "submitting", "success"];
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) setStep(steps[currentIndex - 1]);
  };

  const simulateSubmission = () => {
    setStep("submitting");
    setTimeout(() => {
       setStep("success");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#020202] font-inter text-main selection:bg-primary-gold/30 flex">
      
      {/* Main Wizard Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
         {/* Wizard Header */}
         <header className="h-24 border-b border-white/5 flex items-center justify-between px-10 bg-black/40 backdrop-blur-xl z-50">
            <div className="flex items-center gap-5">
               <div className="size-12 rounded-xl bg-primary-gold/10 border border-primary-gold/20 flex items-center justify-center text-primary-gold">
                  <ShieldCheck size={24} />
               </div>
               <div>
                  <h1 className="text-sm font-black uppercase tracking-[0.2em]">Kihumba Business Architect</h1>
                  <p className="text-[10px] font-bold text-muted-custom uppercase tracking-widest mt-0.5">Verification Integrity Protocol</p>
               </div>
            </div>
            <div className="flex items-center gap-10">
               <div className="hidden lg:flex items-center gap-3">
                  {["Contact", "Profile", "Location", "Vault", "Payouts"].map((s, idx) => (
                     <div key={s} className="flex items-center gap-3">
                        <div className={`size-6 rounded-full border flex items-center justify-center text-[10px] font-black ${
                           idx <= ["contact", "profile", "location", "documents", "settlement"].indexOf(step)
                             ? "bg-primary-gold border-primary-gold text-black"
                             : "border-white/10 text-muted-custom"
                        }`}>
                           {idx + 1}
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-widest ${
                           idx <= ["contact", "profile", "location", "documents", "settlement"].indexOf(step)
                             ? "text-main"
                             : "text-muted-custom"
                        }`}>{s}</span>
                        {idx < 4 && <div className="w-4 h-px bg-white/10" />}
                     </div>
                  ))}
               </div>
               <button onClick={() => router.back()} className="text-muted-custom hover:text-main transition-colors"><ShieldAlert size={20} /></button>
            </div>
         </header>

         <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="max-w-3xl mx-auto px-6 py-20">
               <AnimatePresence mode="wait">
                  
                  {step === "contact" && (
                    <motion.div key="contact" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                       <ContactStage data={formData} updateData={updateData} />
                       <NavigationButtons onNext={handleNext} nextLabel="Proceed to Profile" />
                    </motion.div>
                  )}

                  {step === "profile" && (
                    <motion.div key="profile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                       <ProfileStage data={formData} updateData={updateData} />
                       <NavigationButtons onBack={handleBack} onNext={handleNext} nextLabel="Define Location" />
                    </motion.div>
                  )}

                  {step === "location" && (
                    <motion.div key="location" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                       <LocationStage data={formData} updateData={updateData} />
                       <NavigationButtons onBack={handleBack} onNext={handleNext} nextLabel="Open Regulatory Vault" />
                    </motion.div>
                  )}

                  {step === "documents" && (
                    <motion.div key="documents" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                       <VaultStage data={formData} updateData={updateData} />
                       <NavigationButtons onBack={handleBack} onNext={handleNext} nextLabel="Settlement Setup" />
                    </motion.div>
                  )}

                  {step === "settlement" && (
                    <motion.div key="settlement" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                       <SettlementStage data={formData} updateData={updateData} />
                       <NavigationButtons onBack={handleBack} onNext={handleNext} nextLabel="Submit Architecture" isFinal />
                    </motion.div>
                  )}

                  {step === "submitting" && (
                     <motion.div key="submitting" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-20 space-y-8">
                        <div className="relative">
                           <div className="size-32 rounded-full border-4 border-white/5 border-t-primary-gold animate-spin" />
                           <ShieldCheck size={48} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary-gold" />
                        </div>
                        <div className="text-center">
                           <h2 className="text-3xl font-black tracking-tighter">Encrypting Architecture...</h2>
                           <p className="text-sm font-medium text-muted-custom mt-2">Uploading legal documents to the secure Kihumba Registry.</p>
                        </div>
                     </motion.div>
                  )}

                  {step === "success" && (
                     <motion.div key="success" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center py-20 space-y-10">
                        <div className="size-24 rounded-full bg-emerald-500/10 border-2 border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.1)]">
                           <CheckCircle2 size={48} />
                        </div>
                        <div className="max-w-md">
                           <h2 className="text-4xl font-black tracking-tighter text-white">Profile Submitted.</h2>
                           <p className="text-sm font-medium text-muted-custom mt-4 leading-relaxed">
                              Your business architecture has been queued for verification. The audit typically takes **24-48 working hours**. We will notify you via OTP and email once your Blue Badge is active.
                           </p>
                        </div>
                        <button onClick={() => router.push("/")} className="px-12 py-5 rounded-2xl bg-white text-black text-[12px] font-black uppercase tracking-[0.2em] hover:brightness-90 transition-all">
                           Return to Dashboard
                        </button>
                     </motion.div>
                  )}

               </AnimatePresence>
            </div>
         </div>
      </main>

      {/* Side Guide Bar */}
      {step !== "submitting" && step !== "success" && (
         <aside className="w-96 border-l border-white/5 bg-black p-12 hidden xl:flex flex-col">
            <div className="flex items-center gap-3 mb-12">
               <Info size={18} className="text-primary-gold" />
               <h3 className="text-xs font-black uppercase tracking-widest text-primary-gold">Onboarding Guide</h3>
            </div>

            <div className="space-y-12">
               <div>
                  <h4 className="text-xl font-black text-main tracking-tight mb-3">{STEP_GUIDES[step as keyof typeof STEP_GUIDES]?.title}</h4>
                  <p className="text-[11px] font-bold text-muted-custom uppercase tracking-widest">Protocol Analysis</p>
               </div>

               <div className="space-y-8">
                  {STEP_GUIDES[step as keyof typeof STEP_GUIDES]?.points.map((point, idx) => (
                     <div key={idx} className="flex gap-4">
                        <div className="size-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-primary-gold shrink-0">{idx + 1}</div>
                        <p className="text-[13px] font-medium text-muted-custom leading-relaxed">{point}</p>
                     </div>
                  ))}
               </div>

               <div className="pt-10 border-t border-white/5">
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                     <p className="text-[10px] font-black uppercase tracking-widest text-main mb-3">Security Note</p>
                     <p className="text-[12px] font-medium text-muted-custom leading-relaxed">
                        All documents are stored in an **AES-256 encrypted vault**. Only certified Kihumba Auditors have temporary access during the 48h review window.
                     </p>
                  </div>
               </div>
            </div>
         </aside>
      )}
    </div>
  );
}

function NavigationButtons({ onNext, onBack, nextLabel, isFinal }: { onNext: () => void, onBack?: () => void, nextLabel: string, isFinal?: boolean }) {
  return (
    <div className="pt-10 border-t border-white/5 flex justify-between items-center mt-12">
       {onBack ? (
          <button onClick={onBack} className="flex items-center gap-3 text-muted-custom hover:text-main uppercase text-[10px] font-black tracking-widest transition-colors">
             <ArrowLeft size={16} /> Back
          </button>
       ) : <div />}
       <button 
          onClick={onNext} 
          className={`px-10 py-5 rounded-2xl text-[12px] font-black uppercase tracking-widest flex items-center gap-3 transition-all ${
             isFinal 
               ? "bg-emerald-500 text-black shadow-2xl shadow-emerald-500/20 hover:brightness-110" 
               : "bg-primary-gold text-black shadow-2xl shadow-primary-gold/20 hover:brightness-110"
          }`}
       >
          {nextLabel} {isFinal ? <ChevronRight size={18} /> : <ArrowRight size={18} />}
       </button>
    </div>
  );
}
