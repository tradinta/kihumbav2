'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Eye, Heart } from 'lucide-react';
import { api } from '@/lib/api';
import MuxPlayer from '../shared/MuxPlayer';
import Link from 'next/link';
import { GridSkeleton } from './SkeletonCard';

import { usePostContext } from '@/context/PostContext';
import InfiniteScroll from '@/components/shared/InfiniteScroll';

export default function SparksGrid() {
  const { posts: sparks, isLoading: loading, loadFeed, hasMore, setActiveTab } = usePostContext();

  useEffect(() => {
    setActiveTab('SPARK');
    loadFeed(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <GridSkeleton type="sparks" />;
  }

  if (sparks.length === 0) {
    return (
      <div className="text-center py-20 px-4 card-surface rounded-3xl border border-dashed border-custom mx-4">
        <div className="size-16 rounded-full bg-primary-gold/5 flex items-center justify-center mx-auto mb-4 grayscale opacity-20">
           <Play size={32} className="text-primary-gold" />
        </div>
        <h2 className="text-sm font-black uppercase tracking-widest opacity-40">Absolute Quiet</h2>
        <p className="text-[10px] font-bold text-muted-custom/60 uppercase tracking-widest mt-2 px-8">No sparks yet. Be the first to ignite the feed!</p>
      </div>
    );
  }

  return (
    <InfiniteScroll 
      hasMore={hasMore} 
      isLoading={loading} 
      onLoadMore={() => loadFeed(false)}
      className="px-4"
    >
      <div className="grid grid-cols-2 gap-4">
        {sparks.map((spark, index) => (
          <SparkCard key={spark.id} spark={spark} index={index} />
        ))}
      </div>
    </InfiniteScroll>
  );
}

export function SparkCard({ spark, index, onClick }: { spark: any; index: number; onClick?: () => void }) {
  if (!spark) return null;

  const author = spark.author;
  const title = spark.title || spark.content;
  const viewCount = spark.viewCount || 0;
  const interactionCount = spark.interactionCount || 0;
  const duration = spark.duration || 0;

  const formatCount = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  const formatDuration = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.round(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      onClick={onClick}
      className="relative aspect-[3/4] rounded-[24px] overflow-hidden group cursor-pointer border border-custom shadow-xl active:scale-[0.98] transition-all"
    >
      {/* Visual Hub */}
      <div className="absolute inset-0 bg-zinc-900">
        {spark.playbackId ? (
          <MuxPlayer 
            playbackId={spark.playbackId}
            videoUrl={spark.videoUrl}
            title={title}
            isHoverPreview={true}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-black flex items-center justify-center">
             <Play size={24} className="text-white/20" />
          </div>
        )}
      </div>

      {/* Industrial Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
      
      {/* Duration Pulse — Top Right */}
      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md border border-white/10 text-white text-[9px] font-black px-2 py-1 rounded-md flex items-center gap-1.5">
          <Play size={8} fill="currentColor" /> {formatDuration(duration)}
      </div>

      {/* Identity Stack — Bottom Left */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-0.5">
          <h4 className="text-white text-[11px] font-bold leading-tight line-clamp-1 group-hover:text-primary-gold transition-colors">
            {title}
          </h4>
          <span className="text-white/60 text-[9px] font-bold tracking-tight">
            @{author?.username || 'anonymous'}
          </span>
          <div className="flex items-center gap-3 mt-1.5">
              <span className="flex items-center gap-1 text-[9px] font-black text-white/40">
                <Eye size={10} strokeWidth={2.5} /> {formatCount(viewCount)}
              </span>
              <span className="flex items-center gap-1 text-[9px] font-black text-white/40">
                <Heart size={10} strokeWidth={2.5} /> {formatCount(interactionCount)}
              </span>
          </div>
      </div>
    </motion.div>
  );
}
