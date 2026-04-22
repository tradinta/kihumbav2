'use client';

import React from 'react';

export function TribeCardSkeleton() {
  return (
    <div className="group relative bg-pill-surface border border-custom rounded-xl overflow-hidden animate-fade-in p-5 h-full">
      <div className="flex items-start gap-4">
        {/* Logo skeleton */}
        <div className="size-14 rounded-lg animate-shimmer shrink-0" />
        
        <div className="flex-1 space-y-3 pt-1">
          {/* Name & Privacy skeleton */}
          <div className="flex items-center gap-2">
            <div className="h-4 w-32 rounded animate-shimmer" />
            <div className="h-3 w-12 rounded animate-shimmer opacity-50" />
          </div>
          
          {/* Handle skeleton */}
          <div className="h-2 w-24 rounded animate-shimmer opacity-30" />
          
          {/* Bio skeleton */}
          <div className="space-y-1.5">
            <div className="h-2 w-full rounded animate-shimmer opacity-20" />
            <div className="h-2 w-4/5 rounded animate-shimmer opacity-20" />
          </div>
        </div>
      </div>

      <div className="mt-6 pt-5 border-t border-custom flex items-center justify-between">
        <div className="h-3 w-20 rounded animate-shimmer opacity-40" />
        <div className="h-6 w-16 rounded animate-shimmer opacity-50" />
      </div>
    </div>
  );
}

export function TribeGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <TribeCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function TribeDetailSkeleton() {
  return (
    <div className="flex-1 min-h-screen">
      {/* Cover Skeleton */}
      <div className="h-48 md:h-64 w-full animate-shimmer" />
      
      <div className="max-w-5xl mx-auto px-6">
        <div className="relative -mt-16 flex flex-col md:flex-row items-end gap-6">
          {/* Logo Skeleton */}
          <div className="size-32 rounded-lg bg-card-surface border-4 border-bg-color animate-shimmer shadow-2xl shrink-0" />
          
          <div className="flex-1 pb-4 space-y-4 w-full">
             <div className="flex items-center gap-4">
                <div className="h-8 w-64 rounded animate-shimmer" />
                <div className="h-4 w-16 rounded animate-shimmer opacity-50" />
             </div>
             <div className="h-3 w-48 rounded animate-shimmer opacity-30" />
          </div>
        </div>

        {/* Content Tabs Skeleton */}
        <div className="mt-12 flex gap-8 border-b border-custom">
           <div className="h-8 w-24 animate-shimmer opacity-40" />
           <div className="h-8 w-24 animate-shimmer opacity-40" />
           <div className="h-8 w-24 animate-shimmer opacity-40" />
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-8">
              <div className="h-64 w-full rounded-xl animate-shimmer opacity-10" />
              <div className="h-64 w-full rounded-xl animate-shimmer opacity-10" />
           </div>
           <div className="space-y-6">
              <div className="h-48 w-full rounded-xl animate-shimmer opacity-10" />
              <div className="h-64 w-full rounded-xl animate-shimmer opacity-10" />
           </div>
        </div>
      </div>
    </div>
  );
}
