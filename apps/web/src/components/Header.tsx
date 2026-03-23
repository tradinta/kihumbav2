"use client";

import { useTheme, type Theme } from "@/context/ThemeContext";

const themes: { id: Theme; bg: string; ring: string; label: string }[] = [
  { id: "white", bg: "bg-white", ring: "border-black/10", label: "Light theme" },
  { id: "emerald", bg: "bg-emerald-900", ring: "border-primary-gold/30", label: "Emerald theme" },
  { id: "dark", bg: "bg-zinc-900", ring: "border-white/20", label: "Dark theme" },
];

export default function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 nav-surface border-b border-custom px-4 py-3">
      <div className="max-w-xl mx-auto flex items-center gap-3">
        {/* Avatar */}
        <div className="shrink-0">
          <div className="size-10 rounded-full border-2 border-primary-gold/50 p-0.5 overflow-hidden">
            <img
              alt="Your profile"
              className="w-full h-full object-cover rounded-full"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuACS7Pn4iKQ0KOlR1S8CYAz3G5AtrQFQeldiq_FxCwzPzifr7lC8VcP4cx8NWgPauWr29v2JABOuDh7MJlYoUD2AZQcDv6qPQies6wlw-eXdANjE7VOyl_K0XrTv2_pHw0xpX3l2kcWrRN086OiuK0Yzq4Fo6Cw50gr9mRwan6v31DlkYgfmZnEH1JSlrlaUpnMIf11dWIQP2TWsojfqfw7Kno44pj3Zro6Cj2cLVMVMTRRuBR0Kbh2GUluE6tj1euLnWcQOI3GDFFD"
            />
          </div>
        </div>

        {/* Brand + Theme Switcher */}
        <div className="flex-1 flex items-center gap-3">
          <div className="flex items-center gap-1 pill-surface rounded-full p-1 border border-custom">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                aria-label={t.label}
                className={`size-5 rounded-full ${t.bg} border ${t.ring} transition-all duration-200 ${
                  theme === t.id ? "scale-110 ring-1 ring-primary-gold ring-offset-1 ring-offset-transparent" : "opacity-60 hover:opacity-100"
                }`}
              />
            ))}
          </div>
          <h1 className="text-xs font-bold tracking-[0.25em] uppercase text-primary-gold gold-glow select-none">
            Kihumba
          </h1>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-0.5">
          <button
            aria-label="Search"
            className="p-2 text-muted-custom hover:text-primary-gold transition-colors duration-200 active:scale-90"
          >
            <span className="material-symbols-outlined text-[22px]">search</span>
          </button>
          <button
            aria-label="Notifications"
            className="p-2 text-muted-custom hover:text-primary-gold transition-colors duration-200 relative active:scale-90"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 size-2 bg-primary-gold rounded-full ring-2 ring-[var(--nav-bg)]" />
          </button>
          <button
            aria-label="Messages"
            className="p-2 text-muted-custom hover:text-primary-gold transition-colors duration-200 active:scale-90"
          >
            <span className="material-symbols-outlined text-[22px]">mail</span>
          </button>
        </div>
      </div>
    </header>
  );
}
