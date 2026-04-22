'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, MoreVertical, Music, UserPlus, Volume2, VolumeX, ArrowLeft } from 'lucide-react';
import MuxPlayer from '../shared/MuxPlayer';
import Link from 'next/link';

interface Spark {
  id: string;
  playbackId?: string | null;
  videoUrl?: string | null;
  title: string;
  author: {
    username: string;
    avatar?: string;
  };
  duration: number;
}

interface SparksFeedProps {
  sparks: Spark[];
  initialIndex?: number;
}

export default function SparksFeed({ sparks, initialIndex = 0 }: SparksFeedProps) {
  const [activeId, setActiveId] = useState(sparks[initialIndex]?.id || sparks[0]?.id);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.getAttribute('data-id') || '');
          }
        });
      },
      { threshold: 0.8 }
    );

    const elements = containerRef.current?.querySelectorAll('[data-id]');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [sparks]);

  return (
    <div 
      ref={containerRef}
      className="h-[calc(100vh-64px)] sm:h-[calc(100vh-80px)] overflow-y-scroll snap-y snap-mandatory bg-black rounded-xl"
    >
      {sparks.map((spark) => (
        <SparkItem 
          key={spark.id} 
          spark={spark} 
          isActive={activeId === spark.id} 
        />
      ))}
    </div>
  );
}

function SparkItem({ spark, isActive }: { spark: Spark; isActive: boolean }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  return (
    <div 
      data-id={spark.id}
      className="relative h-full w-full snap-start overflow-hidden flex items-center justify-center"
    >
      {/* Mux Player */}
      <MuxPlayer
        playbackId={spark.playbackId}
        videoUrl={spark.videoUrl}
        title={spark.title}
        autoPlay={isActive}
        muted={isMuted}
        className="w-full h-full object-cover"
      />

      {/* Overlay Content */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />

      {/* Right Side Actions */}
      <div className="absolute right-3 bottom-24 flex flex-col items-center gap-6 pointer-events-auto">
        <div className="flex flex-col items-center gap-1">
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className={`size-12 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${isLiked ? 'bg-primary-gold text-black' : 'bg-black/20 text-white'}`}
          >
            <Heart size={24} fill={isLiked ? 'currentColor' : 'none'} />
          </button>
          <span className="text-[10px] font-bold text-white shadow-sm">1.2k</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <button className="size-12 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white">
            <MessageCircle size={24} />
          </button>
          <span className="text-[10px] font-bold text-white shadow-sm">84</span>
        </div>

        <button className="size-12 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white">
          <Share2 size={24} />
        </button>

        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="size-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white mt-4 border border-white/10"
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>

      {/* Bottom Text Content */}
      <div className="absolute left-4 bottom-6 right-16 pointer-events-auto">
        <div className="flex items-center gap-2 mb-3">
          <div className="size-10 rounded-full bg-primary-gold/20 border border-primary-gold/40 overflow-hidden">
            {/* Avatar here */}
            <div className="w-full h-full bg-gradient-to-br from-primary-gold to-accent-gold" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              @{spark.author.username}
              <button className="bg-primary-gold text-black text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight ml-1">
                Follow
              </button>
            </h4>
          </div>
        </div>

        <p className="text-sm text-white/90 font-medium mb-3 line-clamp-3">
          {spark.title}
        </p>

        <div className="flex items-center gap-2">
          <div className="bg-black/30 backdrop-blur-sm rounded-full py-1 px-3 flex items-center gap-2 border border-white/10">
            <Music size={12} className="text-primary-gold" />
            <span className="text-[10px] text-white/80 font-bold uppercase tracking-widest whitespace-nowrap overflow-hidden">
              <span className="inline-block animate-scroll-text">Original Audio - @{spark.author.username}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
