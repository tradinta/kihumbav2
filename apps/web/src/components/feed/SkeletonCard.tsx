export default function SkeletonCard() {
  return (
    <div className="card-surface rounded-xl overflow-hidden">
      {/* Header skeleton */}
      <div className="p-4 flex items-start gap-3">
        <div className="size-10 rounded-full animate-shimmer shrink-0" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-3 w-28 rounded animate-shimmer" />
          <div className="h-2 w-20 rounded animate-shimmer" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="px-4 pb-3 space-y-2">
        <div className="h-3 w-full rounded animate-shimmer" />
        <div className="h-3 w-3/4 rounded animate-shimmer" />
      </div>

      {/* Media skeleton */}
      <div className="aspect-video w-full animate-shimmer" />

      {/* Impressions skeleton */}
      <div className="px-4 py-3 border-b border-custom">
        <div className="h-2.5 w-32 rounded animate-shimmer" />
      </div>

      {/* Interactions skeleton */}
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-24 rounded-lg animate-shimmer" />
          <div className="h-8 w-8 rounded animate-shimmer" />
          <div className="h-8 w-8 rounded animate-shimmer" />
        </div>
        <div className="flex gap-1">
          <div className="h-8 w-8 rounded animate-shimmer" />
          <div className="h-8 w-8 rounded animate-shimmer" />
        </div>
      </div>
    </div>
  );
}
