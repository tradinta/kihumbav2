
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  Lock, 
  ChevronRight, 
  Loader2, 
  AlertCircle, 
  CheckCircle2,
  ShieldCheck,
  Eye,
  EyeOff
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useSnackbar } from "@/context/SnackbarContext";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showSnackbar } = useSnackbar();
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setError("Invalid or expired recovery link. Please request a new one.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await authClient.resetPassword({
        newPassword,
        // @ts-ignore - token is required if not in session
        token: token || "", 
      });

      if (res.error) {
        throw new Error(res.error.message || "Failed to reset password.");
      }

      setIsSuccess(true);
      showSnackbar("Your password has been successfully reclaimed.", "success");
      setTimeout(() => router.push("/login"), 3000);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 font-inter selection:bg-primary-gold/30">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute bottom-1/4 right-1/4 w-[50%] h-[50%] bg-primary-gold/20 blur-[150px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="mb-10 text-center">
          <div className="size-16 bg-primary-gold/10 rounded-2xl flex items-center justify-center text-primary-gold mb-8 shadow-2xl shadow-primary-gold/5 mx-auto">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl font-black text-white mb-3 tracking-tighter uppercase">Reclaim Sovereignty</h1>
          <p className="text-sm text-zinc-500 font-medium">Set a powerful new password to secure your account.</p>
        </div>

        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 rounded-2xl bg-green-500/[0.02] border border-green-500/10 text-center"
            >
              <div className="size-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-widest mb-2">Reclaimed!</h3>
              <p className="text-xs text-zinc-500 font-medium leading-relaxed mb-6">
                Your account is now secure. Redirecting you to the login portal...
              </p>
              <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3 }}
                  className="bg-green-500 h-full"
                />
              </div>
            </motion.div>
          ) : (
            <motion.form 
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit} 
              className="space-y-6"
            >
              {error && (
                <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 flex items-center gap-3">
                  <AlertCircle className="text-red-500 shrink-0" size={18} />
                  <p className="text-xs font-bold text-red-500">{error}</p>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider ml-1">New Password</label>
                <div className="relative group">
                  <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-primary-gold transition-colors" />
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-zinc-900/50 border border-white/5 rounded-xl py-4 pl-12 pr-14 text-sm font-medium focus:outline-none focus:border-primary-gold transition-all text-white"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider ml-1">Confirm New Password</label>
                <div className="relative group">
                  <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-primary-gold transition-colors" />
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-zinc-900/50 border border-white/5 rounded-xl py-4 pl-12 pr-5 text-sm font-medium focus:outline-none focus:border-primary-gold transition-all text-white"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isLoading || !newPassword || !confirmPassword || !token}
                className="w-full bg-white text-black rounded-xl py-4 font-black text-[11px] uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-xl disabled:opacity-50 group"
              >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <>Reclaim Account <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" /></>}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="mt-12 text-center">
          <Link href="/login" className="text-[10px] font-black text-zinc-600 uppercase tracking-widest hover:text-white transition-colors">
            Cancel and Return to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
