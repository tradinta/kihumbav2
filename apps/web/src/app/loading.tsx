import React from "react";
import LeftSidebar from "@/components/LeftSidebar";
import SkeletonRightSidebar from "@/components/skeletons/SkeletonRightSidebar";
import BottomNav from "@/components/BottomNav";
import TopBar from "@/components/TopBar";
import SkeletonStoriesBar from "@/components/skeletons/SkeletonStoriesBar";
import SkeletonCard from "@/components/feed/SkeletonCard";

export default function Loading() {
  return (
    <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row min-h-screen lg:px-6 gap-6">
      <LeftSidebar />

      <main className="flex-1 w-full max-w-2xl mx-auto lg:mx-0 pt-0 lg:pt-4 pb-32 lg:pb-12">
        <TopBar />
        
        <div className="pt-4 mb-4 flex border-b border-custom sticky top-0 bg-[var(--bg-color)] z-30 px-4">
          <div className="h-10 w-20 rounded animate-shimmer mr-4" />
          <div className="h-10 w-20 rounded animate-shimmer mr-4" />
          <div className="h-10 w-20 rounded animate-shimmer" />
        </div>

        <SkeletonStoriesBar />
        
        <div className="space-y-6 px-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </main>

      <SkeletonRightSidebar />
      <BottomNav />
    </div>
  );
}
