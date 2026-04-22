'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}

export default function ConfirmModal({
  isOpen, onClose, onConfirm,
  title, description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false
}: ConfirmModalProps) {
  const colors = {
    danger: 'bg-red-500 text-white hover:bg-red-600',
    warning: 'bg-primary-gold text-black hover:brightness-110',
    info: 'bg-blue-500 text-white hover:bg-blue-600'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-[#050505] border border-white/10 rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className={`size-12 rounded-full flex items-center justify-center ${variant === 'danger' ? 'bg-red-500/10 text-red-500' : 'bg-primary-gold/10 text-primary-gold'}`}>
                <AlertTriangle size={24} />
              </div>
              
              <div className="space-y-1">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">{title}</h3>
                <p className="text-[10px] text-muted-custom font-bold uppercase tracking-widest leading-relaxed">
                  {description}
                </p>
              </div>

              <div className="flex flex-col w-full gap-2 pt-4">
                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className={`w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${colors[variant]} flex items-center justify-center gap-2`}
                >
                  {loading && <div className="size-3 border-2 border-current border-t-transparent rounded-full animate-spin" />}
                  {confirmText}
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-muted-custom hover:text-white transition-all"
                >
                  {cancelText}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
