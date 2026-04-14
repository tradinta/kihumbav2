import React from "react";

export default function SkeletonProfileHeader() {
  return (
    <div className="relative mb-6">
      {/* Banner */}
      <div className="h-48 md:h-64 w-full rounded-2xl animate-shimmer overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-color)] to-transparent opacity-60" />
      </div>

      {/* Avatar */}
      <div className="absolute -bottom-12 left-6 md:left-10">
        <div className="size-24 md:size-32 rounded-full border-4 border-[var(--bg-color)] animate-shimmer" />
      </div>

      {/* Actions */}
      <div className="absolute -bottom-10 right-4 md:right-10 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full animate-shimmer" />
        <div className="h-10 w-32 rounded-full animate-shimmer" />
      </div>

      {/* Profile Details Container */}
      <div className="mt-16 px-6 md:px-10 pb-6 border-b border-custom">
        <div className="space-y-3">
          <div className="h-6 w-48 rounded animate-shimmer" />
          <div className="h-4 w-32 rounded animate-shimmer" />
        </div>

        <div className="mt-4 space-y-2">
          <div className="h-3 w-3/4 rounded animate-shimmer" />
          <div className="h-3 w-5/6 rounded animate-shimmer" />
          <div className="h-3 w-1/2 rounded animate-shimmer" />
        </div>

        <div className="mt-6 flex flex-wrap gap-4">
          <div className="h-4 w-24 rounded animate-shimmer" />
          <div className="h-4 w-24 rounded animate-shimmer" />
          <div className="h-4 w-28 rounded animate-shimmer" />
        </div>
      </div>
    </div>
  );
}
