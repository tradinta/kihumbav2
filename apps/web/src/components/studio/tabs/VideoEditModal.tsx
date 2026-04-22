"use client";

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  X, Save, Play, Image as ImageIcon, 
  Globe, Lock, Clock, DollarSign,
  AlertCircle, Camera, Check
} from 'lucide-react';
import { api } from '@/lib/api';

interface EditModalProps {
  video: any;
  onClose: () => void;
  onRefresh: () => void;
}

export default function VideoEditModal({ video, onClose, onRefresh }: EditModalProps) {
  const [formData, setFormData] = useState({
    title: video.title,
    description: video.description || '',
    visibility: video.visibility || 'PUBLIC',
    isMonetized: video.isMonetized || false,
    thumbnailUrl: video.thumbnailUrl || (video.playbackId ? `https://image.mux.com/${video.playbackId}/thumbnail.jpg` : '/kihumba_cover_fallback_1776336123803.png')
  });
  const [currentTime, setCurrentTime] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleCaptureFrame = () => {
    if (!video.playbackId) return;
    const newThumb = `https://image.mux.com/${video.playbackId}/thumbnail.jpg?time=${Math.floor(currentTime)}`;
    setFormData(prev => ({ ...prev, thumbnailUrl: newThumb }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Update metadata (PLURAL ENDPOINT)
      await api.patch(`/videos/${video.id}/metadata`, {
        title: formData.title,
        description: formData.description,
        visibility: formData.visibility,
        thumbnailUrl: formData.thumbnailUrl
      });

      // Update monetization (PLURAL ENDPOINT)
      await api.patch(`/videos/${video.id}/monetize`, {
        isMonetized: formData.isMonetized
      });

      onRefresh();
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const isLongForm = video.duration > 150;

  return (
    <div className="space-y-8 max-h-[80vh] overflow-y-auto no-scrollbar pr-2">
      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* ─── Left: Frame Capture ─── */}
        <div className="space-y-4">
            <div className="relative aspect-video rounded-lg overflow-hidden border border-white/5 bg-black shadow-2xl group">
                <img 
                    src={formData.thumbnailUrl} 
                    className="size-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" 
                    alt="Preview" 
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <button 
                        onClick={handleCaptureFrame}
                        className="flex items-center gap-2 px-6 py-2.5 rounded bg-primary-gold text-black text-[10px] font-bold uppercase tracking-widest shadow-xl scale-95 group-hover:scale-100 transition-all active:scale-90"
                    >
                        <Camera size={16} />
                        Capture Frame
                    </button>
                </div>
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/5 space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-custom">Seek Preview</span>
                    <span className="text-[9px] font-bold text-white tabular-nums">{Math.floor(currentTime)}s</span>
                </div>
                <input 
                    type="range" 
                    min="0" 
                    max={video.duration || 100} 
                    value={currentTime}
                    onChange={(e) => setCurrentTime(Number(e.target.value))}
                    className="w-full accent-primary-gold"
                />
            </div>
        </div>

        {/* ─── Right: Metadata ─── */}
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-widest text-muted-custom ml-1">Title</label>
                <input 
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-bold outline-none focus:border-primary-gold/50 transition-all"
                />
            </div>
            
            <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-widest text-muted-custom ml-1">Description</label>
                <textarea 
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-medium outline-none focus:border-primary-gold/50 transition-all resize-none"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-muted-custom ml-1">Visibility</label>
                    <div className="flex gap-1 p-0.5 card-surface rounded-lg">
                        {['PUBLIC', 'PRIVATE'].map(v => (
                            <button 
                                key={v}
                                onClick={() => setFormData(prev => ({ ...prev, visibility: v }))}
                                className={`flex-1 py-2 rounded text-[9px] font-bold uppercase tracking-widest transition-all ${formData.visibility === v ? 'bg-primary-gold/15 text-primary-gold' : 'text-muted-custom hover:text-white'}`}
                            >
                                {v}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-muted-custom ml-1">Monetization</label>
                    <button 
                        onClick={() => setFormData(prev => ({ ...prev, isMonetized: !prev.isMonetized }))}
                        disabled={!isLongForm}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg card-surface border transition-all ${!isLongForm ? 'opacity-50 grayscale' : 'hover:border-primary-gold/30'} ${formData.isMonetized ? 'border-primary-gold/30 text-primary-gold' : 'border-white/5 text-muted-custom'}`}
                    >
                        <span className="text-[9px] font-bold uppercase">Earn Revenue</span>
                        <div className={`size-3 rounded-sm border flex items-center justify-center transition-all ${formData.isMonetized ? 'bg-primary-gold border-primary-gold' : 'border-white/20'}`}>
                            {formData.isMonetized && <Check size={8} strokeWidth={4} className="text-black" />}
                        </div>
                    </button>
                </div>
            </div>

            {!isLongForm && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
                    <AlertCircle size={14} className="text-amber-500 shrink-0" />
                    <p className="text-[8px] font-bold text-amber-500/80 uppercase tracking-widest leading-relaxed">
                        Revenue share requires content {'>'} 150 seconds.
                    </p>
                </div>
            )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
         <button onClick={onClose} className="h-10 px-6 rounded-lg text-[10px] font-bold text-muted-custom uppercase tracking-widest hover:text-white transition-all">Cancel</button>
         <button 
            onClick={handleSave}
            disabled={isSaving}
            className="h-10 px-10 rounded-lg bg-primary-gold text-black text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-primary-gold/10 hover:brightness-110 transition-all active:scale-95 disabled:opacity-50"
         >
            {isSaving ? 'Saving Changes...' : 'Save Changes'}
         </button>
      </div>
    </div>
  );
}
