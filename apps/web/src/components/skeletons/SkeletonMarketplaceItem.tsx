import React from "react";

export default function SkeletonMarketplaceItem() {
  return (
    <div className="card-surface rounded-2xl overflow-hidden relative group">
      {/* Status Badge Float */}
      <div className="absolute top-3 left-3 z-10">
        <div className="h-6 w-20 rounded-full bg-[var(--bg-color)]/50 animate-pulse backdrop-blur-md" />
      </div>

      {/* Main Image */}
      <div className="aspect-[4/3] w-full animate-shimmer" />

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div className="space-y-2 flex-1">
            <div className="h-4 w-3/4 rounded animate-shimmer" />
            <div className="h-3 w-1/2 rounded animate-shimmer" />
          </div>
          {/* Price Label */}
          <div className="h-6 w-20 rounded bg-primary-gold/20 animate-pulse ml-2 shrink-0" />
        </div>

        <div className="pt-2 border-t border-custom flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Seller Avatar */}
            <div className="size-6 rounded-full animate-shimmer" />
            <div className="h-2 w-16 rounded animate-shimmer" />
          </div>
          {/* Action button */}
          <div className="h-8 w-8 rounded animate-shimmer" />
        </div>
      </div>
    </div>
  );
}
