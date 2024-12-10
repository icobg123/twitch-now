import { StreamCard } from "@src/components/streams/StreamCard";
import { StreamListSkeleton } from "./StreamSkeleton";
import { useFollowedLiveStreams } from "@src/hooks/useFollowedLiveStreams";
import { type Stream } from "@src/lib/api/twitch";

type FollowedStreamsViewProps = {
  accessToken: string;
  username: string | null;
};

export function FollowedStreamsView({
  accessToken,
  username,
}: FollowedStreamsViewProps) {
  const { data, isLoading, isFetching, error } =
    useFollowedLiveStreams(
      accessToken ?? "",
      username ?? "",
      !accessToken || !username
    );

  function formatTime(date: Date) {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  if (error) {
    return (
      <div className="alert alert-error m-4">
        <span>{error.message}</span>
      </div>
    );
  }

  if (isLoading) {
    return <StreamListSkeleton />;
  }

  if (!data?.streams || data.streams.length === 0) {
    return (
      <div className="flex h-full items-center justify-center px-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold">No Live Streams</h3>
          <p className="text-base-content/70">
            None of the channels you follow are currently live.
          </p>
          <p className="mt-2 text-sm text-base-content/50">
            Last updated: {formatTime(data?.lastUpdated ?? new Date())} - Updates every 2 minutes
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-1.5 p-2">
        {data.streams.map((stream: Stream) => (
          <StreamCard key={stream.id} stream={stream} />
        ))}
      </div>
      <div className="border-t border-base-300 bg-base-100/50 p-2 text-center text-sm text-base-content/50">
        {isFetching ? (
          <span className="flex items-center justify-center gap-2">
            <span className="loading loading-spinner loading-xs"></span>
            Refreshing...
          </span>
        ) : (
          `Last updated: ${formatTime(data.lastUpdated)} - Updates every 2 minutes`
        )}
      </div>
    </div>
  );
}
