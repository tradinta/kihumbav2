'use client';

import React from 'react';
import VideosGrid from '@/components/feed/VideosGrid';
import LeftSidebar from '@/components/LeftSidebar';
import BottomNav from '@/components/BottomNav';
import ModeSelector from '@/components/ModeSelector';
import TopBar from '@/components/TopBar';
import { Search, Bell, Mail, User, TrendingUp, Sparkles } from 'lucide-react';

export default function VideosPage() {
  return (
    <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row min-h-screen lg:px-6 gap-6">
      <LeftSidebar />

      <main className="flex-1 w-full max-w-3xl mx-auto lg:mx-0 pt-0 lg:pt-4 pb-32 lg:pb-12">
        <TopBar />
        <ModeSelector activeMode="videos" />

        <div className="px-4">
          <VideosGrid />
        </div>
      </main>

      {/* Right Sidebar - High Fidelity Discovery */}
      <aside className="hidden xl:flex flex-col w-72 shrink-0 gap-8 pt-4">
        <div className="card-surface rounded-lg p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-primary-gold" />
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-main">Hot Trends</h2>
            </div>
            <div className="size-2 rounded-full bg-primary-gold animate-pulse" />
          </div>
          
          <div className="space-y-5">
            {[
              { tag: 'TECH_AFRICA', views: '2.4M' },
              { tag: 'NAIROBI_NIGHTS', views: '890k' },
              { tag: 'KIHUMBA_LIVE', views: '124k' }
            ].map((trend) => (
              <div key={trend.tag} className="flex flex-col gap-1 group cursor-pointer">
                <span className="text-xs font-bold text-main group-hover:text-primary-gold transition-colors">#{trend.tag}</span>
                <span className="text-[9px] text-muted-custom uppercase font-bold tracking-widest">{trend.views} Impressions</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card-surface rounded-lg p-6 space-y-6">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-primary-gold" />
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-main">Curated Discovery</h2>
          </div>
          
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-4 items-center group cursor-pointer">
                <div className="size-14 rounded bg-zinc-900 overflow-hidden shrink-0 border border-custom">
                  <img 
                    src={`https://images.unsplash.com/photo-${i === 1 ? '1501339847302-ac226a769586' : '1544928147-79a2dbc1f389'}?q=80&w=100&auto=format&fit=crop`} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" 
                    alt="" 
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-main line-clamp-1 group-hover:text-primary-gold transition-colors">
                    {i === 1 ? 'High Altitude Training' : 'Nairobi Skyline 4K'}
                  </span>
                  <span className="text-[9px] text-muted-custom uppercase font-bold tracking-widest">9.1k Views</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <BottomNav />
    </div>
  );
}
