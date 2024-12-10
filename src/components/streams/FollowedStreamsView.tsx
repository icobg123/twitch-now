import { StreamCard } from "@src/components/streams/StreamCard";
import { StreamListSkeleton } from "./StreamSkeleton";
import { type Stream } from "@src/lib/api/twitch";

type FollowedStreamsViewProps = {
  isLoading: boolean;
  streams: Stream[];
  lastUpdated?: Date;
};

export function FollowedStreamsView({
  isLoading,
  streams,
  lastUpdated,
}: FollowedStreamsViewProps) {
  function formatTime(date: Date) {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  if (isLoading) {
    return <StreamListSkeleton />;
  }

  if (streams.length === 0) {
    return (
      <div className="flex h-full items-center justify-center px-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold">No Live Streams</h3>
          <p className="text-base-content/70">
            No streams match the current filters.
          </p>
          {lastUpdated && (
            <p className="mt-2 text-sm text-base-content/50">
              Last updated: {formatTime(lastUpdated)} -
              Updates every 2 minutes
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-1.5 p-2">
        {streams.map((stream, index) => (
          <div
            key={stream.id}
            className="animate-fade-up"
            style={{
              animationDelay: `${index * 50}ms`,
              animationFillMode: "forwards",
            }}
          >
            <StreamCard stream={stream} />
          </div>
        ))}
      </div>
      {lastUpdated && (
        <div className="border-t border-base-300 bg-base-100/50 p-2 text-center text-sm text-base-content/50">
          Last updated: {formatTime(lastUpdated)} - Updates every 2 minutes
        </div>
      )}
    </div>
  );
}
