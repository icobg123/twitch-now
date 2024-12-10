export function StreamSkeleton() {
  return (
    <div className="flex gap-3 rounded-lg bg-base-100 p-3 shadow-md">
      <div className="h-20 w-32 shrink-0 rounded-lg bg-base-300 animate-pulse" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-3/4 rounded bg-base-300 animate-pulse" />
        <div className="h-3 w-1/2 rounded bg-base-300 animate-pulse" />
        <div className="flex items-center gap-2 mt-1">
          <div className="h-6 w-6 rounded-full bg-base-300 animate-pulse" />
          <div className="h-3 w-24 rounded bg-base-300 animate-pulse" />
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