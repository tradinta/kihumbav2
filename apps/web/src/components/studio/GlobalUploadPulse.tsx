"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, CheckCircle2, Zap } from 'lucide-react';
import { useUploads } from '@/context/UploadContext';

export default function GlobalUploadPulse() {
    const { uploads } = useUploads();
    const activeUploads = uploads.filter(u => u.status === 'UPLOADING' || u.status === 'PROCESSING');
    
    if (activeUploads.length === 0) return null;

    return (
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-primary-gold/10 border border-primary-gold/20 shadow-lg shadow-primary-gold/5"
        >
            <div className="relative">
                <div className="size-5 rounded-full bg-primary-gold flex items-center justify-center text-black">
                    <Upload size={12} strokeWidth={3} />
                </div>
                <div className="absolute inset-0 rounded-full border border-primary-gold animate-ping opacity-40" />
            </div>
            
            <div className="flex flex-col">
                <span className="text-[9px] font-bold text-white uppercase tracking-widest leading-none">
                    Syncing {activeUploads.length} {activeUploads.length === 1 ? 'Video' : 'Videos'}
                </span>
                <div className="flex items-center gap-2 mt-1">
                    <div className="h-1 w-24 bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${activeUploads[0].progress}%` }}
                            className="h-full bg-primary-gold shadow-[0_0_8px_rgba(212,175,55,0.5)]"
                        />
                    </div>
                    <span className="text-[8px] font-bold text-primary-gold tabular-nums">{activeUploads[0].progress}%</span>
                </div>
            </div>
        </motion.div>
    );
}
