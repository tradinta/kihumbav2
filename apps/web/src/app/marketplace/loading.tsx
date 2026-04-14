import React from "react";
import LeftSidebar from "@/components/LeftSidebar";
import SkeletonRightSidebar from "@/components/skeletons/SkeletonRightSidebar";
import BottomNav from "@/components/BottomNav";
import TopBar from "@/components/TopBar";
import SkeletonMarketplaceItem from "@/components/skeletons/SkeletonMarketplaceItem";

export default function Loading() {
  return (
    <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row min-h-screen lg:px-6 gap-6">
      <LeftSidebar />

      <main className="flex-1 w-full max-w-3xl mx-auto lg:mx-0 pt-0 lg:pt-4 pb-32 lg:pb-12">
        <TopBar />

        {/* Header Skeleton */}
        <div className="px-4 pt-6 pb-4">
          <div className="h-6 w-40 rounded animate-shimmer mb-2" />
          <div className="h-3 w-56 rounded animate-shimmer" />
        </div>

        {/* Search Skeleton */}
        <div className="px-4 mb-4">
          <div className="h-10 w-full rounded-lg animate-shimmer" />
        </div>

        {/* Controls Skeleton */}
        <div className="px-4 flex flex-wrap items-center gap-2 mb-4">
          <div className="h-8 w-32 rounded-lg animate-shimmer" />
          <div className="h-8 w-48 rounded-lg animate-shimmer" />
          <div className="h-8 w-24 rounded-lg animate-shimmer ml-auto" />
        </div>

        {/* Categories Skeleton */}
        <div className="flex gap-2 px-4 pb-4 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-8 w-24 rounded-lg animate-shimmer shrink-0" />
          ))}
        </div>

        {/* Results count skeleton */}
        <div className="px-4 mb-4">
          <div className="h-3 w-32 rounded animate-shimmer" />
        </div>

        {/* Grid Area Skeleton */}
        <div className="px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <SkeletonMarketplaceItem key={i} />
            ))}
          </div>
        </div>
      </main>

      <SkeletonRightSidebar />
      <BottomNav />
    </div>
  );
}
