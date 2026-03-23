"use client";

import { useState } from "react";
import { Building2, Store, Crown, Menu, Plus } from "lucide-react";

const navItems = [
  { id: "home", icon: Building2, label: "Home" },
  { id: "kao", icon: Store, label: "Kao" },
  { id: "growth", icon: Crown, label: "Growth" },
  { id: "more", icon: Menu, label: "More" },
];

export default function BottomNav() {
  const [active, setActive] = useState("home");

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 nav-surface border-t border-custom px-4 pb-8 pt-3 z-50">
      <div className="flex items-center justify-between max-w-xl mx-auto">
        {navItems.slice(0, 2).map((item) => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            aria-label={item.label}
            className={`flex flex-col items-center gap-1 transition-colors duration-200 ${
              active === item.id ? "text-primary-gold" : "text-muted-custom"
            }`}
          >
            <item.icon size={24} strokeWidth={active === item.id ? 2 : 1.5} />
            <span className="text-[8px] font-bold uppercase tracking-widest">{item.label}</span>
          </button>
        ))}

        <button
          aria-label="Create new post"
          className="size-12 rounded bg-primary-gold text-black flex items-center justify-center -mt-8 shadow-xl border border-white/20 active:scale-95 transition-all"
        >
          <Plus size={28} strokeWidth={2} />
        </button>

        {navItems.slice(2).map((item) => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            aria-label={item.label}
            className={`flex flex-col items-center gap-1 transition-colors duration-200 ${
              active === item.id ? "text-primary-gold" : "text-muted-custom"
            }`}
          >
            <item.icon size={24} strokeWidth={active === item.id ? 2 : 1.5} />
            <span className="text-[8px] font-bold uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
