'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'error' | 'success' | 'info';
  onAction?: () => void;
  actionLabel?: string;
}

export default function StatusModal({ 
  isOpen, onClose, title, message, type = 'error',
  onAction, actionLabel 
}: StatusModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="relative w-full max-w-sm card-surface border border-custom rounded-sm overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)]"
          >
            {/* Top Gold Bar */}
            <div className="h-1 w-full bg-gradient-to-r from-primary-gold/0 via-primary-gold to-primary-gold/0" />

            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-muted-custom hover:text-white transition-all hover:rotate-90"
            >
              <X size={20} />
            </button>

            <div className="p-10 flex flex-col items-center text-center">
               <div className={`size-20 rounded-full flex items-center justify-center mb-8 relative ${
                 type === 'error' ? 'bg-red-500/10 text-red-500' : 
                 type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 
                 'bg-primary-gold/10 text-primary-gold'
               }`}>
                  <div className="absolute inset-0 rounded-full blur-2xl opacity-20 bg-current" />
                  {type === 'error' && <AlertTriangle size={36} />}
                  {type === 'success' && <CheckCircle2 size={36} />}
                  {type === 'info' && <Info size={36} />}
               </div>

               <h2 className="text-base font-black uppercase tracking-[0.3em] text-main mb-4">
                 {title}
               </h2>
               
               <p className="text-[11px] text-muted-custom font-bold leading-relaxed tracking-widest uppercase opacity-60">
                 {message}
               </p>

                <div className="flex flex-col w-full gap-3 mt-10">
                   {onAction && actionLabel && (
                     <button 
                       onClick={onAction}
                       className="h-12 w-full bg-white/5 border border-white/10 text-white rounded-sm font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/10 transition-all"
                     >
                       {actionLabel}
                     </button>
                   )}
                   <button 
                     onClick={onClose}
                     className="h-12 w-full bg-primary-gold text-black rounded-sm font-black text-[10px] uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary-gold/10"
                   >
                     Acknowledge
                   </button>
                </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
