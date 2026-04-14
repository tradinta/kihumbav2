import React from "react";

export default function SkeletonStoriesBar() {
  return (
    <div className="card-surface p-4 border-b border-custom mb-4 overflow-hidden">
      <div className="flex gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2 shrink-0">
            {/* Story Circle */}
            <div className="size-16 rounded-full animate-shimmer" />
            {/* Name */}
            <div className="h-2 w-12 rounded animate-shimmer" />
          </div>
        ))}
      </div>
    </div>
  );
}
