"use client";

import { useState, useEffect } from "react";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import BottomNav from "@/components/BottomNav";
import TopBar from "@/components/TopBar";
import ModeSelector, { type Mode } from "@/components/ModeSelector";
import StoriesBar from "@/components/feed/FiresBar";
import PostCard from "@/components/feed/PostCard";
import SkeletonCard from "@/components/feed/SkeletonCard";
import { usePostContext } from "@/context/PostContext";
import { SparkCard } from "@/components/feed/SparksGrid";
import InfiniteScroll from "@/components/shared/InfiniteScroll";
import SafetyCheckpoint from "@/components/shared/SafetyCheckpoint";

export default function Home() {
  const { posts, isLoading, loadFeed, hasMore } = usePostContext();

  useEffect(() => {
    loadFeed(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row min-h-screen lg:px-6 gap-6">
      <SafetyCheckpoint />
      <LeftSidebar />

      <main className="flex-1 w-full max-w-2xl mx-auto lg:mx-0 pt-0 lg:pt-4 pb-32 lg:pb-12">
        <TopBar />

        {/* Home Feed Mix */}
        <StoriesBar />
        
        <ModeSelector activeMode="feed" />
        <InfiniteScroll 
          hasMore={hasMore} 
          isLoading={isLoading} 
          onLoadMore={() => loadFeed(false)}
          className="space-y-6 px-4 stagger-children"
        >
          {posts.map((post, index) => (
            <PostCard key={post.id} post={post as any} index={index} />
          ))}
          
          {!isLoading && posts.length === 0 && (
            <div className="text-center py-20 card-surface rounded-2xl mx-4">
              <p className="text-xs font-black uppercase tracking-[0.4em] opacity-40">Absolute Zero</p>
              <p className="text-[10px] font-bold text-muted-custom mt-2 uppercase tracking-widest">No curations found in your hub.</p>
            </div>
          )}
        </InfiniteScroll>
      </main>

      <RightSidebar />
      <BottomNav />
    </div>
  );
}
