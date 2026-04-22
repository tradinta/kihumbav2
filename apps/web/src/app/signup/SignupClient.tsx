"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Smartphone, User, ChevronRight, Eye, EyeOff, Loader2, AlertCircle, Shield, Check, Mail, Sparkles } from "lucide-react";
import { authClient } from "@/lib/auth-client";

// ── Password Strength Logic ──
function getPasswordStrength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;

  if (score <= 1) return { label: "Weak", color: "bg-red-500", width: "w-1/5", textColor: "text-red-400" };
  if (score <= 2) return { label: "Fair", color: "bg-amber-500", width: "w-2/5", textColor: "text-amber-400" };
  if (score <= 3) return { label: "Good", color: "bg-primary-gold", width: "w-3/5", textColor: "text-primary-gold" };
  if (score <= 4) return { label: "Strong", color: "bg-emerald-500", width: "w-4/5", textColor: "text-emerald-400" };
  return { label: "Excellent", color: "bg-emerald-400", width: "w-full", textColor: "text-emerald-400" };
}

const COMMON_DOMAINS = ["@gmail.com", "@yahoo.com", "@outlook.com", "@hotmail.com", "@jkuat.ac.ke", "@uonbi.ac.ke", "@strathmore.edu"];

export default function SignupClient() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [botField, setBotField] = useState(""); // Honeypot
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showDomainSuggestions, setShowDomainSuggestions] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);

  const strength = useMemo(() => getPasswordStrength(password), [password]);
  const isPhone = (input: string) => /^\+?\d[\d\s-]{6,}$/.test(input.trim());
  const isEmail = (input: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.trim());

  const suggestedDomains = useMemo(() => {
    if (!identifier.includes('@')) return [];
    const [, domainPart] = identifier.split('@');
    return COMMON_DOMAINS.filter(domain => domain.includes(`@${domainPart}`) && domain !== `@${domainPart}`);
  }, [identifier]);

  const handleDomainSelect = (domain: string) => {
    const [localPart] = identifier.split('@');
    setIdentifier(`${localPart}${domain}`);
    setShowDomainSuggestions(false);
    emailInputRef.current?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (botField) return; // Silent fail for bots
    
    setError(null);
    setIsLoading(true);

    try {
      if (!acceptedTerms) {
        throw new Error("You must accept the Terms of Service to continue.");
      }
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match.");
      }
      if (password.length < 8) {
        throw new Error("Security protocol requires 8+ characters");
      }

      const trimmed = identifier.trim();
      let emailToUse = trimmed;
      let nameToUse = trimmed;

      if (isPhone(trimmed)) {
        throw new Error("Phone registration is currently in maintenance. Use email.");
      } else if (isEmail(trimmed)) {
        nameToUse = trimmed.split("@")[0];
      } else {
        throw new Error("Please enter a valid email address.");
      }

      const { error: authError } = await authClient.signUp.email({
        email: emailToUse,
        password,
        name: nameToUse,
      });

      if (authError) throw new Error(authError.message || "Protocol failure during creation");

      // Success — redirect to onboarding
      router.push("/welcome");
    } catch (err: any) {
      setError(err.message || "Initialization failed. Check your parameters.");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-color)] flex font-inter">
      
      {/* ── Left Side: Form ── */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 xl:px-24 py-12 relative overflow-y-auto">
        <div className="max-w-md w-full mx-auto relative z-10">
          
          {/* Logo */}
          <Link href="/" className="inline-block mb-12 group">
            <h1 className="text-2xl font-black tracking-tighter uppercase text-[var(--text-main)] flex items-center gap-1">
              Kihumba <span className="text-primary-gold group-hover:scale-125 transition-transform">.</span>
            </h1>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-black tracking-tighter text-[var(--text-main)] mb-2">Create an account</h2>
            <p className="text-sm font-medium text-[var(--text-muted)]">
              Enter your email below to initialize access to the network.
            </p>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }} 
                animate={{ opacity: 1, y: 0, height: 'auto' }} 
                exit={{ opacity: 0, y: -10, height: 0 }}
                className={`mb-6 overflow-hidden ${shake ? "animate-shake" : ""}`}
              >
                <div className="px-4 py-3 rounded-[4px] bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                  <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                  <span className="text-xs font-bold text-red-400 leading-tight">{error}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Honeypot */}
            <input type="text" value={botField} onChange={(e) => setBotField(e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" />

            {/* Email */}
            <div className="space-y-1.5 relative">
              <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--text-muted)] group-focus-within:text-primary-gold transition-colors">
                  <Mail size={16} strokeWidth={2} />
                </div>
                <input
                  ref={emailInputRef}
                  type="email"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    setShowDomainSuggestions(true);
                  }}
                  onBlur={() => setTimeout(() => setShowDomainSuggestions(false), 200)}
                  disabled={isLoading}
                  className="w-full bg-[var(--pill-bg)] border border-[var(--border-color)] rounded-[4px] py-3.5 pl-11 pr-4 text-sm font-bold text-[var(--text-main)] placeholder:text-[var(--text-muted)]/30 focus:outline-none focus:border-primary-gold/50 transition-all disabled:opacity-50"
                  placeholder="name@example.com"
                  required
                />
              </div>
              
              {/* Domain Autocomplete */}
              <AnimatePresence>
                {showDomainSuggestions && suggestedDomains.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                    className="absolute z-20 w-full mt-1 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-[4px] shadow-2xl overflow-hidden"
                  >
                    {suggestedDomains.map((domain) => (
                      <button
                        key={domain}
                        type="button"
                        onClick={() => handleDomainSelect(domain)}
                        className="w-full text-left px-4 py-2 text-sm font-bold text-[var(--text-muted)] hover:text-primary-gold hover:bg-primary-gold/5 transition-colors"
                      >
                        {identifier.split('@')[0]}<span className="text-[var(--text-main)]">{domain}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Password Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                  Access Secret
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)] group-focus-within:text-primary-gold transition-colors">
                    <Lock size={15} strokeWidth={2} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="w-full bg-[var(--pill-bg)] border border-[var(--border-color)] rounded-[4px] py-3.5 pl-10 pr-10 text-sm font-bold text-[var(--text-main)] placeholder:text-[var(--text-muted)]/30 focus:outline-none focus:border-primary-gold/50 transition-all disabled:opacity-50"
                    placeholder="8+ chars"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[var(--text-muted)] hover:text-primary-gold transition-colors">
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                  Confirm Secret
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)] group-focus-within:text-primary-gold transition-colors">
                    <Shield size={15} strokeWidth={2} />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                    className={`w-full bg-[var(--pill-bg)] border ${confirmPassword && password !== confirmPassword ? 'border-red-500/50' : 'border-[var(--border-color)]'} rounded-[4px] py-3.5 pl-10 pr-10 text-sm font-bold text-[var(--text-main)] placeholder:text-[var(--text-muted)]/30 focus:outline-none focus:border-primary-gold/50 transition-all disabled:opacity-50`}
                    placeholder="Match password"
                    required
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[var(--text-muted)] hover:text-primary-gold transition-colors">
                    {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Password Strength */}
            {password.length > 0 && (
              <div className="pt-1">
                <div className="h-1 rounded-full bg-[var(--pill-bg)] overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: strength.width }} className={`h-full ${strength.color} transition-all duration-300`} />
                </div>
                <div className="flex justify-between items-center mt-1.5">
                  <span className={`text-[9px] font-black uppercase tracking-widest ${strength.textColor}`}>{strength.label} Entropy</span>
                  {confirmPassword && password === confirmPassword && (
                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-1">
                      <Check size={10} /> Matched
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Terms Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center mt-0.5">
                  <input 
                    type="checkbox" 
                    className="sr-only" 
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                  />
                  <div className={`w-4 h-4 rounded-[2px] border flex items-center justify-center transition-all ${acceptedTerms ? 'bg-primary-gold border-primary-gold' : 'bg-[var(--pill-bg)] border-[var(--border-color)] group-hover:border-primary-gold/50'}`}>
                    <Check size={12} className={`text-black transition-transform ${acceptedTerms ? 'scale-100' : 'scale-0'}`} strokeWidth={3} />
                  </div>
                </div>
                <span className="text-xs font-medium text-[var(--text-muted)] leading-relaxed">
                  I agree to the <Link href="/terms" className="text-[var(--text-main)] hover:text-primary-gold underline underline-offset-2">Terms of Service</Link> and <Link href="/privacy" className="text-[var(--text-main)] hover:text-primary-gold underline underline-offset-2">Privacy Policy</Link>.
                </span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || !identifier || password.length < 8 || password !== confirmPassword || !acceptedTerms}
              className="w-full bg-[var(--text-main)] text-[var(--bg-color)] rounded-[4px] py-4 mt-2 text-xs font-black uppercase tracking-[0.2em] hover:brightness-110 active:scale-[0.98] transition-all shadow-xl shadow-black/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <>Create Account <ChevronRight size={16} /></>}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-8 text-center text-sm font-medium text-[var(--text-muted)]">
            Already have an account?{" "}
            <Link href="/login" className="text-[var(--text-main)] font-bold hover:text-primary-gold transition-colors">
              Sign In
            </Link>
          </p>

        </div>
      </div>

      {/* ── Right Side: Aesthetics & Graphics ── */}
      <div className="hidden lg:flex w-1/2 bg-[var(--card-bg)] border-l border-[var(--border-color)] relative items-center justify-center overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-primary-gold/5 blur-[120px] rounded-full pointer-events-none" />
        
        {/* Abstract Graphic / Pattern */}
        <div className="relative z-10 w-full max-w-md px-12 text-center">
          <div className="w-24 h-24 mx-auto mb-8 border border-primary-gold/20 rounded-[8px] rotate-45 flex items-center justify-center relative bg-[var(--bg-color)] shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-gold/10 to-transparent rounded-[8px]" />
            <Sparkles className="text-primary-gold -rotate-45" size={32} />
          </div>
          <h3 className="text-2xl font-black uppercase tracking-tighter text-[var(--text-main)] mb-4">
            The Hub for Kenyan Creators & Innovators
          </h3>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-8">
            Join thousands of individuals and businesses connecting locally. Share your stories, sell your products, and engage with your county.
          </p>
          
          {/* Stats */}
          <div className="flex justify-center gap-8 border-t border-[var(--border-color)] pt-8">
            <div>
              <p className="text-xl font-black text-primary-gold">47</p>
              <p className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] mt-1">Counties</p>
            </div>
            <div>
              <p className="text-xl font-black text-primary-gold">200+</p>
              <p className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] mt-1">Institutions</p>
            </div>
          </div>
        </div>
        
        {/* Grid Background Pattern */}
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
      </div>

    </div>
  );
}
