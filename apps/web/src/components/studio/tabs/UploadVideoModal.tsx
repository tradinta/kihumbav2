"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Upload, CheckCircle2, AlertCircle, Play, 
  ChevronRight, Globe, Lock, DollarSign, 
  Film, Settings, Check, ArrowRight,
  Info, AlertTriangle, RefreshCw, Image as ImageIcon,
  ChevronLeft, Eye, MoreHorizontal
} from 'lucide-react';
import { useUploads } from '@/context/UploadContext';
import { useRouter } from 'next/navigation';

interface UploadVideoModalProps {
    onClose: () => void;
    onRefresh?: () => void;
}

const Badge = ({ children, gold }: { children: React.ReactNode; gold?: boolean }) => (
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border ${
    gold
      ? 'bg-primary-gold/10 text-primary-gold border-primary-gold/30'
      : 'bg-white/5 text-muted-custom border-white/10'
  }`}>
    {children}
  </span>
);

export default function UploadVideoModal({ onClose }: UploadVideoModalProps) {
    const router = useRouter();
    const { enlistUpload, updateMetadata, uploads, cancelUpload } = useUploads();
    
    // Workflow State
    const [step, setStep] = useState(1); // 1: Select, 2: Details, 3: Elements, 4: Review
    const [taskId, setTaskId] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    
    // Thumbnail State
    const [generatedThumbnails, setGeneratedThumbnails] = useState<string[]>([]);
    const [selectedThumbnail, setSelectedThumbnail] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    
    // Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [visibility, setVisibility] = useState('PUBLIC');
    const [monetize, setMonetize] = useState(true);
    const [isPublishing, setIsPublishing] = useState(false);
    const [duration, setDuration] = useState(0);

    const currentUpload = uploads.find(u => u.id === taskId);
    const isVideoInitialized = !!currentUpload?.videoId;

    // ─── Thumbnail Generation Logic ───
    const generateThumbnails = useCallback(async (videoFile: File) => {
        setIsGenerating(true);
        const video = document.createElement('video');
        video.src = URL.createObjectURL(videoFile);
        video.muted = true;
        
        await new Promise((resolve) => (video.onloadedmetadata = resolve));
        setDuration(video.duration);
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const thumbs: string[] = [];
        
        for (let i = 0; i < 3; i++) {
            const time = Math.random() * video.duration;
            video.currentTime = time;
            await new Promise((resolve) => (video.onseeked = resolve));
            
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx?.drawImage(video, 0, 0);
            thumbs.push(canvas.toDataURL('image/jpeg', 0.8));
        }
        
        setGeneratedThumbnails(thumbs);
        setSelectedThumbnail(thumbs[0]);
        setIsGenerating(false);
        URL.revokeObjectURL(video.src);
    }, []);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setTitle(selectedFile.name.split('.')[0]);
            setPreviewUrl(URL.createObjectURL(selectedFile));
            
            // START UPLOAD AS DRAFT
            const tid = await enlistUpload(selectedFile, selectedFile.name.split('.')[0]);
            setTaskId(tid);
            setStep(2);
            generateThumbnails(selectedFile);
        }
    };

    const handlePublish = async () => {
        console.log(`[UploadVideoModal] handlePublish PULSE triggered for Task: ${taskId}`);
        if (!taskId) {
            console.error('[UploadVideoModal] handlePublish failed: No TaskId coordinate');
            return;
        }
        
        setIsPublishing(true);
        try {
            console.log(`[UploadVideoModal] Initiating metadata and finalization sync for Task: ${taskId}`);
            await updateMetadata(taskId, { 
                title, 
                description, 
                visibility, 
                monetize,
                thumbnail: selectedThumbnail,
                duration
            });
            console.log('[UploadVideoModal] Sync complete. Closing wizard.');
            onClose();
        } catch (err) {
            console.error('[UploadVideoModal] Critical Publish Failure:', err);
        } finally {
            setIsPublishing(false);
        }
    };

    const handleCancelRequest = () => {
        if (step === 1) onClose();
        else setShowCancelConfirm(true);
    };

    const confirmCancel = () => {
        if (taskId) cancelUpload(taskId);
        onClose();
    };

    // Cleanup
    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={handleCancelRequest}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.98, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 20 }}
                className="relative w-full max-w-5xl h-[600px] card-surface rounded-lg flex flex-col overflow-hidden shadow-2xl border-white/5"
            >
                {/* ─── Header ─── */}
                <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="size-8 rounded bg-primary-gold flex items-center justify-center text-black shadow-lg shadow-primary-gold/10">
                                <Upload size={16} strokeWidth={3} />
                            </div>
                            <h2 className="text-[11px] font-bold text-white uppercase tracking-[0.2em]">{title || 'New Upload'}</h2>
                        </div>
                        
                        {/* YouTube Style Stepper */}
                        <div className="hidden md:flex items-center gap-8">
                            <StepIndicator step={1} current={step} label="Details" />
                            <StepIndicator step={2} current={step} label="Elements" />
                            <StepIndicator step={3} current={step} label="Review" />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[9px] font-bold text-muted-custom uppercase tracking-widest">
                                {currentUpload?.status === 'SUCCESS' ? 'Sync Complete' : `Syncing ${currentUpload?.progress || 0}%`}
                            </span>
                        </div>
                        <button onClick={handleCancelRequest} className="p-1 hover:bg-white/5 rounded-full transition-colors text-muted-custom hover:text-white">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
                    {/* ─── Main Content Sector ─── */}
                    <div className="flex-1 overflow-y-auto no-scrollbar p-8">
                        <AnimatePresence mode="wait">
                            {step === 1 ? (
                                <motion.div key="s1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex flex-col items-center justify-center h-full space-y-8">
                                    <div className="size-24 rounded-full bg-white/5 flex items-center justify-center text-muted-custom border border-white/5 relative group">
                                        <div className="absolute inset-0 rounded-full border border-primary-gold/20 animate-ping opacity-0 group-hover:opacity-100" />
                                        <Upload size={40} />
                                    </div>
                                    <div className="text-center space-y-2">
                                        <h3 className="text-sm font-bold text-white uppercase tracking-[0.2em]">Select Video Asset</h3>
                                        <p className="text-[10px] text-muted-custom uppercase font-bold tracking-widest max-w-xs mx-auto">Your content starts syncing the second you choose.</p>
                                    </div>
                                    <label className="h-10 px-8 rounded bg-white text-black text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:bg-primary-gold transition-all shadow-xl active:scale-95 flex items-center justify-center">
                                        Browse Archives
                                        <input type="file" className="hidden" accept="video/*" onChange={handleFileSelect} />
                                    </label>
                                </motion.div>
                            ) : step === 2 ? (
                                <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8 max-w-2xl mx-auto">
                                    <div className="space-y-6">
                                        <h2 className="text-base font-bold text-white uppercase tracking-widest">Details</h2>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-bold text-muted-custom uppercase tracking-widest ml-1">Title (Required)</label>
                                                <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-sm font-bold text-white focus:border-primary-gold outline-none transition-all" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-bold text-muted-custom uppercase tracking-widest ml-1">Description</label>
                                                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-sm font-medium text-white h-32 focus:border-primary-gold outline-none transition-all resize-none" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : step === 3 ? (
                                <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8 max-w-2xl mx-auto">
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center">
                                            <h2 className="text-base font-bold text-white uppercase tracking-widest">Thumbnails</h2>
                                            <button onClick={() => generateThumbnails(file!)} className="flex items-center gap-2 text-[10px] font-bold text-primary-gold uppercase tracking-widest hover:brightness-110">
                                                <RefreshCw size={14} className={isGenerating ? 'animate-spin' : ''} /> Randomize
                                            </button>
                                        </div>
                                        <p className="text-[10px] text-muted-custom uppercase font-bold tracking-widest">Select a frame from the video or upload your own cinematic cover.</p>
                                        
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <label className="aspect-video rounded-lg border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary-gold transition-all bg-white/[0.02]">
                                                <ImageIcon size={20} className="text-muted-custom" />
                                                <span className="text-[8px] font-bold text-muted-custom uppercase">Upload</span>
                                                <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                                    const f = e.target.files?.[0];
                                                    if (f) setSelectedThumbnail(URL.createObjectURL(f));
                                                }} />
                                            </label>
                                            {generatedThumbnails.map((thumb, i) => (
                                                <button key={i} onClick={() => setSelectedThumbnail(thumb)} className={`aspect-video rounded-lg overflow-hidden border-2 transition-all ${selectedThumbnail === thumb ? 'border-primary-gold' : 'border-white/5 hover:border-white/20'}`}>
                                                    <img src={thumb} className="size-full object-cover" alt="" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8 max-w-2xl mx-auto">
                                    <div className="space-y-6">
                                        <h2 className="text-base font-bold text-white uppercase tracking-widest">Review & Visibility</h2>
                                        <div className="card-surface rounded-lg p-6 space-y-6">
                                            <div className="flex gap-4">
                                                <div className="w-48 aspect-video rounded-lg overflow-hidden bg-black shrink-0 border border-white/10">
                                                    {selectedThumbnail && <img src={selectedThumbnail} className="size-full object-cover" alt="" />}
                                                </div>
                                                <div className="space-y-2">
                                                    <h3 className="text-sm font-bold text-white uppercase">{title}</h3>
                                                    <p className="text-[10px] text-muted-custom line-clamp-2 uppercase font-bold tracking-widest">{description}</p>
                                                    <div className="flex gap-2 pt-2">
                                                        <Badge gold>{visibility}</Badge>
                                                        <Badge>{monetize ? 'Monetized' : 'Free'}</Badge>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-6">
                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-bold text-muted-custom uppercase tracking-widest">Choose Visibility</label>
                                                    <div className="flex gap-1.5 p-0.5 card-surface rounded-lg">
                                                        <button onClick={() => setVisibility('PUBLIC')} className={`flex-1 py-2 rounded text-[9px] font-bold uppercase transition-all ${visibility === 'PUBLIC' ? 'bg-primary-gold/15 text-primary-gold' : 'text-muted-custom'}`}>Public</button>
                                                        <button onClick={() => setVisibility('PRIVATE')} className={`flex-1 py-2 rounded text-[9px] font-bold uppercase transition-all ${visibility === 'PRIVATE' ? 'bg-primary-gold/15 text-primary-gold' : 'text-muted-custom'}`}>Private</button>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-bold text-muted-custom uppercase tracking-widest">Revenue Status</label>
                                                    <button onClick={() => setMonetize(!monetize)} className="w-full flex items-center justify-between py-2.5 px-3 rounded-lg text-[9px] font-bold uppercase card-surface border border-white/5">
                                                        <span className={monetize ? 'text-primary-gold' : 'text-muted-custom'}>Monetize Content</span>
                                                        <div className={`size-3.5 rounded-sm border-2 ${monetize ? 'bg-primary-gold border-primary-gold' : 'border-white/20'}`} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* ─── Right Sidebar: Fixed Preview ─── */}
                    {step > 1 && (
                        <div className="w-full lg:w-80 border-l border-white/5 bg-black/40 p-6 space-y-6">
                            <div className="aspect-video card-surface rounded-lg overflow-hidden relative group bg-black shadow-inner border border-white/10">
                                {previewUrl ? <video src={previewUrl} className="size-full object-contain" /> : null}
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="size-10 rounded-full bg-primary-gold/20 backdrop-blur-md flex items-center justify-center text-primary-gold"><Play size={18} fill="currentColor" /></div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest">
                                        <span className="text-muted-custom">Sync Progress</span>
                                        <span className="text-white">{currentUpload?.progress || 0}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: `${currentUpload?.progress || 0}%` }} className="h-full bg-primary-gold" />
                                    </div>
                                </div>
                                <div className="p-3 bg-white/5 border border-white/5 rounded space-y-2">
                                    <div className="flex items-center gap-2 text-[9px] font-bold text-white uppercase tracking-widest">
                                        <Film size={12} className="text-primary-gold" /> File: {file?.name}
                                    </div>
                                    <p className="text-[8px] font-bold text-muted-custom uppercase leading-relaxed">System is staging this as a draft until you finalize.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* ─── Footer ─── */}
                <div className="px-6 py-4 bg-white/[0.02] border-t border-white/5 flex justify-between items-center">
                    <button onClick={handleCancelRequest} className="text-[10px] font-bold text-muted-custom uppercase tracking-widest hover:text-white transition-all">
                        {step === 1 ? 'Cancel' : 'Save & Close'}
                    </button>
                    <div className="flex gap-3">
                        {step > 1 && (
                            <button onClick={() => setStep(step - 1)} className="h-10 px-6 rounded text-[10px] font-bold text-muted-custom uppercase tracking-widest border border-white/10 hover:bg-white/5 flex items-center gap-2">
                                <ChevronLeft size={16} /> Back
                            </button>
                        )}
                        {step > 1 && step < 4 ? (
                            <button onClick={() => setStep(step + 1)} className="h-10 px-8 rounded bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:bg-primary-gold transition-all shadow-lg flex items-center gap-2">
                                Next <ChevronRight size={16} />
                            </button>
                        ) : step === 4 ? (
                            <button 
                                onClick={handlePublish} 
                                disabled={isPublishing || !taskId || !isVideoInitialized}
                                className="h-10 px-10 rounded bg-primary-gold text-black text-[10px] font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-primary-gold/20 flex items-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isPublishing ? (
                                    <>
                                        <div className="size-3 border-2 border-black border-t-transparent animate-spin rounded-full" />
                                        Finalizing...
                                    </>
                                ) : (
                                    <>
                                        Publish Now <ArrowRight size={16} />
                                    </>
                                )}
                            </button>
                        ) : null}
                    </div>
                </div>

                {/* ─── Cancel/Draft Confirmation ─── */}
                <AnimatePresence>
                    {showCancelConfirm && (
                        <div className="absolute inset-0 z-[210] flex items-center justify-center p-6">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-sm card-surface rounded-lg p-8 text-center space-y-6 shadow-2xl">
                                <div className="size-16 rounded-full bg-primary-gold/10 flex items-center justify-center text-primary-gold mx-auto border border-primary-gold/20">
                                    <Film size={32} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">Save as Draft?</h3>
                                    <p className="text-[10px] text-muted-custom font-medium uppercase tracking-widest leading-relaxed">
                                        Your upload will continue in the background and be saved as a draft. You can publish it later from the Content tab.
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    <button onClick={confirmCancel} className="h-10 rounded border border-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500/5 transition-all">Abort</button>
                                    <button onClick={onClose} className="h-10 rounded bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:bg-primary-gold transition-all shadow-lg">Save Draft</button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

function StepIndicator({ step, current, label }: { step: number, current: number, label: string }) {
    const isActive = current === step + 1;
    const isCompleted = current > step + 1;
    return (
        <div className="flex items-center gap-3">
            <div className={`size-5 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${isActive ? 'bg-primary-gold text-black shadow-lg shadow-primary-gold/20' : isCompleted ? 'bg-emerald-500 text-white' : 'bg-white/5 text-muted-custom'}`}>
                {isCompleted ? <Check size={12} strokeWidth={4} /> : step}
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${isActive ? 'text-white' : 'text-muted-custom'}`}>{label}</span>
            {step < 3 && <div className="w-8 h-px bg-white/5" />}
        </div>
    );
}
