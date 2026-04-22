'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, XCircle, X, Zap } from 'lucide-react';
import { useSnackbar, SnackbarMessage } from '@/context/SnackbarContext';

export default function SnackbarContainer() {
  const { messages, hide } = useSnackbar();

  return (
    <div className="fixed bottom-24 md:bottom-8 right-0 md:right-8 z-[201] flex flex-col items-end gap-2.5 px-4 md:px-0 pointer-events-none w-full md:w-auto">
      <AnimatePresence mode="popLayout">
        {messages.map((msg) => (
          <SnackbarItem key={msg.id} msg={msg} onHide={() => hide(msg.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function SnackbarItem({ msg, onHide }: { msg: SnackbarMessage; onHide: () => void }) {
  const [progress, setProgress] = useState(100);
  const duration = msg.duration || 5000;

  useEffect(() => {
    if (duration === 0) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);

      if (elapsed >= duration) {
        clearInterval(interval);
      }
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [duration]);

  const icons = {
    success: <CheckCircle2 className="text-primary-gold" size={18} strokeWidth={3} />,
    error: <XCircle className="text-red-400" size={18} />,
    info: <Zap className="text-blue-400" size={18} />,
    warning: <AlertCircle className="text-orange-400" size={18} />,
  };

  const isSuccess = msg.type === 'success';

  return (
    <motion.div
      initial={{ opacity: 0, x: 40, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95, transition: { duration: 0.2 } }}
      layout
      className="pointer-events-auto relative group"
    >
      <div className={`w-full md:w-72 card-surface border rounded-lg overflow-hidden shadow-2xl backdrop-blur-2xl transition-all duration-500 ${isSuccess ? 'border-primary-gold/30 gold-glow' : 'border-white/10'}`}>
        <div className="p-4 flex gap-3.5">
          <div className="shrink-0 mt-0.5">
            {icons[msg.type]}
          </div>
          
          <div className="flex-1 space-y-3">
            <p className="text-[10px] font-bold text-white uppercase tracking-widest leading-relaxed">
              {msg.message}
            </p>

            {msg.action && (
              <button
                onClick={() => {
                  msg.action?.onClick();
                  onHide();
                }}
                className="h-7 px-4 rounded bg-primary-gold text-black text-[9px] font-black uppercase tracking-widest hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-primary-gold/10"
              >
                {msg.action.label}
              </button>
            )}
          </div>

          <button 
            onClick={onHide}
            className="shrink-0 size-6 rounded-md flex items-center justify-center text-muted-custom hover:text-white hover:bg-white/5 transition-all"
          >
            <X size={14} />
          </button>
        </div>

        {/* Liquid Gold Timer Bar */}
        {duration !== 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-white/5">
            <motion.div 
                className="h-full bg-primary-gold"
                style={{ width: `${progress}%`, boxShadow: '0 0 10px #D4AF37' }}
                initial={{ width: '100%' }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: 'linear', duration: 0.016 }}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
