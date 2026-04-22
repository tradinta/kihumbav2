"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  MapPin, 
  Sparkles, 
  ChevronRight,
  School,
  User as UserIcon,
  CheckCircle2,
  ChevronDown,
  Globe,
  Loader2,
  AlertCircle,
  Check,
  Search,
  X
} from "lucide-react";
import { useSnackbar } from "@/context/SnackbarContext";
import { useAuth } from "@/context/AuthContext";

// Locality Data
import kenyaFull from "@/lib/kenya_full.json";
import kenyaInstitutions from "@/lib/kenya_institutions.json";

const GENDERS = [
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
  { label: "Others", value: "OTHERS" },
  { label: "Prefer not to say", value: "PREFER_NOT_TO_SAY" }
];

export default function WelcomeOnboarding() {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const { user, isAuthenticated } = useAuth();
  const [step, setStep] = useState(0);
  
  // --- Form State ---
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");

  // Populate from auth user on load
  useEffect(() => {
    if (user) {
      // If user.username looks like a UUID, don't use it
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(user.username || "");
      if (!isUuid && user.username) setUsername(user.username);
      
      if (user.name && user.name !== user.email) setFullName(user.name);
      else if (user.fullName) setFullName(user.fullName);
    }
  }, [user]);
  
  const [country, setCountry] = useState<string>("Detecting...");
  const [countyName, setCountyName] = useState<string>("");
  const [subCounty, setSubCounty] = useState<string>("");
  const [isStudent, setIsStudent] = useState(false);
  const [institution, setInstitution] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- UI State ---
  const [showCountySuggestions, setShowCountySuggestions] = useState(false);
  const countyInputRef = useRef<HTMLInputElement>(null);

  // --- Username Check State ---
  const [usernameStatus, setUsernameStatus] = useState({ loading: false, available: false, message: "" });

  // Debounced username check
  useEffect(() => {
    if (username.length < 5) {
      setUsernameStatus({ loading: false, available: false, message: "Too short (min 5)" });
      return;
    }
    if (username.length > 12) {
      setUsernameStatus({ loading: false, available: false, message: "Too long (max 12)" });
      return;
    }

    const timer = setTimeout(async () => {
      setUsernameStatus(prev => ({ ...prev, loading: true }));
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/account/check-username/${username}`);
        const data = await res.json();
        setUsernameStatus({ loading: false, available: data.available, message: data.message });
      } catch (err) {
        setUsernameStatus({ loading: false, available: false, message: "Error checking availability" });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [username]);

  // IP-based Country Detection
  useEffect(() => {
    const detectLocality = async () => {
      // 1. Trust Device Locale First (Bypass VPN if possible)
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const locale = navigator.language;
      
      let detectedCountry = "Kenya"; // Default
      
      // If timezone is in Africa/Nairobi or similar, assume Kenya
      if (timezone.includes("Nairobi") || locale.includes("en-KE") || locale.includes("sw-KE")) {
        detectedCountry = "Kenya";
      } else {
        // Fallback to IP API for other regions
        try {
          const res = await fetch("https://ipapi.co/json/");
          const data = await res.json();
          if (data.country_name) detectedCountry = data.country_name;
        } catch (err) {
          console.error("IP detection failed", err);
        }
      }
      setCountry(detectedCountry);
    };
    detectLocality();
  }, []);

  // County Autocomplete Logic
  const filteredCounties = useMemo(() => {
    if (countyName.length < 2) return [];
    return Object.values(kenyaFull.counties).filter((c: any) => 
      c.name.toLowerCase().includes(countyName.toLowerCase())
    );
  }, [countyName]);

  const selectedCountyEntry = useMemo(() => {
    return Object.entries(kenyaFull.counties).find(([id, c]: any) => 
      c.name.toLowerCase() === countyName.toLowerCase()
    );
  }, [countyName]);

  const countyId = selectedCountyEntry ? selectedCountyEntry[0] : "";
  const selectedCountyData = selectedCountyEntry ? (selectedCountyEntry[1] as any) : null;

  const availableInstitutions = useMemo(() => {
    if (!countyId) return [];
    const inst = (kenyaInstitutions.institutions as any)[countyId];
    if (!inst) return [];
    return [...(inst.universities || []), ...(inst.tvets || [])];
  }, [countyId]);

  const finalize = async () => {
    setIsSubmitting(true);
    try {
      // ONLY send fields defined in OnboardingDto
      const payload = {
        username,
        fullName,
        dateOfBirth,
        gender,
        country: country === "Detecting..." ? "Kenya" : country,
        county: countyName || undefined,
        countyId: countyId || undefined,
        subCounty: subCounty || undefined,
        institution: isStudent ? institution : undefined,
        registrationDevice: typeof window !== 'undefined' ? navigator.userAgent : 'unknown',
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/account/onboarding`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        window.location.href = "/?welcome=true";
      } else {
        const err = await response.json();
        showSnackbar(err.message || "Failed to save profile. Please check your details.", "error");
      }
    } catch (error) {
      showSnackbar("Connection error. Please try again later.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-color)] flex items-center justify-center p-4 font-inter relative overflow-hidden text-[var(--text-main)]">
      
      {/* ── Background Effects ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-gold/5 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-lg relative z-10">
         
         <AnimatePresence>
           {step > 0 && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 mb-6 px-2">
               {[1, 2].map((s) => (
                 <div key={s} className="h-1 flex-1 rounded-full bg-[var(--pill-bg)] overflow-hidden">
                    <motion.div 
                       className="h-full bg-primary-gold"
                       initial={{ width: '0%' }}
                       animate={{ width: s <= step ? '100%' : '0%' }}
                    />
                 </div>
               ))}
             </motion.div>
           )}
         </AnimatePresence>

         <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-3xl shadow-2xl relative min-h-[480px] flex flex-col overflow-hidden">
            
            {/* ── Top-Right Skip Option ── */}
            {step === 2 && (
              <button 
                onClick={finalize}
                className="absolute top-6 right-8 text-xs font-bold text-[var(--text-muted)] hover:text-primary-gold transition-colors flex items-center gap-1.5 z-20"
              >
                Skip <ChevronRight size={14} />
              </button>
            )}

            <AnimatePresence mode="wait">
              
              {/* ── STEP 0: Welcome ── */}
              {step === 0 && (
                <motion.div 
                  key="step0"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.98 }}
                  className="p-12 flex flex-col items-center justify-center text-center flex-1"
                >
                   <div className="size-16 mb-8 rounded-2xl bg-primary-gold/10 flex items-center justify-center text-primary-gold">
                     <Sparkles size={32} />
                   </div>
                   
                   <h1 className="text-3xl font-bold tracking-tight mb-4">Welcome to Kihumba</h1>
                   <p className="text-base text-[var(--text-muted)] mb-10 max-w-xs mx-auto leading-relaxed">
                     We're glad you're here. Let's set up your profile in just two quick steps.
                   </p>
                   
                   <button 
                     onClick={() => setStep(1)} 
                     className="w-full bg-primary-gold text-black rounded-2xl py-4 font-bold hover:brightness-105 transition-all flex items-center justify-center gap-2 group shadow-xl shadow-primary-gold/10"
                   >
                     Get Started <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                   </button>
                </motion.div>
              )}

              {/* ── STEP 1: About You ── */}
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="p-10 flex flex-col flex-1"
                >
                   <div className="mb-8">
                     <h2 className="text-3xl font-bold mb-1">About You</h2>
                     <p className="text-sm text-[var(--text-muted)]">Tell us a bit about yourself.</p>
                   </div>

                   <div className="space-y-5 mb-8">
                     <div className="space-y-1.5">
                       <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider ml-1">Username</label>
                       <div className="relative">
                         <div className="absolute inset-y-0 left-0 pl-5 flex items-center text-[var(--text-muted)]">@</div>
                         <input 
                           type="text"
                           value={username}
                           onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                           className={`w-full bg-[var(--pill-bg)] border ${usernameStatus.available ? 'border-primary-gold' : 'border-white/5'} rounded-2xl py-3.5 pl-10 pr-12 text-sm font-medium focus:outline-none transition-all`}
                           placeholder="johndoe"
                         />
                         <div className="absolute inset-y-0 right-0 pr-5 flex items-center">
                           {usernameStatus.loading ? <Loader2 size={16} className="animate-spin text-[var(--text-muted)]" /> : 
                            usernameStatus.available ? <Check size={16} className="text-primary-gold" /> : 
                            username.length >= 5 ? <AlertCircle size={16} className="text-red-500" /> : null}
                         </div>
                       </div>
                     </div>

                     <div className="space-y-1.5">
                       <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider ml-1">Full Name</label>
                       <input 
                         type="text"
                         value={fullName}
                         onChange={e => setFullName(e.target.value)}
                         className="w-full bg-[var(--pill-bg)] border border-white/5 rounded-2xl py-3.5 px-5 text-sm font-medium focus:outline-none focus:border-primary-gold transition-all"
                         placeholder="e.g. John Kamau"
                       />
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-1.5">
                         <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider ml-1">Birthday</label>
                         <input 
                           type="date"
                           value={dateOfBirth}
                           onChange={e => setDateOfBirth(e.target.value)}
                           className="w-full bg-[var(--pill-bg)] border border-white/5 rounded-2xl py-3.5 px-5 text-sm font-medium focus:outline-none focus:border-primary-gold transition-all"
                         />
                       </div>

                       <div className="space-y-1.5">
                         <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider ml-1">Gender</label>
                         <div className="relative">
                           <select 
                             value={gender}
                             onChange={e => setGender(e.target.value)}
                             className="w-full bg-[var(--pill-bg)] border border-white/5 rounded-2xl py-3.5 pl-5 pr-12 text-sm font-medium appearance-none focus:outline-none focus:border-primary-gold transition-all cursor-pointer"
                           >
                             <option value="" disabled>Select</option>
                             {GENDERS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                           </select>
                           <ChevronDown size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
                         </div>
                       </div>
                     </div>
                   </div>

                   <button 
                     onClick={() => setStep(2)} 
                     disabled={!usernameStatus.available || !fullName || !dateOfBirth || !gender}
                     className="mt-auto w-full bg-primary-gold text-black rounded-2xl py-4 font-bold hover:brightness-105 transition-all disabled:opacity-50 shadow-xl shadow-primary-gold/10"
                   >
                     Continue
                   </button>
                </motion.div>
              )}

              {/* ── STEP 2: Where are you from? ── */}
              {step === 2 && (
                <motion.div 
                   key="step2"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="p-10 flex flex-col flex-1"
                >
                   <div className="mb-8">
                     <h2 className="text-3xl font-bold mb-1">Where are you from?</h2>
                     <p className="text-sm text-[var(--text-muted)]">This helps us show you local content.</p>
                   </div>

                   <div className="space-y-5 mb-8">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider ml-1">Country</label>
                        <div className="relative">
                           <Globe size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                           <input 
                             type="text"
                             value={country}
                             onChange={(e) => setCountry(e.target.value)}
                             className="w-full bg-[var(--pill-bg)] border border-white/5 rounded-2xl py-3.5 pl-12 pr-5 text-sm font-medium focus:outline-none focus:border-primary-gold transition-all"
                           />
                        </div>
                      </div>

                      {country.toLowerCase() === "kenya" && (
                        <div className="space-y-5">
                          <div className="space-y-1.5 relative">
                            <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider ml-1">County</label>
                            <div className="relative">
                              <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                              <input 
                                ref={countyInputRef}
                                type="text"
                                value={countyName}
                                onChange={(e) => {
                                  setCountyName(e.target.value);
                                  setShowCountySuggestions(true);
                                  setSubCounty("");
                                  setInstitution("");
                                }}
                                onFocus={() => setShowCountySuggestions(true)}
                                onBlur={() => setTimeout(() => setShowCountySuggestions(false), 200)}
                                placeholder="Start typing..."
                                className="w-full bg-[var(--pill-bg)] border border-white/5 rounded-2xl py-3.5 pl-12 pr-5 text-sm font-medium focus:outline-none focus:border-primary-gold transition-all"
                              />
                              {countyId && <CheckCircle2 size={20} className="absolute right-5 top-1/2 -translate-y-1/2 text-emerald-500" />}
                            </div>

                            <AnimatePresence>
                              {showCountySuggestions && filteredCounties.length > 0 && (
                                <motion.div 
                                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                  className="absolute z-50 w-full mt-2 bg-[var(--pill-bg)] border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-48 overflow-y-auto backdrop-blur-xl"
                                >
                                  {filteredCounties.map((c: any) => (
                                    <button 
                                      key={c.name}
                                      onClick={() => {
                                        setCountyName(c.name);
                                        setShowCountySuggestions(false);
                                      }}
                                      className="w-full text-left px-5 py-4 text-sm font-medium hover:bg-primary-gold/10 hover:text-primary-gold transition-colors flex items-center justify-between"
                                    >
                                      {c.name}
                                      <span className="text-[10px] font-bold opacity-30 uppercase tracking-tighter">{c.region}</span>
                                    </button>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          <AnimatePresence>
                            {countyId && (
                              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-5">
                                <div className="space-y-1.5">
                                  <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider ml-1">Sub-County</label>
                                  <div className="relative">
                                    <select 
                                      value={subCounty}
                                      onChange={(e) => setSubCounty(e.target.value)}
                                      className="w-full bg-[var(--pill-bg)] border border-white/5 rounded-2xl py-3.5 pl-5 pr-12 text-sm font-medium appearance-none focus:outline-none focus:border-primary-gold transition-all cursor-pointer"
                                    >
                                      <option value="">Select sub-county</option>
                                      {selectedCountyData.sub_counties.map((sc: string) => <option key={sc} value={sc}>{sc}</option>)}
                                    </select>
                                    <ChevronDown size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
                                  </div>
                                </div>

                                <label className="flex items-center gap-4 cursor-pointer group py-1">
                                  <input type="checkbox" className="sr-only" checked={isStudent} onChange={e => setIsStudent(e.target.checked)} />
                                  <div className={`size-6 rounded-lg border-2 flex items-center justify-center transition-all ${isStudent ? 'bg-primary-gold border-primary-gold' : 'bg-transparent border-white/10'}`}>
                                    {isStudent && <Check size={16} className="text-black" strokeWidth={4} />}
                                  </div>
                                  <span className="text-sm font-bold">I am a student</span>
                                </label>

                                {isStudent && (
                                  <div className="space-y-4 animate-fade-in-up">
                                    <div className="space-y-1.5">
                                      <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider ml-1">School / Institution</label>
                                      <div className="relative">
                                        <School size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                                        <select 
                                          value={availableInstitutions.includes(institution) ? institution : institution ? "Other" : ""}
                                          onChange={e => {
                                            if (e.target.value === "Other") setInstitution("Other");
                                            else setInstitution(e.target.value);
                                          }}
                                          className="w-full bg-[var(--pill-bg)] border border-white/5 rounded-2xl py-3.5 pl-12 pr-12 text-sm font-medium appearance-none focus:outline-none focus:border-primary-gold transition-all cursor-pointer"
                                        >
                                          <option value="">Select your school...</option>
                                          {availableInstitutions.map((inst: string) => <option key={inst} value={inst}>{inst}</option>)}
                                          <option value="Other">Other (Not listed)</option>
                                        </select>
                                        <ChevronDown size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
                                      </div>
                                    </div>

                                    {(institution === "Other" || (institution && !availableInstitutions.includes(institution))) && (
                                      <div className="space-y-1.5 animate-fade-in-up">
                                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider ml-1">Type School Name</label>
                                        <input 
                                          type="text"
                                          placeholder="Enter your school's full name"
                                          onChange={e => setInstitution(e.target.value)}
                                          className="w-full bg-[var(--pill-bg)] border border-white/5 rounded-2xl py-3.5 px-5 text-sm font-medium focus:outline-none focus:border-primary-gold transition-all"
                                        />
                                      </div>
                                    )}
                                  </div>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                   </div>

                   <div className="mt-auto flex gap-4">
                     <button 
                       onClick={() => setStep(1)} 
                       className="flex-1 bg-white/5 text-[var(--text-muted)] rounded-2xl py-4 font-bold hover:bg-white/10 hover:text-white transition-all"
                     >
                       Back
                     </button>
                     <button 
                       onClick={finalize}
                       disabled={isSubmitting || (country.toLowerCase() === "kenya" && !countyId)}
                       className="flex-[2] bg-primary-gold text-black rounded-2xl py-4 font-bold hover:brightness-105 transition-all disabled:opacity-50 shadow-xl shadow-primary-gold/10 flex items-center justify-center"
                     >
                       {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : "Finish"}
                     </button>
                   </div>
                </motion.div>
              )}

            </AnimatePresence>
         </div>
      </div>
    </div>
  );
}
