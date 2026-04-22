'use client';

import React, { useRef, useState, useEffect } from 'react';
import MuxPlayer from '@mux/mux-player-react';
import { Play, Volume2, VolumeX, Maximize } from 'lucide-react';

interface MuxPlayerProps {
  playbackId?: string | null;
  videoUrl?: string | null;
  title?: string;
  isHoverPreview?: boolean;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  poster?: string;
}

export default function CustomMuxPlayer({ 
  playbackId, 
  videoUrl,
  title, 
  isHoverPreview = false,
  className = "",
  autoPlay = false,
  muted = false,
  poster
}: MuxPlayerProps) {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHoverPreview && playerRef.current) {
      if (isHovered) {
        playerRef.current.play();
      } else {
        playerRef.current.pause();
        playerRef.current.currentTime = 0;
      }
    }
  }, [isHovered, isHoverPreview]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting && playerRef.current) {
            playerRef.current.pause();
          }
        });
      },
      { threshold: 0.2 } 
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (isHoverPreview) {
    return (
      <div 
        className={`relative w-full h-full overflow-hidden ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <MuxPlayer
          ref={playerRef}
          playbackId={videoUrl ? undefined : (playbackId || undefined)}
          src={videoUrl || undefined}
          metadata={{ video_title: title }}
          streamType="on-demand"
          muted={true}
          loop={true}
          poster={poster}
          placeholder="blur"
          className="w-full h-full object-cover pointer-events-none"
        />
        {!isHovered && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition-colors">
            <div className="size-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
              <Play size={16} fill="white" className="text-white ml-1" />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative rounded-xl overflow-hidden card-surface ${className}`}>
      <MuxPlayer
        ref={playerRef}
        playbackId={videoUrl ? undefined : (playbackId || undefined)}
        src={videoUrl || undefined}
        metadata={{ video_title: title }}
        streamType="on-demand"
        autoPlay={autoPlay}
        muted={muted}
        poster={poster}
        className="w-full h-full border-none"
        primaryColor="var(--color-primary-gold)"
        secondaryColor="var(--color-bg-base)"
      />
    </div>
  );
}
