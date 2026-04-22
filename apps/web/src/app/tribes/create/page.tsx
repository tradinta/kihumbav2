"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Plus, Shield, Globe, Lock, Info, 
  ChevronRight, ChevronLeft, Check,
  Camera, LayoutGrid, Rocket,
  Search, MapPin, Upload,
  Image as ImageIcon, HelpCircle, X,
  Users, GraduationCap, Briefcase, Gamepad2, 
  Clapperboard, BadgeCheck, Eye, ShieldAlert,
  ArrowRight, FileText, Gavel, Scale, AlertTriangle,
  ExternalLink, Sparkles, Fingerprint
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LeftSidebar from "@/components/LeftSidebar";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import AdSidebar from "@/components/AdSidebar";
import Link from "next/link";
import { api } from "@/lib/api";
import { uploadToR2 } from "@/lib/upload";

const TRIBE_TYPES = [
  { id: 'COMMUNITY', label: 'Community', sub: 'Estates, Security, Charity' },
  { id: 'EDUCATION', label: 'Education', sub: 'Unions, Scholarships, Resources' },
  { id: 'PROFESSIONAL', label: 'Professional', sub: 'Freelance, Networking, Coaching' },
  { id: 'GAMING', label: 'Gaming', sub: 'eSports, PC/Console, Mobile' },
  { id: 'ENTERTAINMENT', label: 'Entertainment', sub: 'Satire, Fan Clubs, Events' },
  { id: 'BRAND', label: 'Brand', sub: 'Support, Launches, Ambassadors' },
  { id: 'OTHER', label: 'Other', sub: 'Hobbies, Niche, Misc' },
];

const DEFAULT_RULES = [
  "Maintain mutual respect and professional conduct.",
  "No spam, excessive self-promotion, or irrelevant ads.",
  "Content must be relevant to the community's niche.",
  "Adhere to all Kihumba community standards and local laws."
];

const STEPS = [
  { id: 1, label: 'Disclaimer' },
  { id: 2, label: 'Identity' },
  { id: 3, label: 'Governance' },
  { id: 4, label: 'Review' }
];

export default function CreateTribePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAcceptedMandate, setHasAcceptedMandate] = useState(false);
  const [hasAcceptedDisclaimer, setHasAcceptedDisclaimer] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    description: "",
    type: "COMMUNITY",
    privacy: "PUBLIC",
    questions: [] as string[],
    rules: DEFAULT_RULES,
    profileImage: null as string | null,
    coverImage: null as string | null,
  });

  const [newQuestion, setNewQuestion] = useState("");
  const [newRule, setNewRule] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isUsernameTaken, setIsUsernameTaken] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (formData.username.length >= 10) {
        setIsCheckingUsername(true);
        try {
          const { exists } = await api.get(`/tribes/exists/${formData.username}`);
          setIsUsernameTaken(exists);
        } catch (err) {
          console.error("Check failed:", err);
        } finally {
          setIsCheckingUsername(false);
        }
      } else {
        setIsUsernameTaken(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.username]);

  const currentHubType = TRIBE_TYPES.find(t => t.id === formData.type);

  const updateUsername = (val: string) => {
    const sanitized = val.toLowerCase().replace(/[^a-z-]/g, '');
    setFormData(prev => ({ ...prev, username: sanitized }));
  };

  const addQuestion = () => {
    if (newQuestion.trim()) {
      setFormData(prev => ({ ...prev, questions: [...prev.questions, newQuestion.trim()] }));
      setNewQuestion("");
    }
  };

  const addRule = () => {
    if (newRule.trim()) {
      setFormData(prev => ({ ...prev, rules: [...prev.rules, newRule.trim()] }));
      setNewRule("");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'profileImage' | 'coverImage') => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const publicUrl = await uploadToR2(file, type === 'profileImage' ? 'avatars' : 'covers');
        setFormData(prev => ({ ...prev, [type]: publicUrl }));
      } catch (err) {
        console.error("Upload failed:", err);
        setError("Image upload failed. Please try a different photo.");
      }
    }
  };



  const [isSuccess, setIsSuccess] = useState(false);
  const [createdTribe, setCreatedTribe] = useState<any>(null);

  const handleCreate = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await api.post('/tribes', {
        name: formData.name,
        slug: formData.username,
        bio: formData.description,
        category: formData.type.toUpperCase().replace(' ', '_'),
        privacy: formData.privacy.toUpperCase(),
        questions: formData.questions,
        rules: formData.rules,
        logo: formData.profileImage,
        cover: formData.coverImage
      });
      
      setCreatedTribe(res);
      setIsSuccess(true);
      
      // Delay redirect to show success
      setTimeout(() => {
        router.push(`/tribes/${res.slug}`);
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Failed to ignite tribe. Try a different handle.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row min-h-screen lg:px-6 gap-4">
      <LeftSidebar />

      <main className="flex-1 w-full max-w-6xl mx-auto lg:mx-0 pt-0 lg:pt-4 pb-32 lg:pb-12">
        <TopBar />

        {/* --- Success Modal --- */}
        <AnimatePresence>
          {isSuccess && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md"
            >
               <motion.div 
                 initial={{ scale: 0.9, y: 20 }} 
                 animate={{ scale: 1, y: 0 }}
                 className="w-full max-w-xl card-surface border border-custom rounded-sm p-0 text-center relative overflow-hidden"
               >
                  {/* Visual Identity Header */}
                  <div className="h-48 relative bg-white/5">
                     {formData.coverImage ? (
                        <img src={formData.coverImage} className="w-full h-full object-cover opacity-60" alt="" />
                     ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/5 uppercase font-black text-4xl tracking-tighter">Kihumba</div>
                     )}
                     <div className="absolute inset-0 bg-gradient-to-t from-bg-color to-transparent" />
                     <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 size-24 rounded-sm border-4 border-bg-color bg-card-surface shadow-2xl overflow-hidden">
                        {formData.profileImage ? (
                           <img src={formData.profileImage} className="w-full h-full object-cover" alt="" />
                        ) : (
                           <div className="w-full h-full flex items-center justify-center bg-primary-gold/10 text-primary-gold"><Users size={32} /></div>
                        )}
                     </div>
                  </div>

                  <div className="p-12 pt-16">
                     <h2 className="text-3xl font-black tracking-tight text-main uppercase mb-2">Tribe Created!</h2>
                     <p className="text-[11px] font-bold text-muted-custom uppercase tracking-[0.2em] mb-10">The <span className="text-primary-gold">{formData.name}</span> tribe is now live.</p>

                     <div className="space-y-6 text-left mb-10">
                        <div className="space-y-1">
                           <span className="text-[8px] font-bold uppercase tracking-widest text-primary-gold">Description</span>
                           <p className="text-[11px] font-medium text-main leading-relaxed line-clamp-2">{formData.description || "Building a new legacy on Kihumba."}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-1">
                              <span className="text-[8px] font-bold uppercase tracking-widest text-primary-gold">Classification</span>
                              <p className="text-[10px] font-bold text-main uppercase">{currentHubType?.label || formData.type}</p>
                           </div>
                           <div className="space-y-1">
                              <span className="text-[8px] font-bold uppercase tracking-widest text-primary-gold">Handle</span>
                              <p className="text-[10px] font-bold text-main uppercase">@{createdTribe?.slug || formData.username}</p>
                           </div>
                        </div>
                     </div>

                     <button 
                       onClick={() => router.push(`/tribes/${createdTribe?.slug || formData.username}`)}
                       className="w-full h-16 bg-primary-gold text-black rounded-sm font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:brightness-110 active:scale-[0.98] transition-all shadow-2xl shadow-primary-gold/20"
                     >
                        Proceed to {formData.name} <ChevronRight size={18} strokeWidth={4} />
                     </button>
                  </div>
               </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6 px-4 mt-6">
          
          <div className="space-y-4">
             <div className="card-surface rounded-sm border border-custom relative overflow-hidden">
                
                {/* Elegant Progress Track */}
                <div className="h-1 w-full bg-white/5 relative">
                   <motion.div 
                     initial={{ width: '25%' }}
                     animate={{ width: `${(step / 4) * 100}%` }}
                     className="absolute inset-0 bg-primary-gold shadow-[0_0_10px_rgba(255,184,0,0.5)] transition-all duration-500"
                   />
                </div>

                <div className="p-8">
                   <div className="flex items-center justify-between mb-10">
                      <div className="flex items-center gap-8">
                         {STEPS.map((s) => (
                           <div key={s.id} className="flex items-center gap-2">
                              <span className={`text-[10px] font-bold transition-colors ${step === s.id ? 'text-primary-gold' : step > s.id ? 'text-emerald-500' : 'text-muted-custom'}`}>
                                 {step > s.id ? <Check size={12} strokeWidth={4} /> : `0${s.id}`}
                              </span>
                              <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${step === s.id ? 'text-main' : 'text-muted-custom'}`}>
                                 {s.label}
                              </span>
                           </div>
                         ))}
                      </div>
                      <span className="text-[10px] font-bold text-muted-custom uppercase tracking-widest">
                         Step <span className="text-primary-gold">{step}</span> of 4
                      </span>
                   </div>

                   <AnimatePresence mode="wait">
                     {step === 1 && (
                       <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                          <div className="p-8 rounded-sm bg-red-500/5 border border-red-500/20 space-y-6">
                             <div className="flex items-center gap-3 text-red-500">
                                <AlertTriangle size={24} />
                                <h2 className="text-xl font-bold tracking-tight uppercase">Tribe Definition & Responsibility</h2>
                             </div>
                             
                             <div className="space-y-4 text-muted-custom">
                                <p className="text-xs font-medium leading-relaxed">
                                   On Kihumba, a <span className="text-main font-bold">"Tribe"</span> follows the literal definition: 
                                   <i className="text-primary-gold block mt-2 ml-4">"A group of persons with a common character, occupation, or interest."</i>
                                </p>
                                <p className="text-[11px] font-medium leading-relaxed">
                                   We are a platform for <span className="text-main">communities of passion, profession, and shared purpose.</span> 
                                   Kihumba strictly prohibits the creation of groups based on ethnic tribalism or sectarian division. 
                                   Tribalism remains a significant challenge in Kenya and East Africa, and our mission is to unite people through shared interests, not divide them by ancestry.
                                </p>
                             </div>
                          </div>

                          <label className="flex items-center gap-3 cursor-pointer group pt-4">
                             <div 
                                onClick={() => setHasAcceptedDisclaimer(!hasAcceptedDisclaimer)}
                                className={`size-6 rounded-sm border-2 flex items-center justify-center transition-all ${hasAcceptedDisclaimer ? 'bg-primary-gold border-primary-gold shadow-lg shadow-primary-gold/20' : 'border-custom bg-black/20 group-hover:border-primary-gold/50'}`}
                             >
                                {hasAcceptedDisclaimer && <Check size={16} className="text-black" strokeWidth={4} />}
                             </div>
                             <span className="text-[11px] font-bold uppercase tracking-widest text-main group-hover:text-primary-gold transition-colors">
                                I understand and will not use this tool to encourage tribalism
                             </span>
                          </label>

                          <div className="pt-8 border-t border-custom">
                             <button 
                                disabled={!hasAcceptedDisclaimer}
                                onClick={() => setStep(2)}
                                className="h-11 px-8 bg-primary-gold text-black rounded-sm font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-30 shadow-xl shadow-primary-gold/10"
                             >
                                Proceed to Identity <ChevronRight size={16} strokeWidth={3} />
                             </button>
                          </div>
                       </motion.div>
                     )}

                     {step === 2 && (
                       <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                          <div>
                             <h2 className="text-xl font-bold tracking-tight mb-1 text-main">Community Identity</h2>
                             <p className="text-[11px] text-muted-custom font-medium leading-relaxed max-w-sm">Define the core profile and handle for your new hub.</p>
                          </div>

                          <div className="space-y-6 max-w-lg">
                             <div className="space-y-2">
                                <label className="text-[9px] font-bold uppercase tracking-widest text-primary-gold">Tribe Name</label>
                                <input 
                                  type="text" 
                                  placeholder="e.g. University Tech Hub" 
                                  className="w-full bg-pill-surface border border-custom rounded-sm p-3.5 text-sm font-bold focus:border-primary-gold/40 focus:outline-none transition-all placeholder:text-white/5"
                                  value={formData.name}
                                  onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                                />
                             </div>

                             <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                   <label className="text-[9px] font-bold uppercase tracking-widest text-primary-gold">Unique Handle</label>
                                   <span className={`text-[8px] font-bold uppercase ${formData.username.length >= 10 ? 'text-emerald-500' : 'text-red-500'}`}>
                                      {formData.username.length}/10 Min
                                   </span>
                                </div>
                                <div className="relative group">
                                   <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-custom font-bold text-xs">@</span>
                                   <input 
                                     type="text" 
                                     placeholder="uni-tech-hub-hq" 
                                     className="w-full bg-pill-surface border border-custom rounded-sm p-3.5 pl-8 text-sm font-bold focus:border-primary-gold/40 focus:outline-none transition-all placeholder:text-white/5"
                                     value={formData.username}
                                     onChange={(e) => updateUsername(e.target.value)}
                                   />
                                </div>
                             </div>

                             <div className="space-y-2">
                                <label className="text-[9px] font-bold uppercase tracking-widest text-primary-gold">Mission Statement</label>
                                <textarea 
                                  placeholder="What defines this community?" 
                                  className="w-full h-24 bg-pill-surface border border-custom rounded-sm p-3.5 text-[11px] font-medium focus:border-primary-gold/40 focus:outline-none transition-all resize-none leading-relaxed placeholder:text-white/5"
                                  value={formData.description}
                                  onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                                />
                             </div>
                          </div>

                          <div className="pt-8 border-t border-custom flex gap-3">
                             <button onClick={() => setStep(1)} className="h-10 px-8 rounded-sm border border-custom text-muted-custom font-bold text-[9px] uppercase tracking-widest">Back</button>
                             <button 
                               disabled={!formData.name || formData.username.length < 10 || isUsernameTaken || isCheckingUsername}
                               onClick={() => setStep(3)}
                               className="flex-1 h-10 bg-primary-gold text-black rounded-sm font-bold text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-30"
                             >
                                Governance & Rules <ChevronRight size={14} strokeWidth={3} />
                             </button>
                          </div>
                       </motion.div>
                     )}

                     {step === 3 && (
                       <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                          <div>
                             <h2 className="text-xl font-bold tracking-tight mb-1 text-main">Governance & Rules</h2>
                             <p className="text-[11px] text-muted-custom font-medium leading-relaxed">Establish community standards and membership protocols.</p>
                          </div>

                          <div className="space-y-8">
                             {/* Category */}
                             <div>
                                <label className="text-[9px] font-bold uppercase tracking-widest text-primary-gold mb-6 block">Classification</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto no-scrollbar pr-2">
                                   {TRIBE_TYPES.map(type => (
                                     <button 
                                       key={type.id}
                                       onClick={() => setFormData(p => ({ ...p, type: type.id }))}
                                       className={`p-4 rounded-sm border text-left transition-all relative group ${formData.type === type.id ? 'bg-primary-gold/10 border-primary-gold shadow-[0_0_20px_rgba(255,184,0,0.05)]' : 'bg-pill-surface border-custom hover:border-primary-gold/30'}`}
                                     >
                                        <div className="flex flex-col gap-1">
                                           <h4 className={`text-[10px] font-bold uppercase tracking-widest ${formData.type === type.id ? 'text-primary-gold' : 'text-main'}`}>{type.label}</h4>
                                           <p className="text-[8px] font-bold text-muted-custom uppercase leading-tight">{type.sub}</p>
                                        </div>
                                        {formData.type === type.id && <div className="absolute top-4 right-4 text-primary-gold"><Check size={16} strokeWidth={3} /></div>}
                                     </button>
                                   ))}
                                </div>
                             </div>

                             {/* Community Rules */}
                             <div>
                                <label className="text-[9px] font-bold uppercase tracking-widest text-primary-gold mb-4 block flex items-center gap-2">
                                   <Gavel size={14} /> Community Rules (Editable Template)
                                </label>
                                <div className="space-y-2 mb-4">
                                   {formData.rules.map((rule, i) => (
                                     <div key={i} className="flex items-center gap-3 p-3 rounded-sm bg-white/5 border border-custom group">
                                        <span className="text-[10px] font-bold text-muted-custom">0{i + 1}</span>
                                        <input 
                                          className="flex-1 bg-transparent border-none focus:ring-0 text-[11px] font-medium text-main p-0"
                                          value={rule}
                                          onChange={(e) => {
                                             const newRules = [...formData.rules];
                                             newRules[i] = e.target.value;
                                             setFormData(p => ({ ...p, rules: newRules }));
                                          }}
                                        />
                                        <button onClick={() => setFormData(p => ({ ...p, rules: p.rules.filter((_, idx) => idx !== i) }))} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                           <X size={14} />
                                        </button>
                                     </div>
                                   ))}
                                </div>
                                <div className="flex gap-2">
                                   <input 
                                     type="text" value={newRule} onChange={(e) => setNewRule(e.target.value)}
                                     placeholder="Add a custom rule..."
                                     className="flex-1 bg-white/5 border border-custom rounded-sm px-4 py-2.5 text-[10px] font-bold focus:outline-none focus:border-primary-gold/40"
                                   />
                                   <button onClick={addRule} className="px-5 rounded-sm bg-primary-gold text-black text-[9px] font-bold uppercase tracking-widest">Add</button>
                                </div>
                             </div>

                             {/* Privacy */}
                             <div>
                                <label className="text-[9px] font-bold uppercase tracking-widest text-primary-gold mb-4 block">Privacy Policy</label>
                                <div className="flex gap-3">
                                   {[
                                     { id: 'PUBLIC', label: 'Public Access', desc: 'Open feed for everyone.', icon: <Eye size={16} /> },
                                     { id: 'PRIVATE', label: 'Private Gated', desc: 'Requires membership approval.', icon: <ShieldAlert size={16} /> },
                                   ].map(p => (
                                     <button 
                                       key={p.id}
                                       onClick={() => setFormData(prev => ({ ...prev, privacy: p.id as any }))}
                                       className={`flex-1 p-4 rounded-sm border text-left transition-all flex items-center gap-4 ${
                                         formData.privacy === p.id ? 'border-primary-gold bg-primary-gold/10' : 'border-custom bg-pill-surface hover:border-white/5'
                                       }`}
                                     >
                                        <div className={`size-10 rounded-sm flex items-center justify-center ${formData.privacy === p.id ? 'bg-primary-gold text-black' : 'bg-white/5 text-muted-custom'}`}>
                                           {p.icon}
                                        </div>
                                        <div>
                                           <h4 className="text-[9px] font-bold uppercase tracking-widest mb-1">{p.label}</h4>
                                           <p className="text-[8px] text-muted-custom font-medium leading-tight">{p.desc}</p>
                                        </div>
                                     </button>
                                   ))}
                                </div>
                             </div>
                          </div>

                          <div className="pt-8 border-t border-custom flex gap-3">
                             <button onClick={() => setStep(2)} className="h-10 px-8 rounded-sm border border-custom text-muted-custom font-bold text-[9px] uppercase tracking-widest">Back</button>
                             <button 
                               onClick={() => setStep(4)}
                               className="flex-1 h-10 bg-primary-gold text-black rounded-sm font-bold text-[9px] uppercase tracking-widest flex items-center justify-center gap-2"
                             >
                                Review & Launch <ChevronRight size={14} strokeWidth={3} />
                             </button>
                          </div>
                       </motion.div>
                     )}

                     {step === 4 && (
                       <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                          <div>
                             <h2 className="text-xl font-bold tracking-tight mb-1 text-main">Final Review</h2>
                             <p className="text-[11px] text-muted-custom font-medium leading-relaxed">Confirm your community architecture before launching into the hub.</p>
                          </div>

                           <div className="space-y-6">
                              <div className="relative">
                                 <label className="block h-40 rounded-sm bg-white/5 border border-dashed border-custom flex items-center justify-center cursor-pointer hover:bg-white/10 transition-all overflow-hidden relative group">
                                    {formData.coverImage ? (
                                      <img src={formData.coverImage} className="w-full h-full object-cover" alt="Cover" />
                                    ) : (
                                      <div className="flex flex-col items-center gap-2">
                                         <ImageIcon size={24} className="text-muted-custom group-hover:text-primary-gold" />
                                         <span className="text-[9px] font-bold uppercase tracking-widest text-muted-custom">Upload Cover Image</span>
                                      </div>
                                    )}
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'coverImage')} />
                                 </label>
                                 
                                 <label className="absolute -bottom-8 left-10 size-24 rounded-sm bg-card-surface border-4 border-bg-color shadow-2xl flex flex-col items-center justify-center cursor-pointer border-dashed border-custom group overflow-hidden">
                                    {formData.profileImage ? (
                                      <img src={formData.profileImage} className="w-full h-full object-cover" alt="Avatar" />
                                    ) : (
                                      <div className="flex flex-col items-center gap-1">
                                         <Camera size={20} className="text-muted-custom group-hover:text-primary-gold" />
                                         <span className="text-[7px] font-bold uppercase text-muted-custom tracking-widest">Avatar</span>
                                      </div>
                                    )}
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'profileImage')} />
                                 </label>
                              </div>

                              <div className="pt-12 grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-sm bg-white/5 border border-custom">
                                   <p className="text-[8px] font-bold text-muted-custom uppercase mb-1">Identity</p>
                                   <h4 className="text-sm font-bold text-main">{formData.name}</h4>
                                   <p className="text-[10px] font-bold text-primary-gold">@{formData.username}</p>
                                </div>
                                <div className="p-4 rounded-sm bg-white/5 border border-custom">
                                   <p className="text-[8px] font-bold text-muted-custom uppercase mb-1">Classification</p>
                                   <h4 className="text-sm font-bold text-main">{currentHubType?.label || formData.type}</h4>
                                   <p className="text-[10px] font-bold text-emerald-500 uppercase">{formData.privacy} HUB</p>
                                </div>
                             </div>

                             <div className="p-6 rounded-sm bg-primary-gold/5 border border-primary-gold/20 space-y-4">
                                <div className="flex items-center gap-2 text-primary-gold">
                                   <Scale size={18} />
                                   <h3 className="text-[10px] font-bold uppercase tracking-widest">The Creator Mandate</h3>
                                </div>
                                <div className="space-y-3">
                                   {[
                                     "You are the Chief. If the content is trash, it’s your job to take it out.",
                                     "Don’t let your tribe become a dumpster fire—moderate with a steady hand.",
                                     "If it doesn’t belong in a premium hub, it doesn’t belong in your feed.",
                                     "Be fair. Use your moderator powers for good, not for petty campus squabbles."
                                   ].map((m, i) => (
                                     <div key={i} className="flex items-start gap-3">
                                        <div className="size-1 rounded-full bg-primary-gold mt-1.5 shrink-0" />
                                        <p className="text-[10px] font-medium text-main leading-relaxed">{m}</p>
                                     </div>
                                   ))}
                                </div>
                                <label className="flex items-center gap-3 cursor-pointer group pt-2">
                                   <div 
                                     onClick={() => setHasAcceptedMandate(!hasAcceptedMandate)}
                                     className={`size-5 rounded-sm border-2 flex items-center justify-center transition-all ${hasAcceptedMandate ? 'bg-primary-gold border-primary-gold' : 'border-custom bg-black/20 group-hover:border-primary-gold/50'}`}
                                   >
                                      {hasAcceptedMandate && <Check size={14} className="text-black" strokeWidth={4} />}
                                   </div>
                                   <span className="text-[10px] font-bold uppercase tracking-widest text-main group-hover:text-primary-gold transition-colors">I accept full responsibility for this Tribe</span>
                                </label>
                             </div>
                             
                             {error && (
                               <div className="p-4 rounded-sm bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest text-center">
                                  {error}
                               </div>
                             )}
                          </div>

                          <div className="pt-8 border-t border-custom flex gap-3">
                             <button onClick={() => setStep(3)} className="h-10 px-8 rounded-sm border border-custom text-muted-custom font-bold text-[9px] uppercase tracking-widest">Back</button>
                             <button 
                               disabled={isSubmitting || !hasAcceptedMandate}
                               onClick={handleCreate}
                               className="flex-1 h-10 bg-primary-gold text-black rounded-sm font-bold text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-primary-gold/10 disabled:opacity-30 disabled:grayscale transition-all"
                             >
                                {isSubmitting ? (
                                  <div className="flex items-center gap-2">
                                     <div className="size-3 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                     <span>Creating...</span>
                                  </div>
                                ) : (
                                  <><Plus size={14} /> Create Tribe</>
                                )}
                             </button>
                          </div>
                       </motion.div>
                     )}
                   </AnimatePresence>

                    {/* --- Success Modal --- */}
                    <AnimatePresence>
                      {isSuccess && (
                        <motion.div 
                          initial={{ opacity: 0 }} 
                          animate={{ opacity: 1 }} 
                          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md"
                        >
                           <motion.div 
                             initial={{ scale: 0.9, y: 20 }} 
                             animate={{ scale: 1, y: 0 }}
                             className="w-full max-w-lg card-surface border border-primary-gold/30 rounded-sm p-12 text-center relative overflow-hidden"
                           >
                              <div className="absolute top-0 left-0 w-full h-1 bg-primary-gold animate-progress" />
                              
                              <div className="size-24 rounded-sm bg-primary-gold/10 border border-primary-gold/20 flex items-center justify-center text-primary-gold mx-auto mb-8 shadow-[0_0_40px_rgba(255,184,0,0.1)]">
                                 <Rocket size={48} />
                              </div>

                              <h2 className="text-3xl font-black tracking-tight text-main uppercase mb-2">Hub Ignited!</h2>
                              <p className="text-[11px] font-bold text-muted-custom uppercase tracking-[0.2em] mb-10">The {formData.name} community is now live.</p>

                              <div className="space-y-4 mb-10">
                                 <div className="flex items-center justify-between p-4 bg-white/5 border border-custom rounded-sm">
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-custom">Internal ID</span>
                                    <span className="text-[10px] font-bold text-primary-gold uppercase tracking-widest">{createdTribe?.internalId || 'TRACKING_ID_PENDING'}</span>
                                 </div>
                                 <div className="flex items-center justify-between p-4 bg-white/5 border border-custom rounded-sm">
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-custom">Handle</span>
                                    <span className="text-[10px] font-bold text-main uppercase tracking-widest">@{createdTribe?.slug}</span>
                                 </div>
                                 {isUsernameTaken && (
                                   <p className="text-[9px] font-bold text-red-500 uppercase tracking-widest mt-2 flex items-center gap-1">
                                      <AlertTriangle size={12} /> This handle is already taken
                                   </p>
                                 )}
                                 {isCheckingUsername && (
                                   <p className="text-[9px] font-bold text-primary-gold uppercase tracking-widest mt-2 animate-pulse">
                                      Checking availability...
                                   </p>
                                 )}
                              </div>

                              <button 
                                onClick={() => router.push(`/tribes/${createdTribe?.slug}`)}
                                className="w-full h-14 bg-primary-gold text-black rounded-sm font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:brightness-110 transition-all shadow-2xl shadow-primary-gold/20"
                              >
                                 Enter Hub <ChevronRight size={18} strokeWidth={3} />
                              </button>

                              <p className="text-[8px] font-bold text-muted-custom uppercase tracking-widest mt-6 animate-pulse">Redirecting to command center in 3s...</p>
                           </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                </div>
             </div>
          </div>

          <AdSidebar type="GENERAL" />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
