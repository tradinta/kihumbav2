
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, ArrowRight, X, Key, Zap } from "lucide-react";

export default function SafetyCheckpoint() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Detect magic login signature
    if (searchParams.get('magic_login') === 'true') {
      setIsOpen(true);
      // Clean up URL without refreshing
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [searchParams]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-zinc-900 border border-white/5 rounded-[20px] p-8 shadow-2xl shadow-primary-gold/10 overflow-hidden"
          >
            {/* Corner Accent */}
            <div className="absolute top-0 right-0 size-24 bg-primary-gold/10 blur-[40px] -mr-12 -mt-12 rounded-full" />

            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="mb-8">
              <div className="size-14 bg-primary-gold/10 rounded-2xl flex items-center justify-center text-primary-gold mb-6 shadow-xl shadow-primary-gold/5">
                <ShieldCheck size={28} />
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">You're In!</h2>
              <p className="text-sm text-zinc-500 font-medium leading-relaxed">
                You've successfully accessed your account via Magic Link. How would you like to proceed?
              </p>
            </div>

            <div className="space-y-4">
              <button 
                onClick={() => {
                  setIsOpen(false);
                  router.push('/settings'); // Redirect to where they can change password
                }}
                className="w-full p-5 bg-primary-gold text-black rounded-xl flex items-center justify-between group hover:brightness-110 transition-all text-left"
              >
                <div className="flex items-center gap-4">
                  <Key size={20} className="shrink-0" />
                  <div>
                    <h4 className="text-[11px] font-black uppercase tracking-widest">Update Security Key</h4>
                    <p className="text-[9px] font-bold uppercase opacity-60">Set a permanent password now</p>
                  </div>
                </div>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button 
                onClick={() => setIsOpen(false)}
                className="w-full p-5 bg-white/5 border border-white/5 text-white rounded-xl flex items-center justify-between group hover:bg-white/10 transition-all text-left"
              >
                <div className="flex items-center gap-4">
                  <Zap size={20} className="shrink-0 text-primary-gold/70" />
                  <div>
                    <h4 className="text-[11px] font-black uppercase tracking-widest">Continue to Feed</h4>
                    <p className="text-[9px] font-bold uppercase text-zinc-500">I'll set a password later</p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-zinc-700 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <p className="text-[8px] font-black text-center text-zinc-600 uppercase tracking-[0.3em] mt-12">
              Identity Safety Protocol: <span className="text-primary-gold/50">K-ISP-ALPHA</span>
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
