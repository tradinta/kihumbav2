
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  Mail, 
  ChevronRight, 
  Loader2, 
  AlertCircle, 
  CheckCircle2,
  ArrowLeft,
  Zap,
  Key,
  ArrowRight
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

type Step = 'identify' | 'success';
type Mode = 'magic' | 'reset';

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState("");
  const [step, setStep] = useState<Step>('identify');
  const [mode, setMode] = useState<Mode>('magic');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [maskedEmail, setMaskedEmail] = useState("");

  const executeRecovery = async (selectedMode: Mode) => {
    if (!identifier) {
        setError("Please enter your email or username.");
        return;
    }
    setMode(selectedMode);
    setIsLoading(true);
    setError(null);

    try {
      // Use our new custom endpoint that supports both email and username for ALL modes
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/account/forgot-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier, mode: selectedMode })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to process recovery.");
      
      setMaskedEmail(data.email);
      setStep('success');
    } catch (err: any) {
      setError(err.message || "We couldn't find an account with that identity.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 font-inter selection:bg-primary-gold/30 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] size-[60%] bg-primary-gold/5 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <Link href="/login" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 hover:text-primary-gold transition-colors mb-12 group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Login
        </Link>

        <AnimatePresence mode="wait">
          {step === 'identify' && (
            <motion.div 
              key="identify"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="mb-10">
                <h1 className="text-4xl font-black text-white mb-3 tracking-tighter uppercase">Trouble Logging In?</h1>
                <p className="text-sm text-zinc-500 font-medium">We'll help you get back to your account right away.</p>
              </div>

              <div className="space-y-8">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider ml-1">Email or Username</label>
                  <div className="relative group">
                    <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-primary-gold transition-colors" />
                    <input 
                      type="text"
                      value={identifier}
                      onChange={e => { setIdentifier(e.target.value); setError(null); }}
                      placeholder="Enter your email or username"
                      className="w-full bg-zinc-900/40 border border-white/5 rounded-xl py-4 pl-12 pr-5 text-sm font-medium focus:outline-none focus:border-primary-gold/50 transition-all text-white"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1 mb-4">Choose how you want to log in:</p>
                    
                    <button 
                        onClick={() => executeRecovery('magic')}
                        disabled={isLoading || !identifier}
                        className="w-full p-5 bg-primary-gold text-black rounded-xl flex items-center justify-between group hover:brightness-110 transition-all text-left disabled:opacity-40"
                    >
                        <div className="flex items-center gap-4">
                            <Zap size={20} className="shrink-0" />
                            <div>
                                <h4 className="text-[11px] font-black uppercase tracking-widest">Log me in immediately</h4>
                                <p className="text-[9px] font-bold uppercase opacity-60">We'll send a link to your email</p>
                            </div>
                        </div>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button 
                        onClick={() => executeRecovery('reset')}
                        disabled={isLoading || !identifier}
                        className="w-full p-5 bg-white/5 border border-white/5 text-white rounded-xl flex items-center justify-between group hover:bg-white/10 transition-all text-left disabled:opacity-40"
                    >
                        <div className="flex items-center gap-4">
                            <Key size={20} className="shrink-0 text-primary-gold/70" />
                            <div>
                                <h4 className="text-[11px] font-black uppercase tracking-widest">I want to reset my password</h4>
                                <p className="text-[9px] font-bold uppercase text-zinc-500">Change your password to something new</p>
                            </div>
                        </div>
                        <ArrowRight size={16} className="text-zinc-700 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                {isLoading && (
                    <div className="flex justify-center">
                        <Loader2 size={20} className="animate-spin text-primary-gold" />
                    </div>
                )}

                {error && (
                    <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 flex items-center gap-3">
                        <AlertCircle className="text-red-500 shrink-0" size={18} />
                        <p className="text-xs font-bold text-red-500">{error}</p>
                    </div>
                )}
              </div>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 rounded-2xl bg-primary-gold/[0.02] border border-primary-gold/10 text-center"
            >
              <div className="size-20 bg-primary-gold/10 rounded-full flex items-center justify-center mx-auto mb-8 text-primary-gold">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-[0.2em] mb-3">Link Sent!</h3>
              <p className="text-[11px] text-zinc-500 font-medium leading-relaxed mb-8 px-4">
                We've sent a link to <span className="text-white font-black">{maskedEmail}</span>. Click it to {mode === 'magic' ? 'log in immediately' : 'reset your password'}.
              </p>
              <button 
                onClick={() => setStep('identify')}
                className="text-[9px] font-black text-primary-gold uppercase tracking-widest hover:underline"
              >
                Try a different identity
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-16 text-center">
            <p className="text-[9px] font-bold text-zinc-700 uppercase tracking-[0.4em]">Secure Login Infrastructure</p>
        </div>
      </motion.div>
    </div>
  );
}
