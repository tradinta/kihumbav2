"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Mail, Video, Search } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import UserIdentity from "./shared/UserIdentity";
import MessagesPreview from "./topbar/MessagesPreview";
import NotificationsPreview from "./topbar/NotificationsPreview";
import { UI_LABELS } from "@/lib/constants";

type ActivePanel = 'messages' | 'notifications' | null;

export default function TopBar() {
  const { user } = useAuth();
  const router = useRouter();
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActivePanel(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggle = (panel: ActivePanel) => {
    setActivePanel(prev => prev === panel ? null : panel);
  };

  const profileUrl = user?.username ? `/profile/${user.username}` : '/profile';
  const avatarUrl = user?.image || user?.avatar || "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=100"; // Fallback to a better person of color placeholder as per user's image

  return (
    <div className="sticky top-4 z-50 px-4 mb-8">
      <div className="max-w-[850px] mx-auto h-14 nav-surface rounded-md border border-custom shadow-xl shadow-black/20 flex items-center justify-between px-2">
        {/* Left: Branding & Search */}
        <div className="flex items-center gap-4 pl-2 flex-1">
          <Link href="/" className="h-9 px-3 rounded-sm bg-primary-gold/15 border border-primary-gold/30 flex items-center justify-center transition-all hover:bg-primary-gold/20 active:scale-95 shrink-0">
            <span className="text-[11px] font-bold uppercase tracking-widest text-primary-gold">{UI_LABELS.BRAND}</span>
          </Link>

          <div className="hidden md:flex flex-1 max-w-sm relative group">
            <input 
              type="text" 
              placeholder={UI_LABELS.SEARCH_PLACEHOLDER} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full h-9 bg-black/10 border border-white/5 rounded-md px-4 pl-9 text-[11px] font-bold uppercase tracking-widest text-main placeholder:text-muted-custom focus:outline-none focus:border-primary-gold/40 focus:bg-black/20 transition-all"
            />
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-custom group-focus-within:text-primary-gold transition-colors" />
          </div>
        </div>

        {/* Right: Actions */}
        <div ref={containerRef} className="flex items-center gap-1 relative pr-1">
          <button
            onClick={() => toggle('notifications')}
            aria-label="Notifications"
            className={`p-2 transition-all relative active:scale-90 ${
              activePanel === 'notifications' ? 'text-primary-gold' : 'text-primary-gold/60 hover:text-primary-gold'
            }`}
          >
            <Bell size={18} strokeWidth={1.5} />
            <span className="absolute top-2 right-2 size-1.5 bg-primary-gold rounded-full ring-2 ring-black" />
          </button>

          <button
            onClick={() => toggle('messages')}
            aria-label="Messages"
            className={`p-2 transition-all active:scale-90 ${
              activePanel === 'messages' ? 'text-primary-gold' : 'text-primary-gold/60 hover:text-primary-gold'
            }`}
          >
            <Mail size={18} strokeWidth={1.5} />
          </button>

          <UserIdentity 
            user={{
              ...user,
              avatar: user?.image || user?.avatar,
              subscriptionTier: user?.subscriptionTier,
              accountType: user?.accountType,
              hasStatus: false // TopBar usually doesn't show the user's own status ring here
            } as any} 
            size="sm" 
            hideName
            hideHandle 
            className="ml-1"
          />

          {/* Dropdown panels */}
          <AnimatePresence>
            {activePanel === 'notifications' && (
              <NotificationsPreview onClose={() => setActivePanel(null)} />
            )}
            {activePanel === 'messages' && (
              <MessagesPreview onClose={() => setActivePanel(null)} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
