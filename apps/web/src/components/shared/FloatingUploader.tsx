'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, Loader2, Minimize2, Maximize2 } from 'lucide-react';
import { useUploads } from '@/context/UploadContext';

export default function FloatingUploader() {
  const { uploads, cancelUpload, clearUpload } = useUploads();
  const [minimized, setMinimized] = React.useState(false);

  // Auto-clear successful uploads to let the Snackbar take over
  React.useEffect(() => {
    uploads.forEach(task => {
      if (task.status === 'SUCCESS') {
        const timer = setTimeout(() => {
          clearUpload(task.id);
        }, 3000);
        return () => clearTimeout(timer);
      }
    });
  }, [uploads, clearUpload]);

  if (uploads.length === 0) return null;

  return (
    <div className="fixed bottom-24 lg:bottom-12 right-6 z-[200] flex flex-col items-end gap-3 pointer-events-none">
      <AnimatePresence>
        {uploads.map((task) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ 
                opacity: 1, 
                y: 0, 
                scale: 1,
                height: minimized ? 64 : 'auto',
                width: minimized ? 64 : 320
            }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className="card-surface pointer-events-auto rounded-2xl overflow-hidden shadow-2xl border border-primary-gold/20 backdrop-blur-xl relative"
          >
            {minimized ? (
              <div 
                onClick={() => setMinimized(false)}
                className="size-16 relative flex items-center justify-center cursor-pointer group"
              >
                {task.thumbnail ? (
                  <img src={task.thumbnail} className="absolute inset-0 size-full object-cover opacity-40 group-hover:scale-110 transition-transform" alt="" />
                ) : (
                  <div className="absolute inset-0 bg-primary-gold/10" />
                )}
                
                {/* Circular Progress Ring for Minimized state */}
                <svg className="size-12 absolute -rotate-90">
                  <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/10" />
                  <circle 
                    cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="2" 
                    className="text-primary-gold transition-all duration-300"
                    strokeDasharray={125.6}
                    strokeDashoffset={125.6 - (125.6 * task.progress) / 100}
                  />
                </svg>
                {task.status === 'SUCCESS' ? <CheckCircle2 size={16} className="text-primary-gold relative z-10" /> : <Maximize2 size={16} className="text-white relative z-10 opacity-0 group-hover:opacity-100 transition-opacity" />}
              </div>
            ) : (
              <div className="flex flex-col">
                {/* Progress Bar Header */}
                <div className="h-1 w-full bg-white/5 relative overflow-hidden">
                  <motion.div 
                    className="absolute inset-y-0 left-0 bg-primary-gold shadow-[0_0_10px_rgba(197, 160, 89, 0.5)]"
                    animate={{ width: `${task.progress}%` }}
                    transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
                  />
                </div>

                <div className="p-4 flex gap-4">
                  {/* Thumbnail */}
                  <div className="size-16 rounded-xl overflow-hidden flex-shrink-0 bg-black/40 border border-white/10 relative">
                    {task.thumbnail && (
                      <img src={task.thumbnail} className="size-full object-cover" alt="" />
                    )}
                    {(task.status === 'UPLOADING' || task.status === 'PROCESSING') && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                            <Loader2 size={20} className="text-primary-gold animate-spin" />
                        </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h4 className="text-xs font-bold truncate text-white uppercase tracking-wider">{task.title}</h4>
                    <p className="text-[10px] font-bold text-muted-custom mt-1 flex items-center gap-2">
                       {task.status === 'UPLOADING' && <span>Uploading {task.progress}%</span>}
                       {task.status === 'PROCESSING' && <span className="text-primary-gold animate-pulse">Finalizing...</span>}
                       {task.status === 'SUCCESS' && <span className="text-green-400">Published!</span>}
                       {task.status === 'ERROR' && <span className="text-red-400">{task.error}</span>}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <button 
                       onClick={() => setMinimized(true)}
                       className="p-1.5 hover:bg-white/10 rounded-lg text-muted-custom transition-colors"
                    >
                      <Minimize2 size={14} />
                    </button>
                    {task.status === 'SUCCESS' || task.status === 'ERROR' ? (
                        <button 
                            onClick={() => clearUpload(task.id)}
                            className="p-1.5 hover:bg-white/10 rounded-lg text-muted-custom transition-colors"
                        >
                            <X size={14} />
                        </button>
                    ) : (
                        <button 
                            onClick={() => cancelUpload(task.id)}
                            className="p-1.5 hover:bg-red-500/20 rounded-lg text-red-500 transition-colors"
                        >
                            <X size={14} />
                        </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
