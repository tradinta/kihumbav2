'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function MessagesInboxPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[var(--bg-color)]">
      <div className="size-20 rounded-xl bg-primary-gold/5 border border-primary-gold/15 flex items-center justify-center mb-6 shadow-2xl shadow-primary-gold/5">
        <MessageCircle size={32} className="text-primary-gold/30 gold-glow" />
      </div>
      
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-muted-custom">
          Kihumba Vault
        </h2>
        <p className="text-[10px] text-muted-custom/60 font-bold uppercase tracking-widest max-w-[200px] leading-relaxed">
          Select a secure channel to begin messaging.
        </p>
      </div>

      {/* Decorative lines */}
      <div className="mt-12 flex items-center gap-4 opacity-10">
        <div className="w-12 h-px bg-primary-gold" />
        <div className="size-1 rounded-full bg-primary-gold" />
        <div className="w-12 h-px bg-primary-gold" />
      </div>
    </div>
  );
}
