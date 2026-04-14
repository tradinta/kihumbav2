import React from "react";
import LeftSidebar from "@/components/LeftSidebar";
import SkeletonRightSidebar from "@/components/skeletons/SkeletonRightSidebar";
import BottomNav from "@/components/BottomNav";
import SkeletonCard from "@/components/feed/SkeletonCard";
import SkeletonComment from "@/components/skeletons/SkeletonComment";
import { ArrowLeft, MoreHorizontal } from "lucide-react";

export default function Loading() {
  return (
    <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row min-h-screen lg:px-6 gap-6">
      <LeftSidebar />

      <main className="flex-1 w-full max-w-2xl mx-auto lg:mx-0 pt-0 lg:pt-4 pb-32 lg:pb-12 relative flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-40 nav-surface border-b border-custom px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button disabled className="p-2 -ml-2 text-muted-custom rounded-full">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-sm font-bold tracking-widest uppercase text-primary-gold">Post</h1>
          </div>
          <button disabled className="text-muted-custom">
            <MoreHorizontal size={20} />
          </button>
        </div>

        {/* Post Content */}
        <div className="mt-4 px-4 bg-[var(--bg-color)]">
          <div className="pointer-events-auto ring-1 ring-primary-gold/10 rounded-xl overflow-hidden shadow-lg shadow-black/5">
            <SkeletonCard />
          </div>
        </div>

        {/* Comments Section */}
        <div className="flex-1 mt-6 border-t border-custom pt-4 px-4 pb-20">
          <div className="h-3 w-24 rounded animate-shimmer mb-6" /> {/* Title */}
          
          <div className="space-y-6">
            <SkeletonComment />
            <SkeletonComment />
            <SkeletonComment />
            <SkeletonComment />
          </div>
        </div>
      </main>

      <SkeletonRightSidebar />
      <BottomNav />
    </div>
  );
}
