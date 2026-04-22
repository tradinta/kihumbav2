'use client';

import React from 'react';

export default function PostCardSkeleton() {
  return (
    <div className="card-surface rounded-2xl overflow-hidden mb-4 animate-fade-in-up">
      {/* Header Skeleton */}
      <div className="px-4 py-3 flex items-center gap-3">
        <div className="size-10 rounded-full animate-shimmer shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-24 rounded animate-shimmer" />
          <div className="h-2 w-16 rounded animate-shimmer opacity-60" />
        </div>
        <div className="size-6 rounded animate-shimmer opacity-40" />
      </div>

      {/* Content Skeleton */}
      <div className="px-4 pb-3 space-y-2">
        <div className="h-3 w-full rounded animate-shimmer" />
        <div className="h-3 w-[90%] rounded animate-shimmer" />
        <div className="h-3 w-[40%] rounded animate-shimmer" />
      </div>

      {/* Media Skeleton */}
      <div className="px-4 pb-4">
        <div className="aspect-video w-full rounded-xl animate-shimmer" />
      </div>

      {/* Interaction Bar Skeleton */}
      <div className="px-4 py-3 border-t border-custom flex items-center justify-between">
        <div className="flex gap-4">
          <div className="size-5 rounded animate-shimmer opacity-40" />
          <div className="size-5 rounded animate-shimmer opacity-40" />
          <div className="size-5 rounded animate-shimmer opacity-40" />
        </div>
        <div className="size-5 rounded animate-shimmer opacity-40" />
      </div>
    </div>
  );
}
