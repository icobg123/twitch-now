export function StreamSkeleton() {
  return (
    <div className="flex animate-pulse gap-4 rounded-lg bg-base-100 p-4 shadow-md">
      <div className="skeleton h-24 w-36 shrink-0 rounded-lg"></div>
      <div className="flex-1 space-y-3">
        <div className="skeleton h-4 w-3/4"></div>
        <div className="skeleton h-3 w-1/2"></div>
        <div className="flex items-center gap-2">
          <div className="skeleton h-8 w-8 rounded-full"></div>
          <div className="skeleton h-3 w-24"></div>
        </div>
      </div>
    </div>
  );
}

export function StreamListSkeleton() {
  return (
    <div className="space-y-4 p-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <StreamSkeleton key={i} />
      ))}
    </div>
  );
}

// New compact skeleton for LiveFollowedStreams
export function CompactStreamSkeleton() {
  return (
    <div className="card card-compact animate-pulse bg-base-200 p-2">
      <div className="flex items-center gap-2">
        <div className="skeleton h-10 w-10 rounded"></div>
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-32"></div>
          <div className="skeleton h-3 w-48"></div>
          <div className="flex gap-1">
            <div className="skeleton h-3 w-12"></div>
            <div className="skeleton h-3 w-16"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CompactStreamListSkeleton() {
  return (
    <div className="space-y-2 p-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <CompactStreamSkeleton key={i} />
      ))}
    </div>
  );
} 