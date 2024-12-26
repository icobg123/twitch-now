type LastUpdatedProps = {
  date: Date;
};

export function LastUpdated({ date }: LastUpdatedProps) {
  return (
    <p className="text-sm text-base-content/70">
      Last updated: {date.toLocaleTimeString()}
    </p>
  );
}
