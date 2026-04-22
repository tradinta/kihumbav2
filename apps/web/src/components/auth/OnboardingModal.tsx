"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, MapPin, Sparkles, ChevronRight, ChevronLeft, 
  Check, AlertCircle, Loader2, Camera, Globe, Tag
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

// --- Data Constants ---

const COUNTRIES = [
  "Kenya", "Uganda", "Tanzania", "Somalia", "Rwanda", "Burundi", "Ethiopia"
];

const KENYAN_COUNTIES = [
  "Mombasa", "Kwale", "Kilifi", "Tana River", "Lamu", "Taita/Taveta", "Garissa", "Wajir", "Mandera", 
  "Marsabit", "Isiolo", "Meru", "Tharaka-Nithi", "Embu", "Kitui", "Machakos", "Makueni", "Nyandarua", 
  "Nyeri", "Kirinyaga", "Murang'a", "Kiambu", "Turkana", "West Pokot", "Samburu", "Trans Nzoia", 
  "Uasin Gishu", "Elgeyo/Marakwet", "Nandi", "Baringo", "Laikipia", "Nakuru", "Narok", "Kajiado", 
  "Kericho", "Bomet", "Kakamega", "Vihiga", "Bungoma", "Busia", "Siaya", "Kisumu", "Homa Bay", 
  "Migori", "Kisii", "Nyamira", "Nairobi City"
];

const GENDERS = [
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
  { label: "Others", value: "OTHERS" },
  { label: "Prefer not to say", value: "PREFER_NOT_TO_SAY" }
];

// --- Sub-components ---

const InputField = ({ label, error, ...props }: any) => (
  <div className="space-y-1.5 w-full">
    <label className="text-[11px] font-bold text-muted-custom uppercase tracking-wider ml-1">{label}</label>
    <input 
      {...props}
      className={`w-full bg-black/40 border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-gold/50 transition-colors`}
    />
    {error && <p className="text-[10px] text-red-400 ml-1">{error}</p>}
  </div>
);

// --- Main Component ---

export default function OnboardingModal({ isOpen, user }: { isOpen: boolean; user: any }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    fullName: user?.name || "",
    gender: "PREFER_NOT_TO_SAY",
    dateOfBirth: "",
    avatar: user?.image || "",
    bio: "",
    country: "Kenya",
    county: "",
    town: "",
    website: "",
    interests: [] as string[],
  });

  const [usernameStatus, setUsernameStatus] = useState<{ loading: boolean; available: boolean; message: string }>({
    loading: false,
    available: false,
    message: ""
  });

  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debounced username check
  useEffect(() => {
    if (formData.username.length < 5) {
      setUsernameStatus({ loading: false, available: false, message: "Too short" });
      return;
    }
    if (formData.username.length > 12) {
      setUsernameStatus({ loading: false, available: false, message: "Too long" });
      return;
    }

    const timer = setTimeout(async () => {
      setUsernameStatus(prev => ({ ...prev, loading: true }));
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/account/check-username/${formData.username}`);
        const data = await res.json();
        setUsernameStatus({ loading: false, available: data.available, message: data.message });
      } catch (err) {
        setUsernameStatus({ loading: false, available: false, message: "Error checking availability" });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.username]);

  const [isSuccess, setIsSuccess] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/account/onboarding`, {
        method: 'PATCH',
        headers: { 
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSuccess(true);
        // Silently refresh session in background
        setIsRefreshing(true);
        try {
          // Force authClient to refresh its internal state
          window.location.href = "/welcome?success=true";
        } catch (e) {}
      } else {
        const err = await response.json();
        alert(err.message || "Something went wrong");
      }
    } catch (err) {
      alert("Failed to submit onboarding");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg bg-black/90 border border-emerald-500/20 rounded-[2.5rem] p-10 text-center shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-primary-gold to-emerald-500" />
          
          <div className="size-24 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-8 shadow-inner shadow-emerald-500/5">
            <Check size={40} className="text-emerald-400" />
          </div>

          <h2 className="text-3xl font-black text-white mb-4 tracking-tight">Identity Secured</h2>
          <p className="text-muted-custom mb-10 text-sm leading-relaxed">
            Welcome to the elite circles of Kihumba, <span className="text-primary-gold font-bold">@{formData.username}</span>. Your profile is now live and your data is safe in the database.
          </p>

          <div className="space-y-4">
             <div className="bg-white/5 rounded-2xl p-6 text-left border border-white/5">
                <h3 className="text-xs font-bold uppercase tracking-widest text-primary-gold mb-3 flex items-center gap-2">
                   <Sparkles size={14} /> Guide: Your Next Steps
                </h3>
                <ul className="text-[13px] text-muted-custom space-y-3">
                   <li className="flex items-start gap-3">
                      <div className="mt-1 size-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>Explore the <b>Marketplace</b> to find vetted electronics and apparel.</span>
                   </li>
                   <li className="flex items-start gap-3">
                      <div className="mt-1 size-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>Join <b>Tribes</b> that match your interests to earn ad-revenue.</span>
                   </li>
                </ul>
             </div>

             <button 
                onClick={() => window.location.href = "/"}
                className="w-full bg-primary-gold text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
             >
                Start Exploring <ChevronRight size={18} />
             </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-lg bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-primary-gold/5"
      >
        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-white/5 flex">
          {[1, 2, 3].map(i => (
            <div 
              key={i} 
              className={`flex-1 transition-all duration-500 ${step >= i ? 'bg-primary-gold' : 'bg-transparent'}`} 
            />
          ))}
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <div className="size-12 rounded-2xl bg-primary-gold/10 flex items-center justify-center text-primary-gold">
                    <User size={24} />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight">Claim your Identity</h2>
                  <p className="text-sm text-muted-custom">Every citizen of Kihumba needs a unique handle.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-muted-custom uppercase tracking-wider ml-1">Username</label>
                    <div className="relative">
                      <input 
                        value={formData.username}
                        onChange={e => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/\s/g, '') })}
                        className={`w-full bg-black/40 border ${usernameStatus.available ? 'border-primary-gold/50' : 'border-white/10'} rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors`}
                        placeholder="e.g. jdoe"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        {usernameStatus.loading ? <Loader2 size={16} className="animate-spin text-muted-custom" /> : 
                         usernameStatus.available ? <Check size={16} className="text-primary-gold" /> : 
                         formData.username.length >= 5 ? <AlertCircle size={16} className="text-red-500" /> : null}
                      </div>
                    </div>
                    <p className={`text-[10px] ml-1 ${usernameStatus.available ? 'text-primary-gold/80' : 'text-muted-custom'}`}>
                       {usernameStatus.message || "Note: Some usernames may be reserved or reclaimed."}
                    </p>
                  </div>

                  <InputField 
                    label="Full Name" 
                    placeholder="Your display name"
                    value={formData.fullName}
                    onChange={(e: any) => setFormData({ ...formData, fullName: e.target.value })}
                  />

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-muted-custom uppercase tracking-wider ml-1">Gender</label>
                    <div className="grid grid-cols-2 gap-2">
                      {GENDERS.map(g => (
                        <button
                          key={g.value}
                          onClick={() => setFormData({ ...formData, gender: g.value })}
                          className={`px-4 py-2 text-xs rounded-xl border transition-all ${
                            formData.gender === g.value 
                              ? 'bg-primary-gold/10 border-primary-gold text-primary-gold' 
                              : 'bg-white/5 border-white/5 text-muted-custom hover:border-white/20'
                          }`}
                        >
                          {g.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button 
                  disabled={!usernameStatus.available || !formData.fullName}
                  onClick={handleNext}
                  className="w-full bg-primary-gold text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-gold/90 transition-colors mt-4"
                >
                  Continue <ChevronRight size={18} />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <div className="size-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                    <Sparkles size={24} />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight">Personalize your Profile</h2>
                  <p className="text-sm text-muted-custom">Tell the community a bit about yourself.</p>
                </div>

                {/* Avatar Preview/Upload Placeholder */}
                <div className="flex justify-center">
                  <div className="relative group">
                    <div className="size-24 rounded-full border-2 border-primary-gold/20 p-1">
                      <img 
                        src={formData.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100"} 
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <button className="absolute bottom-0 right-0 size-8 bg-primary-gold rounded-full flex items-center justify-center text-black border-4 border-zinc-950 hover:scale-110 transition-transform">
                      <Camera size={14} />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <InputField 
                    label="Date of Birth" 
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e: any) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  />

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-muted-custom uppercase tracking-wider ml-1">Bio</label>
                    <textarea 
                      placeholder="What makes you unique?"
                      value={formData.bio}
                      onChange={e => setFormData({ ...formData, bio: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-gold/50 transition-colors h-24 resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={handleBack}
                    className="flex-1 bg-white/5 text-white font-bold py-4 rounded-2xl hover:bg-white/10 transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    disabled={!formData.dateOfBirth}
                    onClick={handleNext}
                    className="flex-[2] bg-primary-gold text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-primary-gold/90 transition-colors"
                  >
                    Next <ChevronRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <div className="size-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <MapPin size={24} />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight">Origin & Interests</h2>
                  <p className="text-sm text-muted-custom">Final steps to join the Kihumba elite.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-muted-custom uppercase tracking-wider ml-1">Country</label>
                    <select 
                      value={formData.country}
                      onChange={e => setFormData({ ...formData, country: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none"
                    >
                      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  {formData.country === "Kenya" && (
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-muted-custom uppercase tracking-wider ml-1">County</label>
                      <select 
                        value={formData.county}
                        onChange={e => setFormData({ ...formData, county: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none"
                      >
                        <option value="">Select County</option>
                        {KENYAN_COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  )}
                </div>

                <InputField 
                  label="Town / City" 
                  placeholder="Where do you reside?"
                  value={formData.town}
                  onChange={(e: any) => setFormData({ ...formData, town: e.target.value })}
                />

                <InputField 
                    label="Website (Optional)" 
                    placeholder="https://yoursite.com"
                    value={formData.website}
                    onChange={(e: any) => setFormData({ ...formData, website: e.target.value })}
                />

                <div className="flex gap-3">
                  <button 
                    onClick={handleBack}
                    className="flex-1 bg-white/5 text-white font-bold py-4 rounded-2xl hover:bg-white/10 transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    disabled={isSubmitting || (formData.country === "Kenya" && !formData.county)}
                    onClick={handleSubmit}
                    className="flex-[2] bg-primary-gold text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-primary-gold/90 transition-colors"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" /> : "Complete Profile"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
