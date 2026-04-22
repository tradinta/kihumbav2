"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, Lock, Eye, BarChart2, DollarSign, 
  Trash2, Edit3, MoreVertical, X,
  Clock, CheckCircle2, AlertCircle, Play,
  Plus, Search, Video, Shield, Heart,
  ArrowUpRight, CheckSquare, Square, MinusSquare
} from 'lucide-react';
import { api } from '@/lib/api';
import VideoAnalyticsView from './VideoAnalyticsView';
import VideoEditModal from './VideoEditModal';
import UploadVideoModal from './UploadVideoModal';
import { useSnackbar } from '@/context/SnackbarContext';

interface ContentTabProps {
  content: any[];
  refresh: () => void;
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

export default function ContentTab({ content, refresh }: ContentTabProps) {
    const [filter, setFilter] = useState('ALL');
    const [showUpload, setShowUpload] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isBulkDeleting, setIsBulkDeleting] = useState(false);
    const [activeModal, setActiveModal] = useState<{ type: 'EDIT' | 'ANALYTICS' | 'NONE'; video: any }>({ type: 'NONE', video: null });
    const { showSnackbar } = useSnackbar();

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredContent.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredContent.map(v => v.id));
        }
    };

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;
        setIsBulkDeleting(true);
        try {
            // Parallel Decommissioning Pulse
            await Promise.all(selectedIds.map(id => api.post(`/videos/${id}/soft-delete`)));
            showSnackbar(`${selectedIds.length} assets successfully decommissioned`, 'success');
            setSelectedIds([]);
            refresh();
        } catch (err: any) {
            showSnackbar('Bulk decommissioning partially failed', 'error');
        } finally {
            setIsBulkDeleting(false);
            setConfirmDeleteId(null);
        }
    };

    const handleDelete = async (videoId: string) => {
        setDeletingId(videoId);
        try {
            await api.post(`/videos/${videoId}/soft-delete`);
            showSnackbar('Video successfully decommissioned', 'success');
            refresh();
        } catch (err: any) {
            showSnackbar(err.response?.data?.message || 'Decommissioning failed', 'error');
        } finally {
            setDeletingId(null);
            setConfirmDeleteId(null);
        }
    };

    const filteredContent = content.filter(v => {
        // High-Fidelity Data Guardrail: Filter out corrupt/errored pulses
        if (v.status === 'errored' || v.status === 'timed_out') return false;
        
        if (filter === 'ALL') return true;
        if (filter === 'VIDEOS') return !v.isSpark;
        if (filter === 'SPARKS') return v.isSpark;
        return true;
    });

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="space-y-6"
        >
            {/* ─── Search & Controls ─── */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <button 
                        onClick={toggleSelectAll}
                        className="size-9 rounded-lg card-surface border border-white/5 flex items-center justify-center text-muted-custom hover:text-primary-gold transition-all"
                        title={selectedIds.length === filteredContent.length ? 'Deselect All' : 'Select All'}
                    >
                        {selectedIds.length === 0 ? <Square size={16} /> : 
                         selectedIds.length === filteredContent.length ? <CheckSquare size={16} className="text-primary-gold" /> : 
                         <MinusSquare size={16} className="text-primary-gold/60" />}
                    </button>
                    <div className="flex gap-1.5 overflow-x-auto no-scrollbar p-0.5 card-surface rounded-lg">
                        {['ALL', 'VIDEOS', 'SPARKS'].map(f => (
                            <button 
                                key={f} 
                                onClick={() => { setFilter(f); setSelectedIds([]); }} 
                                className={`px-4 py-1.5 rounded text-[9px] font-bold uppercase tracking-widest transition-all ${
                                    filter === f ? 'bg-primary-gold/15 text-primary-gold border border-primary-gold/30' : 'text-muted-custom border border-transparent'
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="flex-1 md:w-64 card-surface rounded-lg px-3 py-2 flex items-center gap-2">
                        <Search size={14} className="text-muted-custom/60" />
                        <input 
                            type="text" 
                            placeholder="Search content…" 
                            className="bg-transparent outline-none text-[10px] font-bold placeholder:text-muted-custom/50 w-full"
                        />
                    </div>
                    <button 
                        onClick={() => setShowUpload(true)}
                        className="h-9 px-4 rounded bg-primary-gold text-black text-[10px] font-bold uppercase tracking-widest hover:brightness-110 transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-primary-gold/10 whitespace-nowrap"
                    >
                        <Plus size={14} /> Upload
                    </button>
                </div>
            </div>

            {/* ─── Content Grid — Matching KAO Style ─── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredContent.length > 0 ? (
                    filteredContent.map((video, i) => (
                        <motion.div 
                            key={video.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className={`group card-surface rounded-lg overflow-hidden cursor-pointer border transition-all duration-300 flex flex-col ${
                                selectedIds.includes(video.id) ? 'border-primary-gold/50 bg-primary-gold/[0.02]' : 'border-white/5 hover:border-primary-gold/30'
                            }`}
                        >
                            <div 
                                className="relative h-44 overflow-hidden bg-black shrink-0"
                                onClick={() => window.open(`/videos/${video.id}`, '_blank')}
                            >
                                <div 
                                    className={`absolute top-2 left-2 z-10 size-5 rounded border flex items-center justify-center transition-all ${
                                        selectedIds.includes(video.id) ? 'bg-primary-gold border-primary-gold' : 'bg-black/40 border-white/20 backdrop-blur-md opacity-0 group-hover:opacity-100'
                                    }`}
                                    onClick={(e) => { e.stopPropagation(); toggleSelect(video.id); }}
                                >
                                    {selectedIds.includes(video.id) && <CheckSquare size={12} className="text-black" />}
                                </div>
                                <img 
                                    src={video.thumbnailUrl || (video.playbackId ? `https://image.mux.com/${video.playbackId}/thumbnail.jpg` : '/kihumba_cover_fallback_1776336123803.png')} 
                                    alt="" 
                                    className="size-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                />
                                <div className="absolute top-2 left-2 flex flex-col gap-1 pl-7">
                                    <Badge gold>{video.status?.toUpperCase() || 'READY'}</Badge>
                                    <Badge>{video.isSpark ? 'SPARK' : 'VIDEO'}</Badge>
                                </div>
                                <div className="absolute top-2 right-2 flex gap-1">
                                    <button onClick={(e) => { e.stopPropagation(); setActiveModal({ type: 'EDIT', video }); }} className="size-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/80 hover:bg-primary-gold hover:text-black transition-all">
                                        <Edit3 size={14} />
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(video.id); }} className="size-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/80 hover:bg-red-500 transition-all">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                                <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/60 text-[9px] font-bold text-white backdrop-blur-sm">
                                    {video.duration ? `${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}` : '0:00'}
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 pointer-events-none">
                                    <div className="size-10 rounded-full bg-primary-gold/20 backdrop-blur-sm flex items-center justify-center text-primary-gold border border-primary-gold/40">
                                        <Play size={18} fill="currentColor" />
                                    </div>
                                </div>
                            </div>

                            <div className="p-3 flex-1 flex flex-col justify-between">
                                <div className="space-y-1">
                                    <h3 className="text-[11px] font-bold uppercase tracking-widest truncate group-hover:text-primary-gold transition-colors">{video.title}</h3>
                                    <div className="flex items-center gap-2">
                                        <Clock size={10} className="text-muted-custom/60" />
                                        <span className="text-[9px] font-bold text-muted-custom uppercase">{new Date(video.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-3">
                                    <div className="flex gap-4">
                                        <div className="space-y-0.5">
                                            <p className="text-[8px] font-bold text-muted-custom uppercase">Views</p>
                                            <p className="text-xs font-bold text-white tabular-nums">{(video.viewCount || 0).toLocaleString()}</p>
                                        </div>
                                        <div className="flex items-center gap-1.5 pt-1">
                                            {video.visibility === 'PUBLIC' ? <Globe size={10} className="text-emerald-400" /> : <Lock size={10} className="text-muted-custom" />}
                                            <span className="text-[9px] font-bold text-muted-custom uppercase">{video.visibility}</span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); setActiveModal({ type: 'ANALYTICS', video }); }}
                                        className="text-[9px] font-bold uppercase tracking-widest text-primary-gold flex items-center gap-1 hover:brightness-110 transition-all"
                                    >
                                        Insights <ArrowUpRight size={12} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center card-surface rounded-lg">
                        <Video size={32} className="mx-auto text-white/5 mb-4" />
                        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-custom">No results found</h3>
                    </div>
                )}
            </div>

            {/* ─── Floating Selection Bar ─── */}
            <AnimatePresence>
                {selectedIds.length > 0 && (
                    <motion.div 
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-lg"
                    >
                        <div className="bg-[#0A0A0A] border border-primary-gold/30 rounded-full px-6 py-3 flex items-center justify-between shadow-2xl shadow-primary-gold/10 backdrop-blur-xl">
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => setSelectedIds([])}
                                    className="p-1 hover:bg-white/5 rounded-full transition-colors"
                                >
                                    <X size={16} className="text-muted-custom" />
                                </button>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-primary-gold">
                                    {selectedIds.length} Assets Selected
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => setConfirmDeleteId('BULK')}
                                    className="h-8 px-4 rounded-full bg-red-500/10 text-red-500 text-[9px] font-black uppercase tracking-widest border border-red-500/20 hover:bg-red-500 hover:text-white transition-all flex items-center gap-2"
                                >
                                    <Trash2 size={12} /> Bulk Delete
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ─── Modals ─── */}
            <AnimatePresence>
                {showUpload && (
                    <UploadVideoModal 
                        onClose={() => setShowUpload(false)} 
                        onRefresh={refresh} 
                    />
                )}
                
                {/* Deletion Confirmation Modal */}
                {confirmDeleteId && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setConfirmDeleteId(null)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[250]"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm z-[251] p-4"
                        >
                            <div className="card-surface rounded-lg p-6 space-y-4 text-center border-red-500/20 shadow-2xl shadow-red-500/5">
                                <div className="size-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mx-auto">
                                    <AlertCircle size={24} />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-white">
                                        {confirmDeleteId === 'BULK' ? `Decommission ${selectedIds.length} Assets` : 'Decommission Asset'}
                                    </h3>
                                    <p className="text-[10px] font-bold text-muted-custom uppercase">Are you sure? This action cannot be undone.</p>
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <button 
                                        onClick={() => setConfirmDeleteId(null)}
                                        className="flex-1 h-9 rounded bg-white/5 text-muted-custom text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={() => confirmDeleteId === 'BULK' ? handleBulkDelete() : handleDelete(confirmDeleteId)}
                                        disabled={!!deletingId || isBulkDeleting}
                                        className="flex-1 h-9 rounded bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2"
                                    >
                                        {deletingId || isBulkDeleting ? <div className="size-3 border-2 border-white border-t-transparent animate-spin rounded-full" /> : 'Delete'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
                
                {activeModal.type !== 'NONE' && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setActiveModal({ type: 'NONE', video: null })}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.98, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: 10 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl z-[201]"
                        >
                            <div className="card-surface rounded-lg overflow-hidden relative shadow-2xl">
                                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-white">
                                        {activeModal.type === 'ANALYTICS' ? 'Video Analytics' : 'Edit Details'}
                                    </h3>
                                    <button 
                                        onClick={() => setActiveModal({ type: 'NONE', video: null })}
                                        className="p-1 hover:bg-white/5 rounded-full transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                                <div className="p-6 max-h-[80vh] overflow-y-auto no-scrollbar">
                                    {activeModal.type === 'ANALYTICS' && (
                                        <VideoAnalyticsView video={activeModal.video} onClose={() => setActiveModal({ type: 'NONE', video: null })} />
                                    )}
                                    {activeModal.type === 'EDIT' && (
                                        <VideoEditModal video={activeModal.video} onClose={() => setActiveModal({ type: 'NONE', video: null })} onRefresh={refresh} />
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
