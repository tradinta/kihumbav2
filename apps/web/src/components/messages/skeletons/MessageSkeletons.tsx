'use client';

import React from 'react';

export const SidebarSkeleton = () => (
  <div className="w-full flex flex-col gap-1 p-1 overflow-hidden">
    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
      <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg border border-transparent">
        <div className="size-10 rounded-full animate-shimmer shrink-0" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-2.5 w-24 rounded animate-shimmer" />
          <div className="h-2 w-full max-w-[140px] rounded animate-shimmer opacity-60" />
        </div>
        <div className="h-2 w-8 rounded animate-shimmer shrink-0 self-start mt-1" />
      </div>
    ))}
  </div>
);

export const ChatAreaSkeleton = () => (
  <div className="flex-1 flex flex-col h-full bg-black">
    {/* Header Skeleton */}
    <div className="p-4 border-b border-white/5 flex items-center gap-3">
      <div className="size-10 rounded-full animate-shimmer" />
      <div className="space-y-2">
        <div className="h-3 w-32 rounded animate-shimmer" />
        <div className="h-2 w-20 rounded animate-shimmer opacity-50" />
      </div>
    </div>
    
    {/* Messages Area */}
    <div className="flex-1 p-6 space-y-8 overflow-hidden">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-[70%] space-y-2 ${i % 2 === 0 ? 'items-end' : 'items-start'} flex flex-col`}>
             <div className={`h-14 w-64 rounded-xl animate-shimmer`} />
             <div className="h-2 w-12 rounded animate-shimmer opacity-30" />
          </div>
        </div>
      ))}
    </div>

    {/* Input Area */}
    <div className="p-6 border-t border-white/5">
      <div className="h-12 w-full rounded-xl animate-shimmer" />
    </div>
  </div>
);

export const InboxSkeleton = () => (
  <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6">
    <div className="size-24 rounded-full animate-shimmer" />
    <div className="space-y-3 text-center">
       <div className="h-4 w-48 rounded animate-shimmer mx-auto" />
       <div className="h-3 w-72 rounded animate-shimmer mx-auto opacity-40" />
    </div>
    <div className="h-11 w-44 rounded-xl animate-shimmer opacity-20 mt-4" />
  </div>
);
