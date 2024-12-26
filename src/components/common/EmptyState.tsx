type EmptyStateProps = {
  message: string;
    lastUpdated?: Date;
};

export function EmptyState({ message, lastUpdated }: EmptyStateProps) {
  return (
    <div className="flex h-full items-center justify-center p-4">
      <div className="text-center text-base-content/70">
        <p>{message}</p>
        {lastUpdated && (
          <p className="text-xs">
            Last updated: {new Date(lastUpdated).toLocaleTimeString()}
          </p>
        )}
      </div>
    </div>
  );
} 