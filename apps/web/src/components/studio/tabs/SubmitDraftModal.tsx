"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, CheckCircle2, AlertCircle, FileVideo, ChevronRight } from 'lucide-react';
import { api } from '@/lib/api';

interface SubmitDraftModalProps {
    briefId: string;
    videos: any[];
    onClose: () => void;
    onRefresh: () => void;
}

export default function SubmitDraftModal({ briefId, videos, onClose, onRefresh }: SubmitDraftModalProps) {
    const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!selectedVideoId) return;

        try {
            setSubmitting(true);
            const selectedVideo = videos.find(v => v.id === selectedVideoId);
            const playbackUrl = `https://stream.mux.com/${selectedVideo.playbackId}.m3u8`;

            await api.patch(`/partner/brief/${briefId}/submit-draft`, {
                videoId: selectedVideoId,
                draftUrl: playbackUrl
            });

            onRefresh();
            onClose();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Submission failed');
        } finally {
            setSubmitting(false);
        }
    };

    const readyVideos = videos.filter(v => v.status === 'ready');

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/95 backdrop-blur-md"
            />
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 10 }}
                className="relative w-full max-w-2xl bg-[#0A0A0A] border border-white/10 rounded-none flex flex-col h-[75vh] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)]"
            >
                {/* Header */}
                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <div className="flex items-center gap-6">
                        <div className="size-14 bg-emerald-500 flex items-center justify-center text-black">
                            <FileVideo size={32} strokeWidth={3} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">Draft Deployment</h2>
                            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] mt-2">Select verified asset for mission link</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-white/5 transition-colors">
                        <X size={28} />
                    </button>
                </div>

                {/* Video Selection Area */}
                <div className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-4">
                    {readyVideos.length === 0 ? (
                        <div className="py-20 text-center space-y-6">
                            <div className="size-20 bg-white/5 flex items-center justify-center mx-auto text-muted-custom rounded-none">
                                <FileVideo size={40} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-lg font-black text-white/40 uppercase tracking-[0.4em]">Empty Inventory</h3>
                                <p className="text-[10px] text-white/10 uppercase font-black tracking-[0.3em]">No ready-to-deploy assets detected in the studio core.</p>
                            </div>
                        </div>
                    ) : (
                        readyVideos.map((video) => (
                            <button
                                key={video.id}
                                onClick={() => setSelectedVideoId(video.id)}
                                className={`w-full p-4 rounded-none border transition-all flex items-center gap-6 text-left group shadow-2xl relative overflow-hidden ${
                                    selectedVideoId === video.id 
                                        ? "bg-primary-gold/5 border-primary-gold" 
                                        : "bg-white/[0.02] border-white/5 hover:border-white/20"
                                }`}
                            >
                                <div className="size-20 bg-black shrink-0 relative overflow-hidden flex items-center justify-center border border-white/10 rounded-none group-hover:border-primary-gold/40 transition-colors">
                                    {video.thumbnailUrl ? (
                                        <img src={video.thumbnailUrl} alt={video.title} className="size-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                    ) : (
                                        <Play size={24} className="text-white/20" />
                                    )}
                                    {selectedVideoId === video.id && (
                                        <div className="absolute inset-0 bg-primary-gold/20 flex items-center justify-center backdrop-blur-[2px]">
                                            <CheckCircle2 size={32} className="text-primary-gold" strokeWidth={3} />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0 space-y-1">
                                    <h4 className={`text-sm font-black uppercase tracking-tight truncate ${selectedVideoId === video.id ? 'text-primary-gold' : 'text-white'}`}>
                                        {video.title}
                                    </h4>
                                    <p className="text-[10px] font-black text-muted-custom uppercase tracking-widest opacity-60">
                                        Industrial Sync: {new Date(video.createdAt).toLocaleDateString().toUpperCase()}
                                    </p>
                                </div>
                            </button>
                        ))
                    )}
                </div>

                {/* Footer Controls */}
                <div className="p-8 bg-white/[0.02] border-t border-white/10 space-y-6">
                    <div className="flex items-start gap-6 text-left bg-primary-gold/5 p-6 border border-primary-gold/20 relative overflow-hidden rounded-none">
                        <div className="absolute top-0 left-0 w-1 h-full bg-primary-gold" />
                        <AlertCircle size={24} className="text-primary-gold shrink-0" strokeWidth={3} />
                        <p className="text-[10px] font-black text-muted-custom leading-normal uppercase tracking-widest">
                            Linking a verified asset will initiate a brand verification cycle. Ensure the selected content adheres to the mission brief coordinates.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <button 
                            onClick={onClose}
                            className="flex-1 py-5 border border-white/10 text-white text-[11px] font-black uppercase tracking-[0.3em] hover:bg-white/5 transition-all rounded-none"
                        >
                            Abort
                        </button>
                        <button 
                            disabled={!selectedVideoId || submitting}
                            onClick={handleSubmit}
                            className="flex-[2] py-5 bg-white text-black text-[11px] font-black uppercase tracking-[0.3em] shadow-[0_0_50px_rgba(0,0,0,1)] hover:bg-primary-gold transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 rounded-none"
                        >
                            {submitting ? 'Transmitting...' : (
                                <>Deploy Draft Submission <ChevronRight size={20} strokeWidth={3} /></>
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
