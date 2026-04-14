"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Mail, Lock, Smartphone, ChevronRight } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-[var(--bg-color)]">
      
      {/* Visual Accent Side (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-black flex-col justify-end p-12">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
        <img 
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564" 
          alt="Abstract Liquid Glass"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        
        <div className="relative z-20 max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="size-16 rounded-2xl bg-gradient-to-br from-primary-gold via-primary-gold/80 to-yellow-600 mb-6 flex items-center justify-center p-1 shadow-2xl shadow-primary-gold/20">
              <span className="text-3xl font-black text-black tracking-tighter">K.</span>
            </div>
            <h2 className="text-4xl font-black text-white tracking-tight mb-4">
              Enter the hub for African Creators.
            </h2>
            <p className="text-sm font-bold text-gray-400">
              Connect with your audience, monetize your content, and scale your brand on the continent's most premium platform.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Auth Form Side */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 xl:px-32 relative">
        <Link 
          href="/" 
          className="absolute top-10 left-8 sm:left-16 xl:left-32 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-custom hover:text-main transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Feed
        </Link>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-black tracking-tight text-main mb-2">Welcome back</h1>
            <p className="text-[12px] font-bold text-muted-custom">Please enter your details to sign in.</p>
          </div>

          {/* Social Logins */}
          <div className="flex gap-4 mb-8">
            <button className="flex-1 py-3 rounded-xl border border-custom bg-[var(--pill-bg)] hover:bg-white/5 transition-colors flex items-center justify-center gap-2 hover:border-custom-hover">
              <svg className="size-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              <span className="text-[11px] font-bold">Google</span>
            </button>
            <button className="flex-1 py-3 rounded-xl border border-custom bg-[var(--pill-bg)] hover:bg-white/5 transition-colors flex items-center justify-center gap-2 hover:border-custom-hover">
              <svg className="size-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.26-.82 3.59-.72 1.48.06 2.65.65 3.34 1.77-3.05 1.87-2.48 5.76.62 6.94-1.03 2.5-2.07 4.1-2.63 4.18zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
              <span className="text-[11px] font-bold">Apple</span>
            </button>
          </div>

          <div className="relative flex items-center py-4 mb-4">
            <div className="flex-grow border-t border-custom"></div>
            <span className="flex-shrink-0 mx-4 text-[9px] font-bold uppercase tracking-widest text-muted-custom">Or continue with</span>
            <div className="flex-grow border-t border-custom"></div>
          </div>

          {/* Form */}
          <form className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-muted-custom uppercase tracking-widest pl-1">Email or Phone</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-custom group-focus-within:text-primary-gold transition-colors">
                  <Smartphone size={16} />
                </div>
                <input 
                  type="text" 
                  className="w-full bg-[var(--pill-bg)] border border-custom rounded-xl py-3.5 pl-11 pr-4 text-[13px] font-bold text-main focus:outline-none focus:border-primary-gold focus:ring-1 focus:ring-primary-gold transition-all"
                  placeholder="name@example.com or +254..."
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center pl-1 pr-1">
                <label className="text-[11px] font-bold text-muted-custom uppercase tracking-widest">Password</label>
                <Link href="#" className="text-[10px] font-bold text-primary-gold hover:underline">Forgot?</Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-custom group-focus-within:text-primary-gold transition-colors">
                  <Lock size={16} />
                </div>
                <input 
                  type="password" 
                  className="w-full bg-[var(--pill-bg)] border border-custom rounded-xl py-3.5 pl-11 pr-4 text-[13px] font-bold text-main focus:outline-none focus:border-primary-gold focus:ring-1 focus:ring-primary-gold transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button type="button" className="w-full bg-main text-[var(--bg-color)] rounded-xl py-3.5 mt-4 text-[12px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group">
              Sign In <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="mt-8 text-center text-[11px] font-bold text-muted-custom">
            Don't have an account? <Link href="/signup" className="text-primary-gold hover:underline ml-1">Create one</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
