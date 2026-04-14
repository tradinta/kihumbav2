import React from "react";

export default function SkeletonMap() {
  return (
    <div className="relative w-full h-[calc(100vh-6rem)] lg:h-[calc(100vh-1rem)] bg-[var(--bg-color)] p-4 flex flex-col pt-0 pb-16 lg:pb-0 overflow-hidden rounded-xl">
      {/* Search Header */}
      <div className="sticky top-0 z-40 bg-[var(--bg-color)] py-2 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 h-12 rounded-xl animate-shimmer" />
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 w-24 rounded-xl animate-shimmer hidden sm:block" />
            ))}
          </div>
        </div>
      </div>

      {/* Main Map Area Container */}
      <div className="flex-1 relative rounded-xl overflow-hidden animate-shimmer">
        
        {/* Floating Map Overlays */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          <div className="h-10 w-10 bg-[var(--bg-color)]/20 rounded shadow-lg animate-pulse" />
          <div className="h-10 w-10 bg-[var(--bg-color)]/20 rounded shadow-lg animate-pulse" />
        </div>

        <div className="absolute top-4 right-4 z-10">
          <div className="h-10 w-10 bg-[var(--bg-color)]/20 rounded shadow-lg animate-pulse" />
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
          <div className="h-10 w-48 bg-[var(--bg-color)]/20 rounded-full shadow-lg animate-pulse" />
        </div>
      </div>
    </div>
  );
}
