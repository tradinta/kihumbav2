"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  Camera, 
  MapPin, 
  Sparkles, 
  Briefcase, 
  Camera as CameraIcon,
  Laptop,
  Palette,
  Mic,
  Music,
  HeartPulse,
  ChevronRight
} from "lucide-react";

export default function WelcomeOnboarding() {
  const [step, setStep] = useState(1);
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
  const [avatar, setAvatar] = useState<string | null>(null);

  const niches = [
    { id: "tech", label: "Technology", icon: Laptop },
    { id: "business", label: "Business", icon: Briefcase },
    { id: "art", label: "Art & Design", icon: Palette },
    { id: "music", label: "Music", icon: Music },
    { id: "health", label: "Health & Fitness", icon: HeartPulse },
    { id: "podcast", label: "Podcasting", icon: Mic },
    { id: "photography", label: "Photography", icon: CameraIcon },
    { id: "lifestyle", label: "Lifestyle", icon: Sparkles },
  ];

  const handleNicheToggle = (id: string) => {
    if (selectedNiches.includes(id)) {
      setSelectedNiches(selectedNiches.filter(n => n !== id));
    } else {
      if (selectedNiches.length < 3) setSelectedNiches([...selectedNiches, id]);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-color)] flex items-center justify-center p-4">
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[40%] bg-primary-gold/10 blur-[100px] rounded-full" />
      </div>

      <div className="w-full max-w-xl relative z-10">
         {/* Progress Bar */}
         <div className="flex gap-2 mb-8 px-4">
           {[1, 2, 3].map((s) => (
             <div key={s} className="h-1 flex-1 rounded-full bg-[var(--pill-bg)] overflow-hidden">
                <motion.div 
                  className={`h-full ${s <= step ? 'bg-main' : 'bg-transparent'}`}
                  initial={{ width: 0 }}
                  animate={{ width: s <= step ? '100%' : '0%' }}
                  transition={{ duration: 0.5 }}
                />
             </div>
           ))}
         </div>

         <div className="card-surface p-8 sm:p-12 border border-custom rounded-[2rem] shadow-2xl overflow-hidden relative min-h-[450px] flex flex-col">
            <AnimatePresence mode="wait">
              
              {/* STEP 1: Avatar Setup */}
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col items-center text-center flex-1"
                >
                   <div className="size-16 rounded-2xl bg-[var(--pill-bg)] border border-custom mb-6 flex items-center justify-center p-1">
                     <Camera size={24} className="text-main" />
                   </div>
                   <h1 className="text-3xl font-black tracking-tight text-main mb-2">Add a profile photo</h1>
                   <p className="text-[12px] font-bold text-muted-custom mb-10 max-w-md">
                     Let everyone on Kihumba know who you are. A clear photo builds trust.
                   </p>

                   <div className="relative group cursor-pointer mb-10">
                     <div className="size-32 rounded-full border-2 border-dashed border-custom-hover flex items-center justify-center group-hover:bg-white/5 transition-colors overflow-hidden">
                       <Camera size={32} className="text-muted-custom group-hover:scale-110 transition-transform" />
                     </div>
                     <div className="absolute -bottom-2 -right-2 bg-main text-[var(--bg-color)] size-10 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                       <Plus size={20} />
                     </div>
                   </div>

                   <div className="mt-auto w-full flex gap-4">
                     <button onClick={() => setStep(2)} className="w-1/3 py-4 text-[11px] font-bold uppercase tracking-widest text-muted-custom hover:text-main transition-colors">Skip</button>
                     <button onClick={() => setStep(2)} className="flex-1 bg-main text-[var(--bg-color)] rounded-xl py-4 text-[11px] font-black uppercase tracking-widest hover:scale-[1.02] transition-transform">
                       Continue
                     </button>
                   </div>
                </motion.div>
              )}

              {/* STEP 2: Niche Selection */}
              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col text-center flex-1"
                >
                   <div className="flex justify-center mb-6">
                     <div className="size-16 rounded-2xl bg-[var(--pill-bg)] border border-custom flex items-center justify-center">
                       <Sparkles size={24} className="text-primary-gold" />
                     </div>
                   </div>
                   <h1 className="text-3xl font-black tracking-tight text-main mb-2">What are your interests?</h1>
                   <p className="text-[12px] font-bold text-muted-custom mb-8 max-w-md mx-auto">
                     Select up to 3 niches to tailor your feed and help relevant campaigns discover you.
                   </p>

                   <div className="grid grid-cols-2 gap-3 mb-10 text-left">
                     {niches.map((niche) => {
                       const isSelected = selectedNiches.includes(niche.id);
                       return (
                         <button 
                           key={niche.id}
                           onClick={() => handleNicheToggle(niche.id)}
                           className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${
                             isSelected ? 'bg-primary-gold/10 border-primary-gold text-primary-gold shadow-lg shadow-primary-gold/10' : 'bg-[var(--pill-bg)] border-custom hover:border-custom-hover text-muted-custom hover:text-main'
                           }`}
                         >
                           <niche.icon size={18} />
                           <span className="text-[11px] font-bold uppercase tracking-widest">{niche.label}</span>
                         </button>
                       );
                     })}
                   </div>

                   <div className="mt-auto w-full flex gap-4">
                     <button onClick={() => setStep(1)} className="w-1/3 py-4 text-[11px] font-bold uppercase tracking-widest text-muted-custom border border-custom rounded-xl hover:text-main transition-colors">Back</button>
                     <button 
                       onClick={() => setStep(3)} 
                       disabled={selectedNiches.length === 0}
                       className="flex-1 bg-main text-[var(--bg-color)] rounded-xl py-4 text-[11px] font-black uppercase tracking-widest hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:scale-100"
                     >
                       Continue
                     </button>
                   </div>
                </motion.div>
              )}

              {/* STEP 3: Location */}
              {step === 3 && (
                <motion.div 
                   key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col items-center text-center flex-1"
                >
                   <div className="size-16 rounded-2xl bg-[var(--pill-bg)] border border-custom mb-6 flex items-center justify-center p-1">
                     <MapPin size={24} className="text-blue-500" />
                   </div>
                   <h1 className="text-3xl font-black tracking-tight text-main mb-2">Where are you based?</h1>
                   <p className="text-[12px] font-bold text-muted-custom mb-10 max-w-md">
                     Adding your location unlocks local real estate listings and geo-targeted ad revenue.
                   </p>

                   <div className="w-full relative group mb-10">
                     <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-custom group-focus-within:text-blue-500 transition-colors">
                       <MapPin size={16} />
                     </div>
                     <input 
                       type="text" 
                       className="w-full bg-[var(--pill-bg)] border border-custom rounded-xl py-4 pl-12 pr-4 text-[13px] font-bold text-main focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-left"
                       placeholder="e.g. Nairobi, Kenya"
                       defaultValue="Nairobi, Kenya"
                     />
                   </div>

                   <div className="mt-auto w-full flex gap-4">
                     <button onClick={() => setStep(2)} className="w-1/3 py-4 text-[11px] font-bold uppercase tracking-widest text-muted-custom border border-custom rounded-xl hover:text-main transition-colors">Back</button>
                     <Link href="/" className="flex-1 bg-blue-500 text-white rounded-xl py-4 text-[11px] font-black uppercase tracking-widest hover:brightness-110 flex items-center justify-center gap-2 group shadow-lg shadow-blue-500/20">
                       Enter Kihumba <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                     </Link>
                   </div>
                </motion.div>
              )}

            </AnimatePresence>
         </div>
      </div>
    </div>
  );
}

// Icon hack to avoid repeating imports and errors just for a quick Plus icon check
const Plus = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);
