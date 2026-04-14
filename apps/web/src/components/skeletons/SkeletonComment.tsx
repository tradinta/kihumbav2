import React from "react";

export default function SkeletonComment() {
  return (
    <div className="flex gap-3">
      {/* Avatar */}
      <div className="shrink-0 pt-1">
        <div className="size-8 rounded-full animate-shimmer" />
      </div>

      <div className="flex-1 min-w-0 space-y-2">
        {/* Name / Handle Header */}
        <div className="flex items-center gap-2 mb-1">
          <div className="h-3 w-20 rounded animate-shimmer" />
          <div className="h-2.5 w-16 rounded animate-shimmer" />
        </div>
        
        {/* Comment Text Lines */}
        <div className="h-2.5 w-full rounded animate-shimmer" />
        <div className="h-2.5 w-5/6 rounded animate-shimmer" />
        <div className="h-2.5 w-2/3 rounded animate-shimmer mb-2" />

        {/* Action icons */}
        <div className="flex items-center gap-4 mt-3">
          <div className="h-3 w-10 rounded animate-shimmer" />
          <div className="h-3 w-16 rounded animate-shimmer" />
          <div className="h-3 w-4 rounded animate-shimmer" />
        </div>
      </div>
    </div>
  );
}
