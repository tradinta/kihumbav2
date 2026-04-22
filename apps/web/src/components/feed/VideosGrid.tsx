'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Film } from 'lucide-react';
import PostCard from '@/components/feed/PostCard';
import InfiniteScroll from '@/components/shared/InfiniteScroll';
import { usePostContext } from '@/context/PostContext';

export default function VideosGrid() {
  const { posts, isLoading: loading, loadFeed, hasMore, setActiveTab } = usePostContext();

  useEffect(() => {
    setActiveTab('VIDEO');
    loadFeed(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="px-4 space-y-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse card-surface rounded-xl overflow-hidden shadow-sm">
            <div className="aspect-video bg-zinc-900/50" />
            <div className="p-4 flex gap-3 items-center">
              <div className="size-9 rounded-full bg-zinc-900/50" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-zinc-900/50 rounded w-2/3" />
                <div className="h-2 bg-zinc-900/50 rounded w-1/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
        <div className="size-20 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-200">
          <Film size={40} />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-bold uppercase tracking-widest text-main">No content found</h3>
          <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-widest max-w-xs">The theater is currently empty. Check back later for new arrivals.</p>
        </div>
      </div>
    );
  }

  return (
    <InfiniteScroll 
      hasMore={hasMore} 
      isLoading={loading} 
      onLoadMore={() => loadFeed(false)}
      className="px-4 space-y-6 animate-fade-in-up"
    >
      {posts.map((post, index) => (
        <PostCard key={post.id} post={post} index={index} />
      ))}
    </InfiniteScroll>
  );
}
