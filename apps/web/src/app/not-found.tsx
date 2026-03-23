'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Search, ArrowLeft, Compass, MessageCircle } from 'lucide-react';

const MESSAGES = [
  "The link you followed may be broken, or the page may have been removed.",
  "This page doesn't exist. It may have been deleted by the author.",
  "Whatever was here has gone off the grid.",
  "This trail has gone cold. The content may have been moved or removed.",
];

export default function NotFound() {
  const [msg] = useState(() => MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' }));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(197,160,89,0.06) 0%, transparent 70%)' }} />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 max-w-md w-full text-center"
      >
        {/* Gold ring icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, delay: 0.2, type: 'spring', stiffness: 120 }}
          className="mx-auto mb-8 size-24 rounded-full border-2 border-primary-gold/30 flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, rgba(197,160,89,0.08) 0%, transparent 100%)' }}
        >
          <Compass size={40} className="text-primary-gold/60" strokeWidth={1} />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-xl font-bold tracking-[0.2em] uppercase text-primary-gold gold-glow mb-3"
        >
          Page Not Found
        </motion.h1>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-[11px] font-bold text-muted-custom leading-relaxed mb-8 max-w-xs mx-auto"
        >
          {msg}
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-col gap-2 mb-8"
        >
          <Link href="/">
            <button className="w-full py-3 bg-primary-gold text-black rounded-lg text-[10px] font-bold uppercase tracking-[0.2em] hover:brightness-110 transition-all active:scale-[0.98] shadow-lg shadow-primary-gold/10 flex items-center justify-center gap-2">
              <Home size={14} /> Go Home
            </button>
          </Link>

          <div className="grid grid-cols-2 gap-2">
            <Link href="/kao">
              <button className="w-full py-2.5 card-surface rounded-lg text-[9px] font-bold uppercase tracking-widest text-muted-custom hover:text-primary-gold hover:border-primary-gold/30 transition-all flex items-center justify-center gap-1.5">
                <Search size={12} /> Explore Kao
              </button>
            </Link>
            <Link href="/marketplace">
              <button className="w-full py-2.5 card-surface rounded-lg text-[9px] font-bold uppercase tracking-widest text-muted-custom hover:text-primary-gold hover:border-primary-gold/30 transition-all flex items-center justify-center gap-1.5">
                <Search size={12} /> Marketplace
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="h-px bg-[var(--border-color)] mb-6"
        />

        {/* Footer hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-[9px] font-bold uppercase tracking-[0.3em] text-muted-custom/40"
        >
          Kihumba · {time}
        </motion.p>
      </motion.div>
    </div>
  );
}
