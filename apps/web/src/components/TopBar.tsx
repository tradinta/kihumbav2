"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Mail } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import MessagesPreview from "./topbar/MessagesPreview";
import NotificationsPreview from "./topbar/NotificationsPreview";

type ActivePanel = 'messages' | 'notifications' | null;

export default function TopBar() {
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-custom">
      {/* Profile — rectangular box with first name */}
      <div className="flex items-center gap-3">
        <div className="h-9 px-3 rounded bg-primary-gold/15 border border-primary-gold/30 flex items-center justify-center">
          <span className="text-[11px] font-bold uppercase tracking-widest text-primary-gold">Kihumba</span>
        </div>
      </div>

      {/* Actions */}
      <div ref={containerRef} className="flex items-center gap-1 relative">
        {/* Notifications */}
        <button
          onClick={() => toggle('notifications')}
          aria-label="Notifications"
          className={`p-2 transition-colors relative active:scale-90 ${
            activePanel === 'notifications' ? 'text-primary-gold' : 'text-muted-custom hover:text-primary-gold'
          }`}
        >
          <Bell size={20} strokeWidth={1.5} />
          <span className="absolute top-1.5 right-1.5 size-2 bg-primary-gold rounded-full ring-2 ring-[var(--bg-color)]" />
        </button>

        {/* Messages */}
        <button
          onClick={() => toggle('messages')}
          aria-label="Messages"
          className={`p-2 transition-colors active:scale-90 ${
            activePanel === 'messages' ? 'text-primary-gold' : 'text-muted-custom hover:text-primary-gold'
          }`}
        >
          <Mail size={20} strokeWidth={1.5} />
        </button>

        {/* Profile */}
        <button
          aria-label="Your profile"
          className="ml-1 h-8 px-2.5 rounded border border-primary-gold/30 bg-primary-gold/10 flex items-center justify-center hover:bg-primary-gold/20 transition-colors active:scale-95"
        >
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary-gold">You</span>
        </button>

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
  );
}
