import React from "react";

export default function SkeletonPostDetails() {
  return (
    <div className="w-full flex flex-col pt-4">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-6 px-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full animate-shimmer" />
          <div className="space-y-2">
            <div className="h-4 w-24 rounded animate-shimmer" />
            <div className="h-3 w-16 rounded animate-shimmer" />
          </div>
        </div>
        <div className="size-8 rounded-lg animate-shimmer" />
      </div>

      {/* Content Skeleton */}
      <div className="px-5 space-y-3 mb-8">
        <div className="h-5 w-full rounded animate-shimmer" />
        <div className="h-5 w-[90%] rounded animate-shimmer" />
        <div className="h-5 w-[40%] rounded animate-shimmer" />
      </div>

      {/* Media Skeleton (Placeholder for images/video) */}
      <div className="px-4 mb-8">
        <div className="h-64 w-full rounded-2xl animate-shimmer" />
      </div>

      {/* Interaction Bar Skeleton */}
      <div className="flex items-center justify-between px-6 py-4 border-y border-custom mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="size-8 rounded-lg animate-shimmer" />
        ))}
      </div>

      {/* Comment Section Skeleton */}
      <div className="px-5 space-y-6">
        <div className="h-4 w-32 rounded animate-shimmer mb-4" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-3">
            <div className="size-8 rounded-full animate-shimmer shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-28 rounded animate-shimmer" />
              <div className="h-10 w-full rounded-lg animate-shimmer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
