"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Image as ImageIcon, Video, Send, Loader2, Globe, Sparkles, Film, AlertCircle, Calendar, BarChart, FileText, Plus, Minus, Info } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { usePostContext } from "@/context/PostContext";
import { useAuth } from "@/context/AuthContext";
import { useUploads } from "@/context/UploadContext";
import { useSnackbar } from "@/context/SnackbarContext";
import { api } from "@/lib/api";

const MAX_CHARS = 2000;
const MAX_IMAGES = 4;
const DRAFT_KEY = "kihumba:draft";
const LONG_VIDEO_THRESHOLD = 150; // 2.5 minutes

export default function CreatePostModal() {
  const { 
    isCreatePostOpen, setCreatePostOpen, 
    quoteTarget, setQuoteTarget, 
    marketQuoteTarget, setMarketQuoteTarget,
    kaoQuoteTarget, setKaoQuoteTarget,
    tribeTarget, setTribeTarget,
    addPost 
  } = usePostContext();
  const { isAuthenticated, user } = useAuth();
  const { enlistUpload, enlistDocument } = useUploads();
  const { show } = useSnackbar();

  const [content, setContent] = useState("");
  const [mediaItems, setMediaItems] = useState<{ type: "image", src: string }[]>([]);
  
  // Video-Specific Tools
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const [isLongVideo, setIsLongVideo] = useState(false);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [subtitleMode, setSubtitleMode] = useState<'AUTO' | 'NONE'>('AUTO');
  const [thumbnailMode, setThumbnailMode] = useState<'AUTO' | 'RANDOM' | 'MANUAL'>('AUTO');
  const [customThumbnailTime, setCustomThumbnailTime] = useState<number | undefined>(undefined);
  const [manualThumbnail, setManualThumbnail] = useState<string | null>(null);
  const [manualThumbnailFile, setManualThumbnailFile] = useState<File | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<'POST' | 'VIDEO' | 'SUBTITLES' | 'THUMBNAIL' | 'POLL' | 'DOCUMENT'>('POST');



  // Poll State
  const [pollData, setPollData] = useState({
      question: "",
      options: ["", ""],
      isQuiz: false,
      correctIndices: [] as number[],
      endsAt: "",
      allowMultiple: false
  });

  // Document State
  const [documents, setDocuments] = useState<{ file: File, name: string, size: number }[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  // Restore draft on mount
  useEffect(() => {
    if (isCreatePostOpen) {
      const savedDraft = localStorage.getItem(DRAFT_KEY);
      if (savedDraft && !content) {
        setContent(savedDraft);
      }
    }
  }, [isCreatePostOpen]);

  // Save content to draft on close
  const handleClose = () => {
    if (content.trim() && !isSubmitting) {
      localStorage.setItem(DRAFT_KEY, content);
    } else {
      localStorage.removeItem(DRAFT_KEY);
    }
    setCreatePostOpen(false);
    setQuoteTarget(null);
    setMarketQuoteTarget(null);
    setKaoQuoteTarget(null);
    setTribeTarget(null);
    setVideoFile(null);
    setVideoPreview(null);
    setMediaItems([]);
    setPollData({ question: "", options: ["", ""], isQuiz: false, correctIndices: [], endsAt: "", allowMultiple: false });
    setDocuments([]);
    setManualThumbnail(null);
    setManualThumbnailFile(null);
  };

  if (!isCreatePostOpen) return null;

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="card-surface p-6 rounded-2xl max-w-sm w-full text-center">
          <h2 className="text-lg font-bold text-primary-gold mb-2">Sign in to curate</h2>
          <p className="text-sm text-muted-custom mb-6">Join the conversation and share your moments.</p>
          <button 
            onClick={() => window.location.href = '/login'} 
            className="w-full bg-primary-gold text-black font-bold py-3 rounded-lg mb-3 hover:brightness-110 active:scale-95 transition-all"
          >
            Sign In
          </button>
          <button 
            onClick={() => setCreatePostOpen(false)} 
            className="w-full text-sm font-bold text-muted-custom py-2 hover:text-primary-gold transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || videoFile) return;

    if (mediaItems.length + files.length > MAX_IMAGES) {
      setError(`Maximum ${MAX_IMAGES} images allowed.`);
      return;
    }

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setMediaItems((prev) => [...prev, { type: "image", src: event.target?.result as string }]);
        setError(null);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (mediaItems.length > 0) {
        setError("Posts can include either images or one video, not both.");
        return;
      }
      
      // Load metadata for long detection
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
          setVideoDuration(video.duration);
          setIsLongVideo(video.duration > LONG_VIDEO_THRESHOLD);
          if (video.duration > LONG_VIDEO_THRESHOLD) {
              setActiveTool('VIDEO'); // Auto-switch to video tools for long videos
          }
          window.URL.revokeObjectURL(video.src);
      };
      video.src = URL.createObjectURL(file);

      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
      setError(null);
    }
  };

  const handleDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;
      
      const MAX_DOC_SIZE = 10 * 1024 * 1024; // 10MB
      const VALID_TYPES = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'text/plain'
      ];

      const newDocs: any[] = [];
      Array.from(files).forEach(file => {
          if (file.size > MAX_DOC_SIZE) {
              setError(`${file.name} exceeds 10MB limit.`);
              return;
          }
          if (!VALID_TYPES.includes(file.type)) {
              setError(`${file.name} is not a supported document type.`);
              return;
          }
          
          newDocs.push({
              file,
              name: file.name,
              size: file.size
          });
      });

      setDocuments(prev => [...prev, ...newDocs]);
  };

  const handleThumbChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          setManualThumbnailFile(file);
          const reader = new FileReader();
          reader.onload = (event) => setManualThumbnail(event.target?.result as string);
          reader.readAsDataURL(file);
      }
  };

  const removeVideo = () => {
      if (videoPreview) URL.revokeObjectURL(videoPreview);
      setVideoFile(null);
      setVideoPreview(null);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    if (isLongVideo && (!videoTitle.trim() || !videoDescription.trim())) {
        setError("Long videos require a Cinematic Title and Description.");
        setActiveTool('VIDEO');
        return;
    }

    setIsSubmitting(true);

    try {
      if (videoFile) {
        // ... video logic remains same ...
        await enlistUpload(
            videoFile, 
            videoTitle || content.slice(0, 50) || "Video Post", 
            videoDescription || content, 
            content,
            { 
                subtitleMode, 
                thumbnailTime: thumbnailMode === 'MANUAL' ? customThumbnailTime : undefined,
                manualThumbnail: manualThumbnailFile,
                tribeId: tribeTarget?.id 
            }
        );
        show({ type: 'info', message: 'Your video is processing in the background.', duration: 3000 });
        handleClose();
      } else {
        const payload: any = { content: content.trim() };
        if (mediaItems.length > 0) payload.media = mediaItems;
        if (quoteTarget) payload.originalPostId = quoteTarget.id;
        if (marketQuoteTarget) payload.marketListingId = marketQuoteTarget.id;
        if (kaoQuoteTarget) payload.kaoListingId = kaoQuoteTarget.id;
        if (tribeTarget) payload.tribeId = tribeTarget.id;

        // 🚀 Curation Tools Integration
        if (activeTool === 'POLL') {
            payload.contentType = 'POLL';
            payload.pollData = {
                question: pollData.question || content,
                options: pollData.options.filter(o => o.trim()),
                isQuiz: pollData.isQuiz,
                correctIndices: pollData.correctIndices,
                endsAt: pollData.endsAt || null
            };

            // Validation for Poll Date
            if (pollData.endsAt) {
                const endDate = new Date(pollData.endsAt);
                const now = new Date();
                const maxDate = new Date();
                maxDate.setDate(now.getDate() + 366);

                if (endDate < now) {
                    setError("Poll cannot end in the past.");
                    setIsSubmitting(false);
                    return;
                }
                if (endDate > maxDate) {
                    setError("Poll duration cannot exceed 366 days.");
                    setIsSubmitting(false);
                    return;
                }
            }
        } else if (activeTool === 'DOCUMENT') {
            payload.contentType = 'DOCUMENT';
            const uploadedDocs = await Promise.all(documents.map(async d => {
                const { publicUrl } = await enlistDocument(d.file);
                return { name: d.name, src: publicUrl, type: 'document', size: d.size };
            }));
            payload.media = [...(payload.media || []), ...uploadedDocs];
        }

        const response = await api.post("/posts", payload);
        addPost(response);
        handleClose();
      }
    } catch (err: any) {
      setError(err.message || "Failed to post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-end lg:items-center justify-center bg-black/80 backdrop-blur-md p-0 lg:p-4"
      >
        <motion.div
          initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
          className="w-full lg:max-w-xl bg-[#0a0a0a] lg:rounded-3xl border-t lg:border border-white/10 overflow-hidden flex flex-col h-[95vh] lg:h-auto lg:max-h-[85vh] shadow-[0_0_50px_rgba(0,0,0,0.8)]"
        >
          {/* Detailed Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/20">
            <button onClick={handleClose} className="p-2 -ml-2 text-white/40 hover:text-white transition-colors">
              <X size={20} />
            </button>
            
            <div className="flex flex-col items-center">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-gold gold-glow">
                  {quoteTarget ? "Quote Curation" : "Master Studio"}
                </span>
                <div className="flex items-center gap-1 mt-1">
                    <Globe size={10} className={tribeTarget ? "text-primary-gold" : "text-white/20"} />
                    <span className={`text-[8px] font-bold uppercase tracking-widest ${tribeTarget ? "text-primary-gold" : "text-white/30"}`}>
                      {tribeTarget ? `Posting to ${tribeTarget.name}` : "Public Hub"}
                    </span>
                </div>
            </div>

            <div className="w-8" />
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
            {/* Identity Block */}
            <div className="flex gap-4 mb-6 p-4 rounded-2xl bg-white/[0.04] border border-white/5 backdrop-blur-sm shadow-inner overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="size-14 rounded-2xl border-2 border-primary-gold/30 p-1 bg-black shrink-0 relative z-10">
                    <img 
                        src={user?.avatar || user?.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100"} 
                        className="size-full rounded-xl object-cover" 
                        alt="" 
                    />
                    <div className="absolute -bottom-1 -right-1 size-5 rounded-lg bg-primary-gold flex items-center justify-center text-black border-2 border-black">
                        <Sparkles size={10} />
                    </div>
                </div>
                <div className="flex-1 pt-1 relative z-10">
                    <h3 className="text-sm font-black text-white tracking-tight leading-none mb-1">{user?.fullName || "Kihumba User"}</h3>
                    <div className="flex items-center gap-2">
                        <p className="text-[10px] font-bold text-primary-gold/80 uppercase tracking-widest">@{user?.username || "curator"}</p>
                        <span className="size-1 rounded-full bg-white/10" />
                        <span className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">{activeTool} MODE</span>
                    </div>
                </div>
            </div>

            {/* MASTER TOOL TABS (Video Only) */}
            {videoFile && (
                <div className="flex items-center gap-2 mb-6 p-1 bg-white/[0.03] border border-white/5 rounded-2xl">
                    <button 
                        onClick={() => setActiveTool('POST')}
                        className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTool === 'POST' ? 'bg-primary-gold text-black shadow-lg shadow-primary-gold/20' : 'text-white/40 hover:text-white'}`}
                    >
                        Post
                    </button>
                    <button 
                        onClick={() => setActiveTool('VIDEO')}
                        className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTool === 'VIDEO' ? 'bg-primary-gold text-black shadow-lg shadow-primary-gold/20' : 'text-white/40 hover:text-white'}`}
                    >
                        Details
                    </button>
                    <button 
                        onClick={() => setActiveTool('SUBTITLES')}
                        className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTool === 'SUBTITLES' ? 'bg-primary-gold text-black shadow-lg shadow-primary-gold/20' : 'text-white/40 hover:text-white'}`}
                    >
                        Captions
                    </button>
                    <button 
                        onClick={() => setActiveTool('THUMBNAIL')}
                        className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTool === 'THUMBNAIL' ? 'bg-primary-gold text-black shadow-lg shadow-primary-gold/20' : 'text-white/40 hover:text-white'}`}
                    >
                        Cover
                    </button>
                </div>
            )}

            <AnimatePresence mode="wait">
                {activeTool === 'POST' && (
                    <motion.div 
                        key="tool-post"
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                    >
                        {quoteTarget && (
                            <div className="mb-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 relative group">
                                <div className="flex items-center gap-2 mb-2">
                                    <img src={quoteTarget.author.avatar} className="size-5 rounded-full object-cover" alt="" />
                                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Quoting @{quoteTarget.author.username}</span>
                                </div>
                                <p className="text-xs text-white/60 line-clamp-2 italic leading-relaxed">"{quoteTarget.content}"</p>
                                <button 
                                    onClick={() => setQuoteTarget(null)}
                                    className="absolute top-2 right-2 p-1 text-white/20 hover:text-red-500 transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        )}

                        {marketQuoteTarget && (
                            <div className="mb-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 relative group flex gap-3">
                                <div className="size-12 rounded-lg overflow-hidden border border-white/10 shrink-0">
                                    <img src={marketQuoteTarget.images?.[0]} className="size-full object-cover" alt="" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className="text-[10px] font-black text-primary-gold uppercase tracking-widest">Quoting Item</span>
                                    <h4 className="text-xs font-bold text-white truncate">{marketQuoteTarget.title}</h4>
                                    <p className="text-[10px] text-white/40 font-bold">KES {marketQuoteTarget.price?.toLocaleString()}</p>
                                </div>
                                <button 
                                    onClick={() => setMarketQuoteTarget(null)}
                                    className="absolute top-2 right-2 p-1 text-white/20 hover:text-red-500 transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        )}

                        {kaoQuoteTarget && (
                            <div className="mb-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 relative group flex gap-3">
                                <div className="size-12 rounded-lg overflow-hidden border border-white/10 shrink-0">
                                    <img src={kaoQuoteTarget.images?.[0]} className="size-full object-cover" alt="" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className="text-[10px] font-black text-primary-gold uppercase tracking-widest">Quoting Property</span>
                                    <h4 className="text-xs font-bold text-white truncate">{kaoQuoteTarget.title}</h4>
                                    <p className="text-[10px] text-white/40 font-bold">{kaoQuoteTarget.area}, {kaoQuoteTarget.county}</p>
                                </div>
                                <button 
                                    onClick={() => setKaoQuoteTarget(null)}
                                    className="absolute top-2 right-2 p-1 text-white/20 hover:text-red-500 transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        )}
                        <textarea
                            placeholder={quoteTarget ? "Your thoughts on this..." : "What's the vision today?"}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full bg-transparent text-white placeholder:text-white/20 text-base font-medium leading-relaxed resize-none focus:outline-none min-h-[160px]"
                            autoFocus
                        />
                    </motion.div>
                )}

                {activeTool === 'VIDEO' && (
                    <motion.div 
                        key="tool-video"
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                        className="space-y-4"
                    >
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-primary-gold/60 uppercase tracking-widest ml-1">Cinematic Title</label>
                            <input 
                                placeholder="Enter a striking title..."
                                value={videoTitle}
                                onChange={(e) => setVideoTitle(e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-sm text-white focus:border-primary-gold/40 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-primary-gold/60 uppercase tracking-widest ml-1">Documentary Description</label>
                            <textarea 
                                placeholder="Tell the deeper story..."
                                value={videoDescription}
                                onChange={(e) => setVideoDescription(e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-sm text-white focus:border-primary-gold/40 outline-none h-32 resize-none transition-all"
                            />
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-2xl bg-primary-gold/5 border border-primary-gold/10">
                            <Film size={16} className="text-primary-gold" />
                            <div className="flex-1">
                                <p className="text-[10px] font-bold text-white uppercase tracking-widest">Mode: {isLongVideo ? "Long-Form Cinema" : "Social Spark"}</p>
                                <p className="text-[9px] text-primary-gold/60 font-medium">Duration: {Math.floor(videoDuration)} Seconds</p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTool === 'SUBTITLES' && (
                    <motion.div 
                        key="tool-subtitles"
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                        className="space-y-4"
                    >
                         <h4 className="text-xs font-black text-white uppercase tracking-widest mb-2">Caption Generation</h4>
                         <div className="grid grid-cols-1 gap-3">
                            <button 
                                onClick={() => setSubtitleMode('AUTO')}
                                className={`p-4 rounded-2xl border text-left transition-all ${subtitleMode === 'AUTO' ? 'bg-primary-gold/10 border-primary-gold/40' : 'bg-white/[0.03] border-white/5 text-white/40 hover:text-white'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <Sparkles size={18} className={subtitleMode === 'AUTO' ? 'text-primary-gold' : ''} />
                                    <div>
                                        <p className="text-[11px] font-black uppercase tracking-widest">Let Kihumba Pick (Mux AI)</p>
                                        <p className="text-[9px] font-medium opacity-60">Automatic high-fidelity English captions.</p>
                                    </div>
                                </div>
                            </button>
                            <button 
                                onClick={() => setSubtitleMode('NONE')}
                                className={`p-4 rounded-2xl border text-left transition-all ${subtitleMode === 'NONE' ? 'bg-primary-gold/10 border-primary-gold/40' : 'bg-white/[0.03] border-white/5 text-white/40 hover:text-white'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <X size={18} />
                                    <div>
                                        <p className="text-[11px] font-black uppercase tracking-widest">No Captions</p>
                                        <p className="text-[9px] font-medium opacity-60">The audio will speak for itself.</p>
                                    </div>
                                </div>
                            </button>
                         </div>
                    </motion.div>
                )}

                {activeTool === 'THUMBNAIL' && (
                    <motion.div 
                        key="tool-thumb"
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                        className="space-y-4"
                    >
                         <h4 className="text-xs font-black text-white uppercase tracking-widest mb-2">Cover Selection</h4>
                         <div className="grid grid-cols-1 gap-3">
                            <button 
                                onClick={() => setThumbnailMode('AUTO')}
                                className={`p-4 rounded-2xl border text-left transition-all ${thumbnailMode === 'AUTO' ? 'bg-primary-gold/10 border-primary-gold/40' : 'bg-white/[0.03] border-white/5 text-white/40 hover:text-white'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <Sparkles size={18} className="text-primary-gold" />
                                    <div>
                                        <p className="text-[11px] font-black uppercase tracking-widest">Let Kihumba Pick (Smart Capture)</p>
                                        <p className="text-[9px] font-medium opacity-60">Avoids dark frames. Searches and selects the first vibrant moment.</p>
                                    </div>
                                </div>
                            </button>
                            <button 
                                onClick={() => thumbInputRef.current?.click()}
                                className={`p-4 rounded-2xl border text-left transition-all ${thumbnailMode === 'MANUAL' ? 'bg-primary-gold/10 border-primary-gold/40' : 'bg-white/[0.03] border-white/5 text-white/40 hover:text-white'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <ImageIcon size={18} className={manualThumbnail ? 'text-primary-gold' : ''} />
                                    <div className="flex-1">
                                        <p className="text-[11px] font-black uppercase tracking-widest">Manual Upload</p>
                                        <p className="text-[9px] font-medium opacity-60">Choose a custom high-fidelity cover image.</p>
                                    </div>
                                    {manualThumbnail && (
                                        <div className="size-10 rounded-lg overflow-hidden border border-white/10 shadow-lg shadow-primary-gold/10">
                                            <img src={manualThumbnail} className="size-full object-cover" alt="" />
                                        </div>
                                    )}
                                </div>
                            </button>
                            <input type="file" ref={thumbInputRef} hidden accept="image/*" onChange={handleThumbChange} />
                         </div>
                    </motion.div>
                )}



                {activeTool === 'POLL' && (
                    <motion.div 
                        key="tool-poll"
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                        className="space-y-4"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                                <BarChart size={14} className="text-primary-gold" />
                                Create Tribe Poll
                            </h4>
                            <button 
                                onClick={() => setPollData({...pollData, isQuiz: !pollData.isQuiz})}
                                className={`text-[9px] px-3 py-1 rounded-lg border font-black transition-all ${pollData.isQuiz ? 'bg-primary-gold text-black border-primary-gold shadow-lg shadow-primary-gold/20' : 'text-white/40 border-white/10 hover:border-white/20'}`}
                            >
                                {pollData.isQuiz ? "QUIZ MODE ON" : "QUIZ MODE OFF"}
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-primary-gold/60 uppercase tracking-widest ml-1">The Question</label>
                                <input 
                                    placeholder="What do you want to ask the community?"
                                    value={pollData.question}
                                    onChange={(e) => setPollData({...pollData, question: e.target.value})}
                                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-sm text-white outline-none focus:border-primary-gold/40 shadow-inner"
                                />
                            </div>
                            {pollData.options.map((opt, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <input 
                                        placeholder={`Option ${idx + 1}`}
                                        value={opt}
                                        onChange={(e) => {
                                            const newOpts = [...pollData.options];
                                            newOpts[idx] = e.target.value;
                                            setPollData({...pollData, options: newOpts});
                                        }}
                                        className="flex-1 bg-white/[0.03] border border-white/5 rounded-xl p-3 text-sm text-white outline-none focus:border-primary-gold/40"
                                    />
                                    {pollData.isQuiz && (
                                        <button 
                                            onClick={() => {
                                                const current = pollData.correctIndices;
                                                setPollData({
                                                    ...pollData, 
                                                    correctIndices: current.includes(idx) ? current.filter(i => i !== idx) : [idx] // Quiz usually 1 correct
                                                });
                                            }}
                                            className={`size-11 rounded-xl flex items-center justify-center transition-all border ${pollData.correctIndices.includes(idx) ? 'bg-green-500/20 text-green-500 border-green-500/40' : 'bg-white/5 text-white/20 border-white/10'}`}
                                        >
                                            <Sparkles size={16} />
                                        </button>
                                    )}
                                    {pollData.options.length > 2 && (
                                        <button 
                                            onClick={() => setPollData({ ...pollData, options: pollData.options.filter((_, i) => i !== idx) })}
                                            className="size-11 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500/20 border border-red-500/10"
                                        >
                                            <Minus size={16} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            {pollData.options.length < 5 && (
                                <button 
                                    onClick={() => setPollData({...pollData, options: [...pollData.options, ""]})}
                                    className="w-full py-4 border border-dashed border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-muted-custom hover:text-white hover:border-white/20 transition-all bg-white/[0.01]"
                                >
                                    + Add Option
                                </button>
                            )}

                            <div className="pt-6 border-t border-white/5 space-y-4">
                                <h5 className="text-[9px] font-black text-white/30 uppercase tracking-widest">Poll Settings</h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-bold text-muted-custom uppercase tracking-widest ml-1">Voting Ends At</label>
                                        <div className="relative">
                                            <Calendar size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                                            <input 
                                                type="datetime-local"
                                                value={pollData.endsAt}
                                                onChange={(e) => setPollData({...pollData, endsAt: e.target.value})}
                                                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-3 pl-11 pr-4 text-[11px] text-white outline-none focus:border-primary-gold/40 transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-bold text-muted-custom uppercase tracking-widest ml-1">Multiple Choice</label>
                                        <button 
                                            onClick={() => setPollData({...pollData, allowMultiple: !pollData.allowMultiple})}
                                            className={`w-full flex items-center justify-between py-3 px-4 rounded-2xl border transition-all ${pollData.allowMultiple ? 'bg-primary-gold/10 border-primary-gold/30 text-primary-gold' : 'bg-white/[0.03] border-white/5 text-white/40'}`}
                                        >
                                            <span className="text-[9px] font-black uppercase tracking-widest">Allow Multiple Votes</span>
                                            <div className={`size-3.5 rounded border ${pollData.allowMultiple ? 'bg-primary-gold border-primary-gold' : 'border-white/20'}`} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTool === 'DOCUMENT' && (
                    <motion.div 
                        key="tool-doc"
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                        className="space-y-6"
                    >
                         <div className="p-6 rounded-2xl bg-primary-gold/5 border border-primary-gold/10 flex items-start gap-4">
                            <Info size={20} className="text-primary-gold mt-1 shrink-0" />
                            <div>
                                <h4 className="text-xs font-black text-white uppercase tracking-widest mb-1">Academic & Legal Repository</h4>
                                <p className="text-[10px] text-muted-custom font-medium leading-relaxed uppercase">You can share PDFs, DOCX, and PPTX. Users will be warned before downloading sensitive documents.</p>
                            </div>
                         </div>

                         <div className="grid grid-cols-1 gap-3">
                            {documents.map((doc, idx) => (
                                <div key={idx} className="flex items-center gap-4 p-4 bg-white/[0.03] border border-white/5 rounded-2xl group">
                                    <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-primary-gold">
                                        <FileText size={20} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-white truncate">{doc.name}</p>
                                        <p className="text-[9px] font-black text-muted-custom uppercase">{(doc.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                    <button 
                                        onClick={() => setDocuments(prev => prev.filter((_, i) => i !== idx))}
                                        className="size-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}

                            <button 
                                onClick={() => docInputRef.current?.click()}
                                className="w-full py-8 border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center gap-2 hover:bg-white/[0.02] hover:border-primary-gold/20 transition-all"
                            >
                                <Plus size={24} className="text-muted-custom" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-custom">Attach Files</span>
                            </button>
                            <input type="file" ref={docInputRef} hidden accept=".pdf,.doc,.docx,.pptx,.txt" multiple onChange={handleDocChange} />
                         </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Combined Media Preview Bar (Always visible at bottom of content if exists) */}
            <div className="mt-8">
                {videoPreview && (
                    <div className="relative rounded-2xl overflow-hidden border border-primary-gold/20 bg-black aspect-video group shadow-2xl">
                        <video 
                          src={videoPreview} 
                          className="size-full object-cover opacity-60" 
                          muted 
                          playsInline 
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                            <div className="size-12 rounded-full bg-primary-gold/20 border border-primary-gold/40 flex items-center justify-center text-primary-gold animate-pulse">
                                <Film size={24} />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary-gold">{isLongVideo ? "Theater Master Loaded" : "Spark Prepared"}</span>
                        </div>
                        <button 
                            onClick={removeVideo}
                            className="absolute top-3 right-3 p-2 bg-black/60 rounded-xl text-white hover:bg-red-500/80 transition-all backdrop-blur-md border border-white/10"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}

                {mediaItems.length > 0 && (
                    <div className="grid grid-cols-2 gap-3">
                        {mediaItems.map((item, idx) => (
                            <div key={idx} className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 group shadow-lg">
                                <img src={item.src} className="size-full object-cover" alt="" />
                                <button 
                                    onClick={() => setMediaItems(prev => prev.filter((_, i) => i !== idx))}
                                    className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {error && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 mt-4">
                  <AlertCircle size={16} className="text-red-500" />
                  <p className="text-[11px] font-black text-red-500 uppercase tracking-widest">{error}</p>
              </div>
            )}
            
            {/* Footer Spacer */}
            <div className="h-6" />
          </div>

          {/* Premium Footer Toolbar */}
          <div className="px-6 py-4 border-t border-white/5 bg-black/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={videoFile !== null}
                className="size-10 rounded-xl flex items-center justify-center text-primary-gold hover:bg-primary-gold/10 transition-all border border-primary-gold/20 active:scale-95 disabled:opacity-20"
              >
                <ImageIcon size={20} />
              </button>
              <button 
                onClick={() => videoInputRef.current?.click()}
                disabled={mediaItems.length > 0}
                className="size-10 rounded-xl flex items-center justify-center text-primary-gold hover:bg-primary-gold/10 transition-all border border-primary-gold/20 active:scale-95 disabled:opacity-20"
              >
                <Video size={20} />
              </button>
              
              <input type="file" ref={fileInputRef} accept="image/*" multiple hidden onChange={handleImageChange} />
              <input type="file" ref={videoInputRef} accept="video/*" hidden onChange={handleVideoChange} />
            </div>

            <div className="flex items-center gap-3">

              <button 
                onClick={() => setActiveTool(activeTool === 'POLL' ? 'POST' : 'POLL')}
                className={`size-10 rounded-xl flex items-center justify-center transition-all border active:scale-95 ${activeTool === 'POLL' ? 'bg-primary-gold text-black border-primary-gold' : 'text-primary-gold border-primary-gold/20 hover:bg-primary-gold/10'}`}
              >
                <BarChart size={20} />
              </button>
              <button 
                onClick={() => setActiveTool(activeTool === 'DOCUMENT' ? 'POST' : 'DOCUMENT')}
                className={`size-10 rounded-xl flex items-center justify-center transition-all border active:scale-95 ${activeTool === 'DOCUMENT' ? 'bg-primary-gold text-black border-primary-gold' : 'text-primary-gold border-primary-gold/20 hover:bg-primary-gold/10'}`}
              >
                <FileText size={20} />
              </button>
            </div>

            <div className="flex items-center gap-5">
              <div className="text-right">
                <p className={`text-[10px] font-black tracking-widest ${content.length > MAX_CHARS ? 'text-red-500' : 'text-white/20'}`}>
                    {content.length} <span className="text-[8px] font-normal opacity-50">/ {MAX_CHARS}</span>
                </p>
              </div>
              
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || (
                    (activeTool === 'POST' && !content.trim() && !mediaItems.length && !quoteTarget) ||
                    (activeTool === 'VIDEO' && !videoFile) ||

                    (activeTool === 'POLL' && (!pollData.question.trim() || pollData.options.some(o => !o.trim()))) ||
                    (activeTool === 'DOCUMENT' && !documents.length)
                )}
                className="h-11 px-8 rounded-2xl bg-primary-gold text-black text-[11px] font-black uppercase tracking-[0.2em] shadow-[0_10px_20px_rgba(212,175,55,0.2)] hover:brightness-110 active:scale-95 transition-all disabled:opacity-30 disabled:grayscale"
              >
                {isSubmitting ? (
                    <div className="flex items-center gap-2">
                        <Loader2 size={16} className="animate-spin" />
                        <span>Posting...</span>
                    </div>
                ) : (videoFile ? (isLongVideo ? "Curate Theater" : "Curate Spark") : "Publish")}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
