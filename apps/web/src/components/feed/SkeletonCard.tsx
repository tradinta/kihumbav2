'use client';

import React from 'react';

export default function PostSkeleton() {
  return (
    <div className="card-surface rounded-xl overflow-hidden border border-custom">
      {/* Header skeleton */}
      <div className="p-4 flex items-start gap-3">
        <div className="size-10 rounded-full animate-shimmer shrink-0" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-3 w-28 rounded animate-shimmer" />
          <div className="h-2 w-20 rounded animate-shimmer" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="px-4 pb-3 space-y-2">
        <div className="h-3 w-full rounded animate-shimmer" />
        <div className="h-3 w-3/4 rounded animate-shimmer" />
      </div>

      {/* Media skeleton */}
      <div className="aspect-video w-full animate-shimmer" />

      {/* Interactions skeleton */}
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-16 rounded-lg animate-shimmer" />
          <div className="h-8 w-8 rounded animate-shimmer" />
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-8 rounded animate-shimmer" />
          <div className="h-8 w-8 rounded animate-shimmer" />
        </div>
      </div>
    </div>
  );
}

export function SparkSkeleton() {
  return (
    <div className="relative aspect-[3/4] rounded-xl overflow-hidden animate-fade-in border border-custom">
      <div className="absolute inset-0 animate-shimmer" />
      <div className="absolute bottom-3 left-3 right-3 space-y-2">
        <div className="h-3 w-3/4 rounded animate-shimmer opacity-50" />
        <div className="h-2 w-1/2 rounded animate-shimmer opacity-30" />
        <div className="flex gap-2 pt-1">
           <div className="h-2.5 w-8 rounded animate-shimmer opacity-20" />
           <div className="h-2.5 w-8 rounded animate-shimmer opacity-20" />
        </div>
      </div>
    </div>
  );
}

export function VideoSkeleton() {
  return (
    <div className="card-surface rounded-xl overflow-hidden border border-custom">
      <div className="aspect-video w-full animate-shimmer" />
      <div className="p-4 flex gap-3">
        <div className="size-10 rounded-full animate-shimmer shrink-0" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-3 w-3/4 rounded animate-shimmer" />
          <div className="h-2 w-1/2 rounded animate-shimmer" />
          <div className="flex gap-3 pt-1">
             <div className="h-2 w-10 rounded animate-shimmer opacity-40" />
             <div className="h-2 w-10 rounded animate-shimmer opacity-40" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function GridSkeleton({ type = 'posts' }: { type?: 'posts' | 'sparks' | 'videos' }) {
  const count = type === 'posts' ? 3 : 4;
  
  return (
    <div className={`grid gap-4 ${
      type === 'sparks' ? 'grid-cols-2 px-4' : 
      type === 'videos' ? 'grid-cols-1 sm:grid-cols-2 px-4' : 
      'px-0'
    }`}>
      {Array.from({ length: count }).map((_, i) => (
        <React.Fragment key={i}>
          {type === 'posts' && <PostSkeleton />}
          {type === 'sparks' && <SparkSkeleton />}
          {type === 'videos' && <VideoSkeleton />}
        </React.Fragment>
      ))}
    </div>
  );
}
