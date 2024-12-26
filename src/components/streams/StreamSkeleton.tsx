export function StreamSkeleton() {
  return (
    <div className="flex gap-4">
      <div className="skeleton h-[72px] w-[128px] rounded bg-primary/20"></div>
      <div className="flex-1 space-y-2">
        <div className="skeleton h-4 w-full max-w-[200px] rounded bg-primary/20"></div>
        <div className="skeleton h-4 w-full max-w-[160px] rounded bg-primary/20"></div>
      </div>
    </div>
  );
}

export function StreamListSkeleton() {
  return (
    <div className="space-y-4 p-2 pb-0">
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
        <div className="skeleton h-10 w-10 rounded bg-primary/20"></div>
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-32 bg-primary/20"></div>
          <div className="skeleton h-3 w-48 bg-primary/20"></div>
          <div className="flex gap-1">
            <div className="skeleton h-3 w-12 bg-primary/20"></div>
            <div className="skeleton h-3 w-16 bg-primary/20"></div>
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
