export function GroupSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-lg bg-primary/20" />
        <div className="h-6 w-32 rounded bg-primary/20" />
        <div className="ml-auto h-6 w-20 rounded bg-primary/20" />
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, j) => (
          <div key={j} className="h-32 rounded-lg bg-primary/20 sm:h-40" />
        ))}
      </div>
    </div>
  );
} 