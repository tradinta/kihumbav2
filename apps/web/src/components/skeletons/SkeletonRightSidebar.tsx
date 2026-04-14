import React from "react";
import { Search, TrendingUp } from "lucide-react";

export default function SkeletonRightSidebar() {
  return (
    <aside className="hidden xl:flex flex-col w-72 pt-8 pb-12 sticky-sidebar shrink-0">
      {/* Search Input Fake Skeleton */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-custom" />
        <div className="w-full pill-surface border border-custom rounded h-[38px]" />
      </div>

      {/* Trending Box Skeleton */}
      <div className="card-surface rounded-xl p-5 mb-6">
        <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary-gold mb-4 flex items-center gap-2">
          <TrendingUp size={14} />
          Trending Pulse
        </h4>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="block group space-y-1">
              <div className="h-3 w-32 rounded animate-shimmer" />
              <div className="h-2 w-20 rounded animate-shimmer" />
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Tribes Skeleton */}
      <div className="card-surface rounded-xl p-5">
        <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary-gold mb-4">
          Recommended Tribes
        </h4>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="size-8 rounded animate-shimmer shrink-0" />
              <div className="flex-1 space-y-1">
                <div className="h-2.5 w-24 rounded animate-shimmer" />
                <div className="h-2 w-16 rounded animate-shimmer" />
              </div>
              <div className="h-6 w-12 rounded animate-shimmer shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
