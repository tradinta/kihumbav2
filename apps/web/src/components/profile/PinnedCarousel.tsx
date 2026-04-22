'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pin, ChevronLeft, ChevronRight } from 'lucide-react';
import PostCard from '@/components/feed/PostCard';

interface PinnedCarouselProps {
  posts: any[];
}

export default function PinnedCarousel({ posts }: PinnedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play
  useEffect(() => {
    if (posts.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % posts.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [posts.length]);

  if (posts.length === 0) return null;

  const next = () => setCurrentIndex((prev) => (prev + 1) % posts.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + posts.length) % posts.length);

  return (
    <div className="relative mb-6 group">
      {/* Badge */}
      <div className="flex items-center gap-1.5 mb-3 px-1">
        <Pin size={10} className="text-primary-gold animate-pulse" />
        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary-gold gold-glow">
          Pinned Collection
        </span>
      </div>

      {/* Main Carousel */}
      <div className="relative overflow-hidden rounded-2xl ring-1 ring-primary-gold/20 bg-primary-gold/[0.02]">
        <AnimatePresence mode="wait">
          <motion.div
            key={posts[currentIndex].id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <PostCard post={posts[currentIndex]} index={currentIndex} />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {posts.length > 1 && (
            <>
                <button 
                    onClick={prev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 size-8 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/50 hover:text-primary-gold transition-all opacity-0 group-hover:opacity-100"
                >
                    <ChevronLeft size={16} />
                </button>
                <button 
                    onClick={next}
                    className="absolute right-2 top-1/2 -translate-y-1/2 size-8 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/50 hover:text-primary-gold transition-all opacity-0 group-hover:opacity-100"
                >
                    <ChevronRight size={16} />
                </button>
            </>
        )}

        {/* Progress Dots */}
        {posts.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                {posts.map((_, i) => (
                    <div 
                        key={i} 
                        className={`h-1 rounded-full transition-all duration-500 ${
                            i === currentIndex ? 'w-4 bg-primary-gold' : 'w-1 bg-white/20'
                        }`} 
                    />
                ))}
            </div>
        )}
      </div>

      {/* Subtle Bottom Glow */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-primary-gold/5 blur-xl rounded-full -z-10" />
    </div>
  );
}
