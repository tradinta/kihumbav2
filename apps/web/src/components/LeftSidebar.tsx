"use client";

import { useTheme, type Theme } from "@/context/ThemeContext";
import { usePostContext } from "@/context/PostContext";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  Store,
  ShoppingBag,
  MessageCircle,
  Bookmark,
  Star,
  Users,
  Megaphone,
  FilePenLine,
  Cog,
  Sparkles,
  Calendar,
} from "lucide-react";

const navItems = [
  { id: "home", icon: Building2, label: "Home", href: "/" },
  { id: "kao", icon: Store, label: "Kao", href: "/kao" },
  { id: "marketplace", icon: ShoppingBag, label: "Marketplace", href: "/marketplace" },
  { id: "events", icon: Calendar, label: "Events", href: "/events" },
  { id: "tribes", icon: Users, label: "Tribes", href: "/tribes" },
  { id: "messages", icon: MessageCircle, label: "Messages", href: "/messages" },
  { id: "settings", icon: Cog, label: "Settings", href: "/settings" },
];

const growthItems = [
  { id: "business", icon: Megaphone, label: "Business Suite", href: "/business" },
  { id: "studio", icon: Star, label: "Creator Studio", href: "/studio" },
  { id: "plus", icon: Sparkles, label: "Kihumba +", href: "/plus" },
];

const vaultItems = [
  { id: "drafts", icon: FilePenLine, label: "Drafts" },
  { id: "bookmarks", icon: Bookmark, label: "Bookmarks" },
];

const themes: { id: Theme; bg: string; ring: string; title: string }[] = [
  { id: "white", bg: "bg-white", ring: "border-black/10", title: "White Theme" },
  { id: "emerald", bg: "bg-emerald-900", ring: "border-primary-gold/30", title: "Emerald Theme" },
  { id: "dark", bg: "bg-zinc-950", ring: "border-white/10", title: "Dark Theme" },
];

interface LeftSidebarProps {
  collapsed?: boolean;
}

export default function LeftSidebar({ collapsed = false }: LeftSidebarProps) {
  const { theme, setTheme } = useTheme();
  const { setCreatePostOpen } = usePostContext();
  const pathname = usePathname();

  // ── Collapsed (icon-only) mode for Messages ──
  if (collapsed) {
    return (
      <aside className="hidden lg:flex flex-col items-center w-14 pt-8 pb-12 sticky-sidebar shrink-0 overflow-y-auto no-scrollbar gap-2">
        <div className="mb-6">
          <span className="text-sm font-bold tracking-[0.2em] uppercase text-primary-gold gold-glow select-none">K</span>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Link key={item.id} href={item.href} title={item.label}
                className={`flex items-center justify-center size-9 rounded transition-all ${
                  isActive
                    ? 'bg-[var(--sidebar-active)] text-primary-gold'
                    : 'text-muted-custom hover:text-primary-gold'
                }`}
              >
                <item.icon size={18} strokeWidth={1.5} />
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col items-center gap-2">
          {themes.map((t) => (
            <button key={t.id} onClick={() => setTheme(t.id)} title={t.title}
              className={`size-5 rounded-full ${t.bg} border ${t.ring} transition-transform hover:scale-110 ${
                theme === t.id ? "ring-2 ring-primary-gold ring-offset-1 ring-offset-transparent scale-110" : ""
              }`}
            />
          ))}
        </div>
      </aside>
    );
  }

  // ── Full sidebar ──
  return (
    <aside className="hidden lg:flex flex-col w-64 xl:w-72 pt-8 pb-12 sticky-sidebar shrink-0 overflow-y-auto no-scrollbar">
      <div className="mb-8 px-4">
        <h1 className="text-xl font-bold tracking-[0.3em] uppercase text-primary-gold gold-glow select-none">
          Kihumba
        </h1>
      </div>

      <nav className="space-y-1 mb-8">
        {navItems.map((item) => {
          const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          return (
            <Link
              key={item.id}
              href={item.href}
              className={
                isActive
                  ? "sidebar-item-active flex items-center gap-4 px-4 py-2.5"
                  : "flex items-center gap-4 px-4 py-2.5 text-muted-custom hover:text-primary-gold transition-colors"
              }
            >
              <item.icon size={20} strokeWidth={1.5} />
              <span className="text-[11px] font-bold uppercase tracking-widest">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mb-8">
        <h2 className="px-4 text-[9px] font-bold uppercase tracking-[0.3em] text-primary-gold/60 mb-3">
          Grown Suite
        </h2>
        <nav className="space-y-1">
          {growthItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.id}
                href={item.href}
                className={
                  isActive
                    ? "sidebar-item-active flex items-center gap-4 px-4 py-2.5"
                    : "flex items-center gap-4 px-4 py-2.5 text-muted-custom hover:text-primary-gold transition-colors"
                }
              >
                <item.icon size={20} strokeWidth={1.5} />
                <span className="text-[11px] font-bold uppercase tracking-widest">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mb-8">
        <h2 className="px-4 text-[9px] font-bold uppercase tracking-[0.3em] text-primary-gold/60 mb-3">
          The Vault
        </h2>
        <nav className="space-y-1">
          {vaultItems.map((item) => (
            <a
              key={item.id}
              href="#"
              className="flex items-center gap-4 px-4 py-2.5 text-muted-custom hover:text-primary-gold transition-colors"
            >
              <item.icon size={20} strokeWidth={1.5} />
              <span className="text-[11px] font-bold uppercase tracking-widest">{item.label}</span>
            </a>
          ))}
        </nav>
      </div>

      <div className="mt-auto px-4">
        <div className="flex items-center gap-3 p-3 card-surface rounded-lg mb-4">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              aria-label={t.title}
              title={t.title}
              className={`size-6 rounded-full ${t.bg} border ${t.ring} transition-transform hover:scale-110 ${
                theme === t.id ? "ring-2 ring-primary-gold ring-offset-1 ring-offset-transparent scale-110" : ""
              }`}
            />
          ))}
        </div>
        <button 
          onClick={() => setCreatePostOpen(true)}
          className="w-full bg-primary-gold text-black py-4 text-[10px] font-bold uppercase tracking-[0.3em] hover:brightness-110 transition-all rounded shadow-lg shadow-primary-gold/10 active:scale-[0.98]"
        >
          Curate
        </button>
      </div>
    </aside>
  );
}
