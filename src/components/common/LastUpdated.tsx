type LastUpdatedProps = {
  timestamp?: Date;
};

export function LastUpdated({ timestamp }: LastUpdatedProps) {
  if (!timestamp) return null;
  
  return (
    <div className="text-center text-xs text-base-content/70">
      Last updated: {new Date(timestamp).toLocaleTimeString()}
    </div>
  );
} 