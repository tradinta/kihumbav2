'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Video, Sparkles, Upload, Loader2, PlayCircle, ShieldCheck, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';
import { useUploads } from '@/context/UploadContext';

interface VideoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function VideoUploadModal({ isOpen, onClose, onSuccess }: VideoUploadModalProps) {
  const { enlistUpload } = useUploads();
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // Detect duration
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        setDuration(video.duration);
        setStep(2);
      };
      video.src = URL.createObjectURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !title) return;
    setIsSubmitting(true);

    try {
      // Hand off to global background uploader
      await enlistUpload(file, title, description);
      
      // Success - Close modal immediately
      onSuccess?.();
      onClose();
      
      // Reset for next time
      setTimeout(() => {
        setStep(1);
        setTitle('');
        setFile(null);
        setIsSubmitting(false);
      }, 500);

    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      alert('Failed to start upload. Please try again.');
    }
  };

  const isSpark = duration > 0 && duration < 151;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-md" 
        onClick={onClose} 
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-lg card-surface rounded-2xl overflow-hidden shadow-2xl border border-primary-gold/20"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-custom flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary-gold/10 flex items-center justify-center text-primary-gold border border-primary-gold/20">
              <Video size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-[0.2em]">Upload Content</h2>
              <p className="text-[9px] text-muted-custom font-bold tracking-widest uppercase">Mux & R2 Integrated</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              >
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-video rounded-xl border-2 border-dashed border-primary-gold/20 hover:border-primary-gold/40 transition-colors flex flex-col items-center justify-center gap-3 cursor-pointer bg-primary-gold/5"
                >
                  <div className="size-14 rounded-full bg-primary-gold/10 flex items-center justify-center text-primary-gold shadow-lg shadow-primary-gold/10">
                    <Upload size={28} />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-primary-gold">Select Video File</p>
                    <p className="text-[10px] text-muted-custom mt-1">MP4, MOV up to 500MB</p>
                  </div>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="video/*" 
                  onChange={handleFileChange} 
                />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3 p-3 rounded-lg bg-primary-gold/10 border border-primary-gold/20">
                  {isSpark ? (
                    <div className="flex items-center gap-2 text-primary-gold">
                      <Sparkles size={16} />
                      <span className="text-[10px] font-bold uppercase tracking-widest font-gold">Categorized as Spark ({Math.round(duration)}s)</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-muted-custom">
                      <Video size={16} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Categorized as Video ({Math.round(duration)}s)</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-custom ml-1">Title</label>
                    <input 
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Give it a catchy title..."
                      className="w-full bg-black/40 border border-custom rounded-lg p-3 text-sm focus:border-primary-gold outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-custom ml-1">Description (Optional)</label>
                    <textarea 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="What's this about?"
                      className="w-full bg-black/40 border border-custom rounded-lg p-3 text-sm focus:border-primary-gold outline-none transition-colors h-24 resize-none"
                    />
                  </div>
                </div>

                  <div className="flex gap-2 pt-2">
                  <button 
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-custom hover:bg-white/5 transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handleUpload}
                    disabled={isSubmitting || !title}
                    className="flex-[2] py-3 rounded-lg bg-primary-gold text-black text-[10px] font-bold uppercase tracking-widest hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        PREPARING...
                      </>
                    ) : (
                      'Publish Now'
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-black/20 border-t border-custom rounded-b-2xl">
          <div className="flex items-center gap-2 text-primary-gold/60">
            <AlertCircle size={12} />
            <p className="text-[9px] font-bold uppercase tracking-widest">
              By uploading, you agree to Kihumba's Community Guidelines.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
