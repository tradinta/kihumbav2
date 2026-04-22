"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Lock, 
  Smartphone, 
  ChevronRight, 
  Eye, 
  EyeOff, 
  Loader2, 
  AlertCircle, 
  Sparkles, 
  ShieldCheck,
  Zap,
  Globe,
  Fingerprint
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useSnackbar } from "@/context/SnackbarContext";

export default function LoginPage() {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [step, setStep] = useState<'LOGIN' | 'MFA'>('LOGIN');
  const [isPasskeyAvailable, setIsPasskeyAvailable] = useState(false);
  const [mfaCode, setMfaCode] = useState("");

  // SEO & Title update
  useEffect(() => {
    document.title = "Login | Kihumba — Social Network for the Future";
    
    // Check if passkeys are supported (simple check)
    if (window.PublicKeyCredential) {
      setIsPasskeyAvailable(true);
    }
  }, []);

  const isPhone = (input: string) => /^\+?\d[\d\s-]{6,}$/.test(input.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const trimmed = identifier.trim();
      let res;

      if (isPhone(trimmed)) {
        res = await authClient.signIn.phoneNumber({
          phoneNumber: trimmed,
          password,
        });
      } else {
        res = await authClient.signIn.email({
          email: trimmed,
          password,
        });
      }

      if (res.error) {
        if (res.error.code === "TWO_FACTOR_REQUIRED") {
            setStep('MFA');
            setIsLoading(false);
            return;
        }
        throw new Error(res.error.message || "Invalid credentials");
      }

      showSnackbar("Welcome back to Kihumba!", "success");
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please check your details.");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMfaVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
        const { error } = await authClient.twoFactor.verifyTotp({
            code: mfaCode,
        });

        if (error) throw error;

        showSnackbar("Authenticated successfully!", "success");
        router.push("/");
    } catch (err: any) {
        setError(err.message || "Invalid verification code.");
        setShake(true);
        setTimeout(() => setShake(false), 500);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasskeyLogin = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const res = await authClient.signIn.passkey();

      if (res.error) {
        throw new Error(res.error.message || "Passkey login failed");
      }

      showSnackbar("Authenticated via Passkey!", "success");
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Passkey authentication failed.");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex overflow-hidden font-sans selection:bg-primary-gold/30">
      
      {/* ── Left Side: Graphics & Info (Mirrored) ── */}
      <div className="hidden lg:flex w-1/2 relative bg-[var(--card-bg)] items-center justify-center overflow-hidden border-r border-white/5">
        {/* Background Patterns */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full bg-primary-gold/10 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-500/5 blur-[100px]" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        </div>

        <div className="relative z-10 max-w-lg px-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="size-16 bg-primary-gold/10 rounded-2xl flex items-center justify-center text-primary-gold mb-8 shadow-2xl shadow-primary-gold/5">
              <Sparkles size={32} />
            </div>
            
            <h2 className="text-5xl font-black text-white mb-6 leading-tight tracking-tighter">
              Reignite Your <br />
              <span className="text-primary-gold italic">Digital Presence.</span>
            </h2>
            
            <p className="text-lg text-[var(--text-muted)] mb-12 font-medium leading-relaxed">
              Log in to access your customized feed, connect with your community, and continue building your legacy on the most powerful social network in the region.
            </p>

            <div className="space-y-6">
              {[
                { icon: ShieldCheck, title: "Device Locked Security", desc: "Your account is protected by hardware-level encryption and device tracking." },
                { icon: Zap, title: "Real-time Connectivity", desc: "Experience the fastest social interactions powered by Ably." },
                { icon: Globe, title: "Local Context", desc: "Stay rooted with locality-first content and trending insights from your county." }
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + (i * 0.1) }}
                  className="flex gap-4 group"
                >
                  <div className="size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary-gold group-hover:bg-primary-gold/10 transition-colors shrink-0">
                    <feature.icon size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-0.5">{feature.title}</h4>
                    <p className="text-xs text-[var(--text-muted)]">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Attribution */}
        <div className="absolute bottom-10 left-12 flex items-center gap-4">
          <div className="flex -space-x-2">
            {[1,2,3].map(i => (
              <div key={i} className="size-8 rounded-full border-2 border-black bg-zinc-800 overflow-hidden">
                <img src={`https://i.pravatar.cc/100?u=${i}`} className="size-full object-cover grayscale" />
              </div>
            ))}
          </div>
          <span className="text-[10px] font-bold text-muted-custom uppercase tracking-widest">Joined by 50k+ Kenyans</span>
        </div>
      </div>

      {/* ── Right Side: Login Logic ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-black relative">
        <div className="absolute inset-0 lg:hidden opacity-10">
           <div className="absolute top-1/4 left-1/4 w-full h-full bg-primary-gold/20 blur-[150px]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`w-full max-w-md ${shake ? 'animate-shake' : ''}`}
        >
          <div className="mb-12 text-center lg:text-left">
            <Link href="/" className="inline-block mb-8">
               <h1 className="text-2xl font-black uppercase tracking-[0.3em] text-primary-gold gold-glow">Kihumba</h1>
            </Link>
            <h2 className="text-3xl font-bold text-white mb-3">Welcome Back</h2>
            <p className="text-sm text-[var(--text-muted)]">Securely access your account to continue your journey.</p>
          </div>

          <AnimatePresence mode="wait">
            {step === 'LOGIN' ? (
              <motion.div 
                key="login-step"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  <AnimatePresence mode="wait">
                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 flex items-center gap-3"
                      >
                        <AlertCircle className="text-red-500 shrink-0" size={18} />
                        <p className="text-xs font-bold text-red-500">{error}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider ml-1">Email or Phone</label>
                    <div className="relative group">
                      <Smartphone size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-primary-gold transition-colors" />
                      <input 
                        type="text"
                        value={identifier}
                        onChange={e => setIdentifier(e.target.value)}
                        placeholder="name@example.com or +254..."
                        className="w-full bg-[var(--pill-bg)] border border-white/5 rounded-2xl py-4 pl-12 pr-5 text-sm font-medium focus:outline-none focus:border-primary-gold transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Password</label>
                      <Link href="/forgot-password" title="Recover your access" className="text-[10px] font-black text-primary-gold uppercase tracking-widest hover:underline">Forgot?</Link>
                    </div>
                    <div className="relative group">
                      <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-primary-gold transition-colors" />
                      <input 
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[var(--pill-bg)] border border-white/5 rounded-2xl py-4 pl-12 pr-14 text-sm font-medium focus:outline-none focus:border-primary-gold transition-all"
                        required
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isLoading || !identifier || !password}
                    className="w-full bg-primary-gold text-black rounded-2xl py-4 font-bold hover:brightness-105 transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary-gold/10 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {isLoading ? <Loader2 size={20} className="animate-spin" /> : <>Continue to Feed <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" /></>}
                  </button>

                  {isPasskeyAvailable && (
                    <button 
                      type="button"
                      onClick={handlePasskeyLogin}
                      disabled={isLoading}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-2xl py-4 font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-3 group"
                    >
                      <Fingerprint size={20} className="text-primary-gold group-hover:scale-110 transition-transform" />
                      <span className="text-[11px] font-black uppercase tracking-widest">Sign in with Passkey</span>
                    </button>
                  )}
                </form>
              </motion.div>
            ) : (
              <motion.div 
                key="mfa-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center space-y-4">
                  <div className="size-20 bg-primary-gold/10 rounded-full flex items-center justify-center text-primary-gold mx-auto border border-primary-gold/20 shadow-[0_0_50px_rgba(197,160,89,0.1)]">
                    <ShieldCheck size={40} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white uppercase tracking-tight">Identity Verification</h3>
                    <p className="text-xs text-[var(--text-muted)] font-medium">Please enter the 6-digit code from your authenticator app.</p>
                  </div>
                </div>

                <form onSubmit={handleMfaVerify} className="space-y-6">
                  <AnimatePresence mode="wait">
                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 flex items-center gap-3"
                      >
                        <AlertCircle className="text-red-500 shrink-0" size={18} />
                        <p className="text-xs font-bold text-red-500">{error}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-2">
                    <div className="flex gap-4">
                      <input 
                        type="text" 
                        maxLength={6}
                        placeholder="000000"
                        value={mfaCode}
                        onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                        className="flex-1 bg-black/40 border border-white/5 rounded-xl px-6 py-4 text-xl font-black tracking-[0.5em] text-center focus:border-primary-gold focus:outline-none transition-all placeholder:text-white/5"
                        autoFocus
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isLoading || mfaCode.length !== 6}
                    className="w-full bg-primary-gold text-black py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    {isLoading ? <Loader2 size={16} className="animate-spin" /> : <>Verify Identity <ChevronRight size={18} /></>}
                  </button>

                  <button 
                    type="button"
                    onClick={() => setStep('LOGIN')}
                    className="w-full text-[10px] font-black text-muted-custom uppercase tracking-[0.2em] hover:text-white transition-colors"
                  >
                    Back to Login
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Social Proof/Options */}
          <div className="mt-10">
            <div className="relative flex items-center mb-8">
              <div className="flex-grow border-t border-white/5"></div>
              <span className="flex-shrink mx-4 text-[9px] font-black uppercase tracking-[0.3em] text-muted-custom">Security Guaranteed</span>
              <div className="flex-grow border-t border-white/5"></div>
            </div>

            <div className="flex gap-4">
              <button disabled className="flex-1 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center gap-2 opacity-50 cursor-not-allowed group hover:bg-white/10 transition-all">
                <svg className="size-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-custom">Google</span>
              </button>
              <button disabled className="flex-1 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center gap-2 opacity-50 cursor-not-allowed group hover:bg-white/10 transition-all">
                <svg className="size-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.26-.82 3.59-.72 1.48.06 2.65.65 3.34 1.77-3.05 1.87-2.48 5.76.62 6.94-1.03 2.5-2.07 4.1-2.63 4.18zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-custom">Apple</span>
              </button>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-[10px] font-bold text-muted-custom uppercase tracking-[0.2em]">
              New to the network? <Link href="/signup" className="text-primary-gold hover:underline font-black ml-2">Create Identity</Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Decorative Blur */}
      <div className="fixed -bottom-1/4 -right-1/4 size-[500px] bg-primary-gold/5 blur-[150px] pointer-events-none rounded-full z-0" />
    </div>
  );
}
