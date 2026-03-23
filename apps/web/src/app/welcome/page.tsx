"use client";

import { useState } from "react";
import { ArrowRight, ArrowLeft, Loader2, Check, User, Calendar, MapPin, ChevronDown, Search, Sparkles } from "lucide-react";

const KENYAN_COUNTIES = [
  "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo-Marakwet", "Embu",
  "Garissa", "Homa Bay", "Isiolo", "Kajiado", "Kakamega", "Kericho",
  "Kiambu", "Kilifi", "Kirinyaga", "Kisii", "Kisumu", "Kitui",
  "Kwale", "Laikipia", "Lamu", "Machakos", "Makueni", "Mandera",
  "Marsabit", "Meru", "Migori", "Mombasa", "Murang'a", "Nairobi",
  "Nakuru", "Nandi", "Narok", "Nyamira", "Nyandarua", "Nyeri",
  "Samburu", "Siaya", "Taita-Taveta", "Tana River", "Tharaka-Nithi",
  "Trans-Nzoia", "Turkana", "Uasin Gishu", "Vihiga", "Wajir", "West Pokot",
];

const GENDERS = [
  { value: "MALE", label: "Male", emoji: "👨" },
  { value: "FEMALE", label: "Female", emoji: "👩" },
  { value: "OTHER", label: "Other", emoji: "🧑" },
  { value: "PREFER_NOT_TO_SAY", label: "Skip", emoji: "🤐" },
];

export default function WelcomePage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");

  const [county, setCounty] = useState("");
  const [countySearch, setCountySearch] = useState("");
  const [showCountyDropdown, setShowCountyDropdown] = useState(false);

  const filteredCounties = KENYAN_COUNTIES.filter((c) =>
    c.toLowerCase().includes(countySearch.toLowerCase())
  );

  const handleUsernameCheck = (value: string) => {
    const sanitized = value.toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 20);
    setUsername(sanitized);
    setUsernameAvailable(null);
    if (sanitized.length >= 3) {
      setCheckingUsername(true);
      setTimeout(() => {
        setUsernameAvailable(true);
        setCheckingUsername(false);
      }, 600);
    }
  };

  const canProceed = () => {
    if (step === 1) return username.length >= 3 && usernameAvailable;
    if (step === 2) return dob && gender;
    if (step === 3) return county;
    return false;
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setLoading(true);
      setTimeout(() => setLoading(false), 1500);
    }
  };

  return (
    <div className="min-h-screen bg-page flex">
      {/* Left Panel — Progress visual (desktop) */}
      <div className="hidden lg:flex lg:w-[40%] xl:w-[45%] relative overflow-hidden flex-col items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-gold/5 via-transparent to-primary-gold/3" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-primary-gold/8 blur-[150px] pointer-events-none" />

        <div className="relative z-10 px-12 xl:px-20 text-center max-w-md">
          <h1 className="text-4xl font-bold tracking-[0.3em] uppercase text-primary-gold gold-glow mb-8">
            Kihumba
          </h1>

          {/* Visual progress */}
          <div className="flex flex-col items-center gap-0 mb-10">
            {[
              { num: 1, title: "Choose your identity", desc: "Pick a unique username" },
              { num: 2, title: "Tell us about you", desc: "Date of birth & gender" },
              { num: 3, title: "Your location", desc: "Which county are you in?" },
            ].map((s, i) => (
              <div key={s.num} className="flex items-start gap-4 w-full max-w-xs text-left">
                <div className="flex flex-col items-center">
                  <div
                    className={`size-10 rounded-full flex items-center justify-center text-[13px] font-bold transition-all duration-500 ${
                      step > s.num
                        ? "bg-primary-gold text-black"
                        : step === s.num
                        ? "bg-primary-gold/20 text-primary-gold border-2 border-primary-gold shadow-lg shadow-primary-gold/20"
                        : "bg-[var(--pill-bg)] text-muted-custom border border-custom"
                    }`}
                  >
                    {step > s.num ? <Check size={18} strokeWidth={3} /> : s.num}
                  </div>
                  {i < 2 && (
                    <div className={`w-0.5 h-12 transition-colors duration-500 ${step > s.num ? "bg-primary-gold" : "bg-[var(--border-color)]"}`} />
                  )}
                </div>
                <div className="pt-2">
                  <p className={`text-[13px] font-bold transition-colors ${step >= s.num ? "text-[var(--text-main)]" : "text-muted-custom"}`}>
                    {s.title}
                  </p>
                  <p className="text-[11px] text-muted-custom mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-primary-gold to-transparent mx-auto mb-4" />
          <p className="text-[11px] text-muted-custom">Almost there — {3 - step === 0 ? "last step!" : `${3 - step} steps to go`}</p>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-12 lg:px-16 xl:px-24 py-10 relative">
        <div className="lg:hidden absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-primary-gold/8 blur-[120px] pointer-events-none" />

        {/* Mobile header */}
        <div className="lg:hidden mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-[0.4em] uppercase text-primary-gold gold-glow mb-1">
            Kihumba
          </h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-custom">Profile Setup</p>
        </div>

        {/* Mobile progress bar */}
        <div className="lg:hidden flex items-center gap-2 mb-8 w-full max-w-md">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${step >= s ? "bg-primary-gold" : "bg-[var(--border-color)]"}`} />
          ))}
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Step 1: Username */}
          {step === 1 && (
            <div className="animate-fade-in-up">
              <div className="mb-8">
                <div className="size-16 rounded-2xl bg-primary-gold/10 border border-primary-gold/20 flex items-center justify-center mb-5">
                  <User size={28} className="text-primary-gold" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">Choose your username</h2>
                <p className="text-sm text-muted-custom">This is how people will find and mention you</p>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-muted-custom mb-2.5">
                  Username
                </label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-primary-gold text-lg font-bold select-none">@</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => handleUsernameCheck(e.target.value)}
                    placeholder="your_username"
                    maxLength={20}
                    autoFocus
                    className="w-full bg-transparent pill-surface border border-custom rounded-xl pl-11 pr-14 py-4 text-[16px] text-[var(--text-main)] placeholder:text-muted-custom/40 focus:outline-none focus:border-primary-gold focus:ring-1 focus:ring-primary-gold/30 transition-all"
                  />
                  {username.length >= 3 && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      {checkingUsername ? (
                        <Loader2 size={18} className="animate-spin text-muted-custom" />
                      ) : usernameAvailable ? (
                        <div className="flex items-center gap-1 text-green-400">
                          <Check size={18} strokeWidth={3} />
                        </div>
                      ) : (
                        <span className="text-[11px] text-red-400 font-bold uppercase">Taken</span>
                      )}
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-muted-custom mt-2.5">3–20 characters • Letters, numbers, underscores</p>

                {/* Preview */}
                {username.length >= 3 && usernameAvailable && (
                  <div className="mt-5 card-surface rounded-xl p-4 flex items-center gap-3">
                    <div className="size-10 rounded-full bg-primary-gold/15 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary-gold uppercase">{username[0]}</span>
                    </div>
                    <div>
                      <p className="text-[13px] font-bold">@{username}</p>
                      <p className="text-[10px] text-muted-custom">Your profile will appear like this</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Personal */}
          {step === 2 && (
            <div className="animate-fade-in-up">
              <div className="mb-8">
                <div className="size-16 rounded-2xl bg-primary-gold/10 border border-primary-gold/20 flex items-center justify-center mb-5">
                  <Calendar size={28} className="text-primary-gold" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">Personal details</h2>
                <p className="text-sm text-muted-custom">Help us personalize your experience</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-muted-custom mb-2.5">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    max={new Date(new Date().setFullYear(new Date().getFullYear() - 13)).toISOString().split("T")[0]}
                    className="w-full bg-transparent pill-surface border border-custom rounded-xl px-5 py-4 text-[15px] text-[var(--text-main)] focus:outline-none focus:border-primary-gold focus:ring-1 focus:ring-primary-gold/30 transition-all"
                  />
                  <p className="text-[11px] text-muted-custom mt-2">You must be at least 13 years old</p>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-muted-custom mb-3">
                    Gender
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {GENDERS.map((g) => (
                      <button
                        key={g.value}
                        type="button"
                        onClick={() => setGender(g.value)}
                        className={`py-4 px-4 rounded-xl text-[13px] font-bold transition-all border-2 active:scale-95 flex items-center justify-center gap-2 ${
                          gender === g.value
                            ? "bg-primary-gold/15 border-primary-gold/50 text-primary-gold shadow-lg shadow-primary-gold/10"
                            : "pill-surface border-custom text-muted-custom hover:border-primary-gold/20 hover:text-[var(--text-main)]"
                        }`}
                      >
                        <span className="text-lg">{g.emoji}</span>
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: County */}
          {step === 3 && (
            <div className="animate-fade-in-up">
              <div className="mb-8">
                <div className="size-16 rounded-2xl bg-primary-gold/10 border border-primary-gold/20 flex items-center justify-center mb-5">
                  <MapPin size={28} className="text-primary-gold" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">Where in Kenya? 🇰🇪</h2>
                <p className="text-sm text-muted-custom">Connect with people near you</p>
              </div>

              <div className="relative">
                <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-muted-custom mb-2.5">
                  Your County
                </label>
                <button
                  type="button"
                  onClick={() => setShowCountyDropdown(!showCountyDropdown)}
                  className="w-full bg-transparent pill-surface border border-custom rounded-xl px-5 py-4 text-[15px] text-left flex items-center justify-between focus:outline-none focus:border-primary-gold transition-all"
                >
                  <span className={county ? "text-[var(--text-main)] font-medium" : "text-muted-custom/40"}>
                    {county || "Select your county"}
                  </span>
                  <ChevronDown size={18} className={`text-muted-custom transition-transform duration-200 ${showCountyDropdown ? "rotate-180" : ""}`} />
                </button>

                {showCountyDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 card-surface rounded-xl border border-custom shadow-2xl z-50 max-h-72 overflow-hidden flex flex-col">
                    <div className="p-3 border-b border-custom">
                      <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-custom" />
                        <input
                          type="text"
                          value={countySearch}
                          onChange={(e) => setCountySearch(e.target.value)}
                          placeholder="Search counties..."
                          autoFocus
                          className="w-full bg-transparent pill-surface border border-custom rounded-lg pl-9 pr-4 py-2.5 text-[13px] text-[var(--text-main)] placeholder:text-muted-custom/40 focus:outline-none focus:border-primary-gold transition-all"
                        />
                      </div>
                    </div>
                    <div className="overflow-y-auto flex-1">
                      {filteredCounties.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => {
                            setCounty(c);
                            setShowCountyDropdown(false);
                            setCountySearch("");
                          }}
                          className={`w-full text-left px-5 py-3 text-[13px] transition-colors flex items-center justify-between ${
                            county === c
                              ? "bg-primary-gold/10 text-primary-gold font-bold"
                              : "text-[var(--text-main)] hover:bg-primary-gold/5"
                          }`}
                        >
                          {c}
                          {county === c && <Check size={16} className="text-primary-gold" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {county && (
                <div className="mt-5 card-surface rounded-xl p-4 flex items-center gap-3">
                  <div className="size-10 rounded-full bg-primary-gold/15 flex items-center justify-center">
                    <MapPin size={18} className="text-primary-gold" />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold">{county} County</p>
                    <p className="text-[10px] text-muted-custom">You can change this later in settings</p>
                  </div>
                </div>
              )}

              {county && (
                <div className="mt-5 bg-primary-gold/5 border border-primary-gold/10 rounded-xl p-4 flex items-start gap-3">
                  <Sparkles size={16} className="text-primary-gold shrink-0 mt-0.5" />
                  <p className="text-[12px] text-muted-custom leading-relaxed">
                    You&apos;re all set! Tap <strong className="text-primary-gold">Complete Setup</strong> to start exploring Kihumba.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-6 py-4 rounded-xl border-2 border-custom text-[13px] font-bold uppercase tracking-[0.15em] text-muted-custom hover:text-primary-gold hover:border-primary-gold/30 transition-all active:scale-[0.98] flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                Back
              </button>
            )}
            <button
              type="button"
              onClick={handleNext}
              disabled={!canProceed() || loading}
              className="flex-1 bg-primary-gold text-black py-4 rounded-xl text-[13px] font-bold uppercase tracking-[0.25em] hover:brightness-110 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl shadow-primary-gold/20"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : step === 3 ? (
                <>
                  Complete Setup
                  <Sparkles size={16} />
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>

        <p className="mt-10 text-[9px] text-muted-custom uppercase tracking-widest font-bold">
          Step {step} of 3
        </p>
      </div>
    </div>
  );
}
