'use client';

import React, { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import PostCardSkeleton from '../feed/PostCardSkeleton';

interface InfiniteScrollProps {
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  className?: string;
  children?: React.ReactNode;
}

export default function InfiniteScroll({
  onLoadMore,
  hasMore,
  isLoading,
  className = "",
  children
}: InfiniteScrollProps) {
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          onLoadMore();
        }
      },
      { threshold: 0.1, rootMargin: '400px' } // Load early before reaching the bottom
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isLoading, onLoadMore]);

  return (
    <div className={className}>
      {children}
      
      {/* Target for intersection */}
      <div ref={observerTarget} className="w-full">
        {isLoading && hasMore && (
          <div className="flex flex-col gap-4 py-4 px-4 md:px-0 stagger-children">
             <PostCardSkeleton />
             <PostCardSkeleton />
             <PostCardSkeleton />
          </div>
        )}
      </div>
    </div>
  );
}
