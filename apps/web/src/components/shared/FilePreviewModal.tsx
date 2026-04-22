"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Download, UserX } from 'lucide-react';
import Portal from './Portal';

interface FilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: {
    name: string;
    src: string;
    size: number;
  } | null;
}

export default function FilePreviewModal({ isOpen, onClose, file }: FilePreviewModalProps) {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (isOpen) setIsLoading(true);
  }, [isOpen, file]);

  if (!file) return null;

  const isPdf = file.src.toLowerCase().endsWith('.pdf');

  return (
    <AnimatePresence>
      {isOpen && (
        <Portal>
          <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 md:p-10">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={onClose}
            />

            {/* Modal Container */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.98, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 20 }}
              className="relative w-full h-full max-w-5xl bg-main border border-white/10 rounded-2xl shadow-[0_40px_120px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col z-[601]"
            >
              {/* Header */}
              <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-xl bg-primary-gold/10 flex items-center justify-center text-primary-gold border border-primary-gold/10">
                    <FileText size={20} strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[11px] font-bold text-main truncate max-w-[150px] md:max-w-md uppercase tracking-widest">{file.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-[9px] text-primary-gold font-bold uppercase tracking-widest">Inspection Node</p>
                      <span className="text-[9px] text-muted-custom">·</span>
                      <p className="text-[9px] text-muted-custom font-medium uppercase tracking-tight">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a 
                    href={file.src} 
                    download
                    className="h-10 px-5 rounded-xl bg-primary-gold text-black text-[9px] font-bold uppercase tracking-widest flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary-gold/10"
                  >
                    <Download size={14} /> Download
                  </a>
                  <button 
                    onClick={onClose}
                    className="size-10 rounded-xl bg-white/5 border border-white/10 text-main flex items-center justify-center hover:bg-white/10 transition-all"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Preview Body */}
              <div className="flex-1 bg-black/5 relative">
                {isLoading && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-main/80 backdrop-blur-sm">
                    <div className="w-64 h-2 bg-white/5 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ x: '-100%' }}
                         animate={{ x: '100%' }}
                         transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                         className="w-full h-full bg-primary-gold/40"
                       />
                    </div>
                    <p className="text-[9px] font-bold text-primary-gold uppercase tracking-[0.3em] animate-pulse">Syncing Content...</p>
                  </div>
                )}

                <iframe 
                  src={isPdf ? `${file.src}#toolbar=0` : `https://docs.google.com/viewer?url=${encodeURIComponent(file.src)}&embedded=true`}
                  className={`w-full h-full border-0 transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                  title={file.name}
                  onLoad={() => setIsLoading(false)}
                />
              </div>
            </motion.div>
          </div>
        </Portal>
      )}
    </AnimatePresence>
  );
}
