'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, Eye } from 'lucide-react';

interface RelatedVideo {
  id: string;
  title: string;
  playbackId?: string | null;
  videoUrl?: string | null;
  thumbnailUrl?: string | null;
  viewCount: number;
  duration: number;
  author: {
    username: string;
    fullName?: string;
  };
}

export default function RelatedVideos({ videos }: { videos: RelatedVideo[] }) {
  if (!videos || videos.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 stagger-children">
      <div className="flex items-center justify-between mb-2">
         <h3 className="text-sm font-black uppercase tracking-widest text-brand-gold opacity-80">Cinematic Recs</h3>
         <span className="text-[10px] font-bold text-muted-custom uppercase tracking-widest">Auto-Pulse: ON</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {videos.map((video, index) => (
          <Link href={`/videos/${video.id}`} key={video.id}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group cursor-pointer flex flex-col gap-3"
            >
              <div className="aspect-video relative rounded-xl overflow-hidden bg-black border border-white/5 shadow-lg">
                <img 
                  src={video.thumbnailUrl || (video.playbackId ? `https://image.mux.com/${video.playbackId}/thumbnail.jpg?time=2` : '/kihumba_cover_fallback_1776336123803.png')} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  alt={video.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                
                {/* Play Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="size-10 rounded-full bg-brand-gold flex items-center justify-center pl-0.5 shadow-xl">
                      <Play size={16} fill="black" className="text-black" />
                   </div>
                </div>

                <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-md rounded-lg px-2 py-0.5 border border-white/10">
                   <span className="text-[9px] font-black text-white">
                     {Math.floor(video.duration / 60)}:{(Math.round(video.duration % 60)).toString().padStart(2, '0')}
                   </span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <h4 className="text-[12px] font-bold text-white line-clamp-1 group-hover:text-brand-gold transition-colors">
                  {video.title}
                </h4>
                <div className="flex items-center gap-2">
                   <span className="text-[10px] font-bold text-muted-custom/60 uppercase tracking-widest">@{video.author.username}</span>
                   <span className="text-[10px] text-muted-custom/40">•</span>
                   <span className="flex items-center gap-1 text-[9px] font-bold text-muted-custom/60 uppercase">
                      <Eye size={10} /> {video.viewCount} Views
                   </span>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
