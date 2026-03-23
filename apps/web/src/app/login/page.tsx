"use client";

import { useState } from "react";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="min-h-screen bg-page flex">
      {/* Left Panel — Branding (desktop) */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[50%] relative overflow-hidden items-center justify-center">
        {/* Background image layer */}
        <div className="absolute inset-0">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtybnJkTWyDCI2riQjGAzSdkmoZlzfkuZE29TFvMwQiFsqXC2oOWNZPMwfOo5n_fpDccgNPiyAxqdPOHH1rzViklqvdAs03Rfd4Ng9YbstNwBw0DBxgFEzHjDeACAMz4ga0nXckhZCayFTNCzQePdENatj_aZfNOIqacLS0sQS-uNxqliYE3NET2ay18WkjX2luD2trZVZYAhmaA7-tFXCgD_tytEbhmkm1DpFE5n4EMatPi8bK-DeQIiUVYZjcRd8U95CGi8Q_XPw"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
        </div>

        {/* Brand content */}
        <div className="relative z-10 px-12 xl:px-20 max-w-lg">
          <h1 className="text-4xl xl:text-5xl font-bold tracking-[0.3em] uppercase text-primary-gold gold-glow mb-6">
            Kihumba
          </h1>
          <div className="w-16 h-0.5 bg-gradient-to-r from-primary-gold to-transparent mb-6" />
          <p className="text-lg text-white/80 font-light leading-relaxed mb-3">
            Where culture meets community.
          </p>
          <p className="text-sm text-white/50 font-light leading-relaxed">
            Connect with creators, share your story, and be part of something bigger than yourself.
          </p>

          {/* Stats */}
          <div className="flex gap-8 mt-10">
            <div>
              <p className="text-2xl font-bold text-primary-gold">50K+</p>
              <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mt-1">Creators</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-gold">1.2M</p>
              <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mt-1">Posts</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-gold">47</p>
              <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mt-1">Counties</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-12 lg:px-16 xl:px-24 py-12 relative">
        {/* Mobile background glow */}
        <div className="lg:hidden absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-primary-gold/8 blur-[120px] pointer-events-none" />

        {/* Mobile brand */}
        <div className="lg:hidden mb-12 text-center">
          <h1 className="text-3xl font-bold tracking-[0.4em] uppercase text-primary-gold gold-glow mb-2">
            Kihumba
          </h1>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-custom font-medium">
            Where culture meets community
          </p>
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">Sign in</h2>
            <p className="text-sm text-muted-custom">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-muted-custom mb-2.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                required
                className="w-full bg-transparent pill-surface border border-custom rounded-xl px-5 py-4 text-[15px] text-[var(--text-main)] placeholder:text-muted-custom/40 focus:outline-none focus:border-primary-gold focus:ring-1 focus:ring-primary-gold/30 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-muted-custom">
                  Password
                </label>
                <button type="button" className="text-[10px] font-bold text-primary-gold uppercase tracking-wider hover:underline">
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  minLength={6}
                  className="w-full bg-transparent pill-surface border border-custom rounded-xl px-5 py-4 pr-12 text-[15px] text-[var(--text-main)] placeholder:text-muted-custom/40 focus:outline-none focus:border-primary-gold focus:ring-1 focus:ring-primary-gold/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-custom hover:text-primary-gold transition-colors p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-3">
                <p className="text-[12px] text-red-400 font-medium">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-gold text-black py-4 rounded-xl text-[13px] font-bold uppercase tracking-[0.25em] hover:brightness-110 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl shadow-primary-gold/20 mt-2"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-[var(--border-color)]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-custom">New here?</span>
            <div className="flex-1 h-px bg-[var(--border-color)]" />
          </div>

          {/* Create account */}
          <Link
            href="/signup"
            className="block w-full py-4 rounded-xl border-2 border-primary-gold/20 text-[13px] font-bold uppercase tracking-[0.2em] text-primary-gold hover:bg-primary-gold/5 hover:border-primary-gold/40 transition-all active:scale-[0.98] text-center"
          >
            Create an Account
          </Link>
        </div>

        {/* Bottom footer */}
        <p className="mt-12 text-[9px] text-muted-custom uppercase tracking-widest font-bold">
          Kihumba © 2026 — Made in Kenya 🇰🇪
        </p>
      </div>
    </div>
  );
}
