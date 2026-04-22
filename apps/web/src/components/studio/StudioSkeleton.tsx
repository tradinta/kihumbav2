"use client";

import React from 'react';

const Shimmer = () => (
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
);

export default function StudioSkeleton() {
  return (
    <div className="space-y-6">
      {/* ─── Metric Summary Skeleton ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card-surface rounded-lg p-4 space-y-3 relative overflow-hidden">
            <div className="size-7 rounded bg-white/5 relative overflow-hidden">
                <Shimmer />
            </div>
            <div className="space-y-2">
                <div className="h-2 w-12 bg-white/5 rounded relative overflow-hidden"><Shimmer /></div>
                <div className="h-4 w-20 bg-white/5 rounded relative overflow-hidden"><Shimmer /></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
            <div className="h-3 w-24 bg-white/5 rounded ml-1 relative overflow-hidden"><Shimmer /></div>
            <div className="card-surface rounded-lg overflow-hidden relative h-48 md:h-44">
                <div className="flex flex-col md:flex-row h-full">
                    <div className="w-full md:w-72 bg-white/5 relative overflow-hidden shrink-0">
                        <Shimmer />
                    </div>
                    <div className="p-4 flex-1 space-y-4">
                        <div className="space-y-2">
                            <div className="h-4 w-48 bg-white/5 rounded relative overflow-hidden"><Shimmer /></div>
                            <div className="h-2 w-full bg-white/5 rounded relative overflow-hidden"><Shimmer /></div>
                            <div className="h-2 w-3/4 bg-white/5 rounded relative overflow-hidden"><Shimmer /></div>
                        </div>
                        <div className="flex justify-between items-end pt-4">
                            <div className="flex gap-4">
                                <div className="h-6 w-12 bg-white/5 rounded relative overflow-hidden"><Shimmer /></div>
                                <div className="h-6 w-12 bg-white/5 rounded relative overflow-hidden"><Shimmer /></div>
                            </div>
                            <div className="h-7 w-20 bg-white/5 rounded relative overflow-hidden"><Shimmer /></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="space-y-4">
            <div className="h-3 w-24 bg-white/5 rounded ml-1 relative overflow-hidden"><Shimmer /></div>
            <div className="card-surface rounded-lg p-4 space-y-4 h-full min-h-[200px] relative overflow-hidden">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <div className="size-10 rounded bg-white/5 relative overflow-hidden shrink-0"><Shimmer /></div>
                        <div className="space-y-2 flex-1">
                            <div className="h-2 w-24 bg-white/5 rounded relative overflow-hidden"><Shimmer /></div>
                            <div className="h-2 w-16 bg-white/5 rounded relative overflow-hidden"><Shimmer /></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
