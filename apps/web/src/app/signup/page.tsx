"use client";

import { useState } from "react";
import { Eye, EyeOff, ArrowRight, Loader2, Phone, Mail, Lock, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordsMatch = confirmPassword.length === 0 || password === confirmPassword;
  const hasMinLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const strengthScore = [hasMinLength, hasUppercase, hasNumber, password.length >= 8].filter(Boolean).length;

  const canSubmit = hasMinLength && password === confirmPassword && email && phone.length >= 9;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!canSubmit) return;
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="min-h-screen bg-page flex">
      {/* Left Panel — Branding (desktop) */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[50%] relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD47UmisG4EnyDtk6w8-frNvTjUOox1Nq9KP7pRcQcahj5Aq9xVgrZUt3PlAWweTfP9MyAxiEbUGohEz-sGWw478vPjZLrYABOi_YR_jUl_EFYNw1nyvFHf7pP-r3S-7qrSPhPZvM13zNBo7TTkoMEBZ5d_iQi1gP_EJqgncFgYpyuVMd60hgv7dHspw3IhcIwNGLkTm0aq1JTzN5ZQPWx0-6ixWSKZG11wOgaCUsblrT6YvZe6FAlpvOO625x-Ex8oINlT1f6a2Q_K"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
        </div>

        <div className="relative z-10 px-12 xl:px-20 max-w-lg">
          <h1 className="text-4xl xl:text-5xl font-bold tracking-[0.3em] uppercase text-primary-gold gold-glow mb-6">
            Kihumba
          </h1>
          <div className="w-16 h-0.5 bg-gradient-to-r from-primary-gold to-transparent mb-6" />
          <p className="text-lg text-white/80 font-light leading-relaxed mb-3">
            Join the community.
          </p>
          <p className="text-sm text-white/50 font-light leading-relaxed">
            Create your account in seconds and start connecting with creators across all 47 counties.
          </p>

          {/* Features */}
          <div className="mt-10 space-y-4">
            {[
              "Share text & photo posts with your community",
              "Follow creators and build your tribe",
              "Discover trending content from across Kenya",
            ].map((feat, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 size={16} className="text-primary-gold shrink-0 mt-0.5" />
                <p className="text-[13px] text-white/60">{feat}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-12 lg:px-16 xl:px-24 py-10 relative overflow-y-auto">
        <div className="lg:hidden absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-primary-gold/8 blur-[120px] pointer-events-none" />

        {/* Mobile brand */}
        <div className="lg:hidden mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-[0.4em] uppercase text-primary-gold gold-glow mb-2">
            Kihumba
          </h1>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-custom font-medium">
            Create your account
          </p>
        </div>

        <div className="w-full max-w-md relative z-10">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">Create account</h2>
            <p className="text-sm text-muted-custom">Fill in your details to get started</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-muted-custom mb-2.5">
                Email Address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-custom/50" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  required
                  className="w-full bg-transparent pill-surface border border-custom rounded-xl pl-12 pr-5 py-4 text-[15px] text-[var(--text-main)] placeholder:text-muted-custom/40 focus:outline-none focus:border-primary-gold focus:ring-1 focus:ring-primary-gold/30 transition-all"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-muted-custom mb-2.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-custom/50" />
                <span className="absolute left-12 top-1/2 -translate-y-1/2 text-[14px] font-semibold text-muted-custom select-none">+254</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 9))}
                  placeholder="712345678"
                  required
                  className="w-full bg-transparent pill-surface border border-custom rounded-xl pl-[6.5rem] pr-5 py-4 text-[15px] text-[var(--text-main)] placeholder:text-muted-custom/40 focus:outline-none focus:border-primary-gold focus:ring-1 focus:ring-primary-gold/30 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-muted-custom mb-2.5">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-custom/50" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  required
                  className="w-full bg-transparent pill-surface border border-custom rounded-xl pl-12 pr-12 py-4 text-[15px] text-[var(--text-main)] placeholder:text-muted-custom/40 focus:outline-none focus:border-primary-gold focus:ring-1 focus:ring-primary-gold/30 transition-all"
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
              {/* Strength bar */}
              {password.length > 0 && (
                <div className="mt-3">
                  <div className="flex gap-1.5 mb-2">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          strengthScore >= level
                            ? level <= 1
                              ? "bg-red-400"
                              : level <= 2
                              ? "bg-orange-400"
                              : level <= 3
                              ? "bg-yellow-400"
                              : "bg-green-400"
                            : "bg-[var(--border-color)]"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <span className={`text-[10px] font-medium ${hasMinLength ? "text-green-400" : "text-muted-custom"}`}>
                      ✓ 6+ characters
                    </span>
                    <span className={`text-[10px] font-medium ${hasUppercase ? "text-green-400" : "text-muted-custom"}`}>
                      ✓ Uppercase
                    </span>
                    <span className={`text-[10px] font-medium ${hasNumber ? "text-green-400" : "text-muted-custom"}`}>
                      ✓ Number
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-muted-custom mb-2.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-custom/50" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  required
                  className={`w-full bg-transparent pill-surface border rounded-xl pl-12 pr-5 py-4 text-[15px] text-[var(--text-main)] placeholder:text-muted-custom/40 focus:outline-none focus:ring-1 transition-all ${
                    !passwordsMatch
                      ? "border-red-400/50 focus:border-red-400 focus:ring-red-400/30"
                      : "border-custom focus:border-primary-gold focus:ring-primary-gold/30"
                  }`}
                />
                {confirmPassword.length > 0 && passwordsMatch && (
                  <CheckCircle2 size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-green-400" />
                )}
              </div>
              {!passwordsMatch && (
                <p className="text-[11px] text-red-400 mt-2 font-medium">Passwords do not match</p>
              )}
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
              disabled={loading || !canSubmit}
              className="w-full bg-primary-gold text-black py-4 rounded-xl text-[13px] font-bold uppercase tracking-[0.25em] hover:brightness-110 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl shadow-primary-gold/20 mt-2"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Terms */}
          <p className="text-[10px] text-muted-custom text-center mt-5 leading-relaxed">
            By creating an account, you agree to our{" "}
            <span className="text-primary-gold cursor-pointer hover:underline">Terms</span> and{" "}
            <span className="text-primary-gold cursor-pointer hover:underline">Privacy Policy</span>
          </p>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-[var(--border-color)]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-custom">Already a member?</span>
            <div className="flex-1 h-px bg-[var(--border-color)]" />
          </div>

          <Link
            href="/login"
            className="block w-full py-4 rounded-xl border-2 border-primary-gold/20 text-[13px] font-bold uppercase tracking-[0.2em] text-primary-gold hover:bg-primary-gold/5 hover:border-primary-gold/40 transition-all active:scale-[0.98] text-center"
          >
            Sign In Instead
          </Link>
        </div>

        <p className="mt-10 text-[9px] text-muted-custom uppercase tracking-widest font-bold">
          Kihumba © 2026 — Made in Kenya 🇰🇪
        </p>
      </div>
    </div>
  );
}
