import React from "react";
import LeftSidebar from "@/components/LeftSidebar";
import SkeletonRightSidebar from "@/components/skeletons/SkeletonRightSidebar";
import BottomNav from "@/components/BottomNav";
import TopBar from "@/components/TopBar";
import SkeletonMap from "@/components/skeletons/SkeletonMap";

export default function Loading() {
  return (
    <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row min-h-screen lg:px-6 gap-6">
      <LeftSidebar />

      <main className="flex-1 w-full max-w-3xl mx-auto lg:mx-0 pt-0 lg:pt-4 pb-32 lg:pb-12">
        <TopBar />

        {/* Header Skeleton */}
        <div className="px-4 pt-6 pb-4">
          <div className="h-6 w-32 rounded animate-shimmer mb-2" />
          <div className="h-3 w-48 rounded animate-shimmer" />
        </div>

        {/* Search Bar Skeleton */}
        <div className="px-4 mb-4">
          <div className="h-10 w-full rounded-lg animate-shimmer" />
        </div>

        {/* Controls Row Skeleton */}
        <div className="px-4 flex flex-wrap items-center gap-2 mb-4">
          <div className="h-8 w-48 rounded-lg animate-shimmer" />
          <div className="h-8 w-16 rounded-lg animate-shimmer ml-auto" />
        </div>

        {/* Map Skeleton Content Area */}
        <div className="px-4 pt-2">
          <SkeletonMap />
        </div>
      </main>

      <SkeletonRightSidebar />
      <BottomNav />
    </div>
  );
}
