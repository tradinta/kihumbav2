"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, X, ChevronLeft, ChevronRight, Eye, Trash2, Flame, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import CreateFireModal from "./CreateFireModal";

const SLIDE_DURATION = 5000;

interface Fire {
  id: string;
  mediaUrl: string;
  content: string;
  viewCount: number;
  createdAt: string;
  expiresAt: string;
}

interface UserWithFires {
  id: string;
  username: string;
  name: string;
  image: string;
  avatar?: string;
  fires: Fire[];
}

export default function FiresBar() {
  const { user: currentUser } = useAuth();
  const [usersWithFires, setUsersWithFires] = useState<UserWithFires[]>([]);
  const [activeStoryIdx, setActiveStoryIdx] = useState<number | null>(null);
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [showViewers, setShowViewers] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const fetchFires = async () => {
    setIsLoading(true);
    try {
      const data = await api.get('/fires');
      setUsersWithFires(data);
    } catch (err) {
      console.error('Failed to fetch fires:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFires();
  }, []);

  const activeUser = activeStoryIdx !== null ? usersWithFires[activeStoryIdx] : null;
  const activeFire = activeUser && activeUser.fires[activeSlideIdx];

  const nextSlide = () => {
    if (activeStoryIdx === null || !activeUser) return;

    if (activeSlideIdx < activeUser.fires.length - 1) {
      setActiveSlideIdx(prev => prev + 1);
      setProgress(0);
    } else {
      // Next user
      if (activeStoryIdx < usersWithFires.length - 1) {
        handleStoryClick(activeStoryIdx + 1);
      } else {
        closeStory();
      }
    }
  };

  const prevSlide = () => {
    if (activeStoryIdx === null || !activeUser) return;

    if (activeSlideIdx > 0) {
      setActiveSlideIdx(prev => prev - 1);
      setProgress(0);
    } else {
      // Previous user
      if (activeStoryIdx > 0) {
        handleStoryClick(activeStoryIdx - 1, true);
      } else {
        setActiveSlideIdx(0);
        setProgress(0);
      }
    }
  };

  const closeStory = () => {
    setActiveStoryIdx(null);
    setActiveSlideIdx(0);
    setProgress(0);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleStoryClick = async (idx: number, startAtEnd = false) => {
    setActiveStoryIdx(idx);
    const user = usersWithFires[idx];
    const slideIdx = startAtEnd ? user.fires.length - 1 : 0;
    setActiveSlideIdx(slideIdx);
    setProgress(0);

    // Increment View on first slide
    const fire = user.fires[slideIdx];
    if (fire && user.id !== currentUser?.id) {
       api.post(`/fires/${fire.id}/view`).catch(console.error);
    }
  };

  const handleDeleteFire = async (e: React.MouseEvent, fireId: string) => {
    e.stopPropagation();
    if (!confirm('Extinguish this fire permanently?')) return;

    try {
      await api.delete(`/fires/${fireId}`);
      closeStory();
      fetchFires();
    } catch (err) {
      console.error('Failed to delete fire:', err);
    }
  };

  useEffect(() => {
    if (activeStoryIdx === null || !activeFire) return;

    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const newProgress = (elapsed / SLIDE_DURATION) * 100;

      if (newProgress >= 100) {
        nextSlide();
      } else {
        setProgress(newProgress);
      }
    }, 16);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeStoryIdx, activeSlideIdx, activeFire]);

  // Record view when slide changes
  useEffect(() => {
    if (activeFire && activeUser && activeUser.id !== currentUser?.id) {
       api.post(`/fires/${activeFire.id}/view`).catch(console.error);
    }
  }, [activeSlideIdx]);

  return (
    <div className="px-4 py-3">
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1 items-center">
        {/* Your Create Trigger */}
        <button 
          onClick={() => setIsCreateOpen(true)}
          className="flex flex-col items-center gap-1.5 shrink-0 group"
        >
          <div className="size-14 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center bg-white/5 hover:border-orange-500/40 hover:bg-orange-500/5 transition-all">
             <Plus size={20} className="text-zinc-500 group-hover:text-orange-500 transition-colors" />
          </div>
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest group-hover:text-white transition-colors">Add Fire</span>
        </button>

        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="size-14 rounded-full bg-white/5 animate-pulse shrink-0" />
          ))
        ) : (
          usersWithFires.map((user, idx) => {
            const accountType = (user as any).accountType || 'NORMAL';
            const tier = (user as any).subscriptionTier || 'FREE';
            const shape = accountType === 'NORMAL' ? 'rounded-full' : 'rounded-[25%]';
            
            return (
              <button
                key={user.id}
                onClick={() => handleStoryClick(idx)}
                className="flex flex-col items-center gap-1.5 shrink-0 group"
              >
                <div className="relative">
                  <div className={cn(
                    "p-[2.5px] transition-all duration-500",
                    shape,
                    accountType === 'NORMAL' && tier === 'PLUS' ? 'animate-torch-bg' : 
                    idx % 2 === 0 ? "bg-gradient-to-tr from-orange-500 to-yellow-500" : "bg-white/10"
                  )}>
                    <div className={cn("size-14 bg-black p-[1.5px]", shape)}>
                      <img
                        src={user.avatar || user.image || "/branding/avatar-fallback.png"}
                        alt={user.name}
                        className={cn("w-full h-full object-cover group-hover:scale-110 transition-transform duration-500", shape)}
                      />
                    </div>
                  </div>
                  {/* Fire Count Badge */}
                  <div className="absolute -top-1 -right-1 size-5 rounded-full bg-orange-600 flex items-center justify-center shadow-lg border border-black z-10">
                    <span className="text-[9px] font-black text-white leading-none">{user.fires.length}</span>
                  </div>
                </div>
                <span className={cn(
                  "text-[9px] font-black truncate max-w-[64px] uppercase tracking-tighter transition-colors",
                  accountType === 'NORMAL' && tier === 'PLUS' ? 'animate-torch-text' : 'text-zinc-400 group-hover:text-white'
                )}>
                  {user.id === currentUser?.id ? "YOU" : user.name.split(' ')[0]}
                </span>
              </button>
            );
          })
        )}
      </div>

      {/* Story Viewer Overlay */}
      {activeUser && activeFire && (
        <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center p-0 lg:p-10">
          <button 
            onClick={prevSlide}
            className="hidden lg:flex absolute left-10 top-1/2 -translate-y-1/2 size-12 rounded-full bg-white/10 hover:bg-white/20 text-white items-center justify-center z-[210]"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={nextSlide}
            className="hidden lg:flex absolute right-10 top-1/2 -translate-y-1/2 size-12 rounded-full bg-white/10 hover:bg-white/20 text-white items-center justify-center z-[210]"
          >
            <ChevronRight size={24} />
          </button>

          <button 
            onClick={closeStory}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-[210]"
          >
            <X size={24} />
          </button>
          
          <div className="relative w-full max-w-md aspect-[9/16] bg-black rounded-none lg:rounded-3xl overflow-hidden shadow-2xl border-x border-white/5 flex flex-col">
            {/* Progress Bar */}
            <div className="absolute top-4 left-4 right-4 flex gap-1 z-[210]">
              {activeUser.fires.map((_, i) => (
                <div key={i} className="h-0.5 flex-1 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white transition-all duration-[16ms] linear"
                    style={{ 
                      width: i < activeSlideIdx ? "100%" : i === activeSlideIdx ? `${progress}%` : "0%" 
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Header */}
            <div className="p-6 flex items-center justify-between z-[210] bg-gradient-to-b from-black/60 to-transparent">
              <div className="flex items-center gap-3">
                <img src={activeUser.avatar || activeUser.image || "/branding/avatar-fallback.png"} alt="" className="size-9 rounded-full border border-white/20" />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white">{activeUser.name}</span>
                  <span className="text-[10px] text-white/60 font-black uppercase tracking-tighter">Fire {activeSlideIdx + 1} of {activeUser.fires.length}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {activeUser.id === currentUser?.id && (
                  <>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowViewers(true);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-md hover:bg-white/20 transition-all"
                    >
                       <Eye size={12} className="text-white/60" />
                       <span className="text-[10px] font-bold text-white">{activeFire.viewCount}</span>
                    </button>
                    <button 
                      onClick={(e) => handleDeleteFire(e, activeFire.id)}
                      className="p-2 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Content (Image Background) */}
            <div className="absolute inset-0 bg-zinc-900">
               <img 
                 key={activeFire.id}
                 src={activeFire.mediaUrl} 
                 className="w-full h-full object-cover animate-fade-in"
                 alt=""
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
            </div>

            {/* Overlay Text */}
            <div className="relative flex-1 flex items-end justify-center p-10 pb-20 text-center z-[210]">
              <p className="text-xl font-bold text-white leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                {activeFire.content}
              </p>
            </div>

            {/* Tap Regions */}
            <div className="absolute inset-0 flex z-[205]">
              <div className="w-1/3 h-full cursor-pointer" onClick={prevSlide} />
              <div className="w-2/3 h-full cursor-pointer" onClick={nextSlide} />
            </div>

            {/* Footer */}
            <div className="p-6 mt-auto z-[210]">
              <div className="w-full h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-5 flex items-center">
                <span className="text-xs text-white/40">Reply to {activeUser.name.split(' ')[0]}...</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <CreateFireModal 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
        onSuccess={fetchFires}
      />
      {/* Viewers Modal */}
      <ViewersModal 
        isOpen={showViewers} 
        onClose={() => setShowViewers(false)} 
        fireId={activeFire?.id || ''} 
      />
    </div>
  );
}

function ViewersModal({ isOpen, onClose, fireId }: { isOpen: boolean; onClose: () => void; fireId: string }) {
  const [viewers, setViewers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && fireId) {
      setIsLoading(true);
      api.get(`/fires/${fireId}/viewers`)
        .then(res => setViewers(res))
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, fireId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose} 
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-xs bg-zinc-900 rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
      >
        <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-white">Fire Viewers</h3>
          <button onClick={onClose} className="p-1 text-zinc-500 hover:text-white transition-colors">
            <X size={14} />
          </button>
        </div>
        <div className="max-h-60 overflow-y-auto p-2">
          {isLoading ? (
            <div className="py-8 flex justify-center"><Loader2 className="animate-spin text-zinc-500" size={20} /></div>
          ) : viewers.length === 0 ? (
            <div className="py-8 text-center"><p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">No views yet</p></div>
          ) : (
            <div className="space-y-1">
              {viewers.map((v) => (
                <div key={v.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <img 
                    src={v.viewer.avatar || v.viewer.image || "/branding/avatar-fallback.png"} 
                    alt="" 
                    className="size-8 rounded-full border border-white/10" 
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white">{v.viewer.name}</span>
                    <span className="text-[9px] text-zinc-500">@{v.viewer.username}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

