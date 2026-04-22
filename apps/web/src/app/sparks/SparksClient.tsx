'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import SparksFeed from '@/components/feed/SparksFeed';
import LeftSidebar from '@/components/LeftSidebar';
import BottomNav from '@/components/BottomNav';
import { Loader2, ArrowLeft } from 'lucide-react';
import ModeSelector from '@/components/ModeSelector';
import TopBar from '@/components/TopBar';
import { SparkCard } from '@/components/feed/SparksGrid';
import { GridSkeleton } from '@/components/feed/SkeletonCard';

export default function SparksPage() {
  const [sparks, setSparks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'player'>('grid');
  const [initialIndex, setInitialIndex] = useState(0);

  useEffect(() => {
    async function fetchSparks() {
      try {
        const data = await api.get('/posts?tab=SPARK&sort=RECOMMENDED');
        const postArray = data.posts || [];
        
        const mappedSparks = postArray
          .filter((post: any) => !post.isDeleted && post.video)
          .map((post: any) => ({
            id: post.id,
            playbackId: post.video?.playbackId,
            videoUrl: post.video?.videoUrl,
            title: post.content,
            author: post.author,
            duration: post.video?.duration || 0,
            viewCount: post.video?.viewCount || 0,
            interactionCount: post._count?.interactions || 0,
            _count: post._count
          }));
        setSparks(mappedSparks);
      } catch (err) {
        console.error("Failed to fetch sparks", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSparks();
  }, []);

  const handleSparkClick = (index: number) => {
    setInitialIndex(index);
    setViewMode('player');
  };

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row min-h-screen lg:px-6 gap-6 bg-page">
      <div className="hidden lg:block">
        <LeftSidebar />
      </div>

      <main className="flex-1 w-full max-w-4xl mx-auto pt-0 lg:pt-4 pb-32 lg:pb-12 min-h-screen flex flex-col">
        <TopBar />
        <ModeSelector activeMode="sparks" />

        <div className="flex-1 flex flex-col">
          {loading ? (
            <GridSkeleton type="sparks" />
          ) : viewMode === 'grid' ? (
            <div className="px-4">
               {/* Mobile Header matching Sparks/Marketplace */}
               <div className="lg:hidden flex items-center justify-between mb-6">
                  <h1 className="text-lg font-bold tracking-tight text-main">Sparks</h1>
                  <div className="flex items-center gap-3">
                     <div className="size-8 rounded-full bg-muted-custom/10 flex items-center justify-center text-muted-custom"><Loader2 size={16} /></div>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  {sparks.map((spark, index) => (
                    <SparkCard 
                      key={spark.id} 
                      spark={spark} 
                      index={index} 
                      onClick={() => handleSparkClick(index)}
                    />
                  ))}
               </div>
               
               {sparks.length === 0 && (
                  <div className="py-20 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-custom/40">No content found</p>
                  </div>
               )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center">
               <div className="w-full max-w-lg relative h-screen sm:h-[calc(100vh-160px)] overflow-hidden bg-black rounded-3xl border border-custom shadow-2xl">
                  {/* Close Player Button */}
                  <button 
                    onClick={() => setViewMode('grid')}
                    className="absolute top-4 left-4 z-50 size-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/10 hover:bg-black/60 transition-all"
                  >
                    <ArrowLeft size={20} />
                  </button>

                  <SparksFeed sparks={sparks} initialIndex={initialIndex} />
               </div>
            </div>
          )}
        </div>
      </main>

      <div className="hidden lg:block w-[350px]">
        {/* Recommended Creators or Tags */}
      </div>

      <BottomNav />
    </div>
  );
}
