import React from "react";
import LeftSidebar from "@/components/LeftSidebar";
import SkeletonRightSidebar from "@/components/skeletons/SkeletonRightSidebar";
import BottomNav from "@/components/BottomNav";
import SkeletonProfileHeader from "@/components/skeletons/SkeletonProfileHeader";
import SkeletonCard from "@/components/feed/SkeletonCard";
import { ArrowLeft, MoreHorizontal } from "lucide-react";

export default function Loading() {
  return (
    <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row min-h-screen lg:px-6 gap-6">
      <LeftSidebar />

      <main className="flex-1 w-full max-w-2xl mx-auto lg:mx-0 pt-0 lg:pt-4 pb-32 lg:pb-12 relative">
        <div className="sticky top-0 z-40 nav-surface border-b border-custom px-4 py-3 flex items-center justify-between">
          <button disabled className="p-2 -ml-2 text-muted-custom rounded-full">
            <ArrowLeft size={20} />
          </button>
          <button disabled className="text-muted-custom">
            <MoreHorizontal size={20} />
          </button>
        </div>

        <SkeletonProfileHeader />

        {/* Tabs skeleton */}
        <div className="flex border-b border-custom px-4 mb-4 gap-6">
          <div className="h-10 w-16 rounded animate-shimmer" />
          <div className="h-10 w-24 rounded animate-shimmer" />
        </div>

        {/* Content payload skeleton */}
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
