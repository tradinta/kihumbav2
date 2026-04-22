import React from "react";
import SkeletonProfileHeader from "@/components/skeletons/SkeletonProfileHeader";

export default function ProfileSkeleton() {
  return (
    <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row min-h-screen lg:px-6 gap-6">
      {/* Sidebar Placeholder */}
      <div className="hidden lg:block w-64 pt-8 shrink-0">
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 w-full rounded-xl animate-shimmer" />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-2xl mx-auto lg:mx-0 pt-0 lg:pt-4 pb-32 lg:pb-12">
        {/* TopBar Placeholder */}
        <div className="h-14 w-full flex items-center justify-between px-4 lg:hidden mb-4">
          <div className="size-8 rounded-lg animate-shimmer" />
          <div className="h-5 w-24 rounded animate-shimmer" />
          <div className="size-8 rounded-lg animate-shimmer" />
        </div>

        {/* Hero Skeleton (Already exists, we use it) */}
        <SkeletonProfileHeader />

        {/* Stats Skeleton */}
        <div className="flex items-center justify-around py-6 border-b border-custom">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="text-center space-y-2">
              <div className="h-6 w-12 rounded mx-auto animate-shimmer" />
              <div className="h-3 w-16 rounded mx-auto animate-shimmer" />
            </div>
          ))}
        </div>

        {/* Tabs Skeleton */}
        <div className="flex items-center gap-8 px-6 py-4 border-b border-custom">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="h-4 w-16 rounded animate-shimmer" />
            ))}
        </div>

        {/* Content Placeholder */}
        <div className="p-4 space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card-surface p-4 rounded-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full animate-shimmer" />
                <div className="space-y-2">
                  <div className="h-4 w-32 rounded animate-shimmer" />
                  <div className="h-3 w-20 rounded animate-shimmer" />
                </div>
              </div>
              <div className="h-20 w-full rounded-lg animate-shimmer" />
            </div>
          ))}
        </div>
      </main>

      {/* Right Sidebar Placeholder */}
      <div className="hidden xl:block w-72 pt-8 shrink-0 space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card-surface p-4 rounded-xl space-y-4">
            <div className="h-3 w-24 rounded animate-shimmer" />
            <div className="space-y-2">
              <div className="h-2 w-full rounded animate-shimmer" />
              <div className="h-2 w-3/4 rounded animate-shimmer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
