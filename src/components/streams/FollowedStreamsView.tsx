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
  const { streams, isLoading, isFetching, error, lastUpdated } =
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
        <span>{error}</span>
      </div>
    );
  }

  if (isFetching) {
    return <StreamListSkeleton />;
  }

  if (streams && streams.length === 0) {
    return (
      <div className="flex h-full items-center justify-center px-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold">No Live Streams</h3>
          <p className="text-base-content/70">
            None of the channels you follow are currently live.
          </p>
          <p className="mt-2 text-sm text-base-content/50">
            Last updated: {formatTime(lastUpdated)} - Updates every 2 minutes
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 p-4">
        {streams.map((stream) => (
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
          `Last updated: ${formatTime(lastUpdated)} - Updates every 2 minutes`
        )}
      </div>
    </div>
  );
}

function StreamCard({ stream }: { stream: Stream }) {
  return (
    <div
      className="flex cursor-pointer gap-4 rounded-lg bg-base-100 p-4 shadow-md transition-all hover:shadow-lg"
      onClick={() =>
        window.open(`https://twitch.tv/${stream.user_login}`, "_blank")
      }
    >
      <div className="relative h-24 w-36 shrink-0 overflow-hidden rounded-lg">
        <img
          src={stream.thumbnail_url
            .replace("{width}", "144")
            .replace("{height}", "96")}
          alt={stream.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute bottom-1 right-1 rounded bg-red-500 px-1 py-0.5 text-xs text-white">
          {stream.viewer_count.toLocaleString()} viewers
        </div>
      </div>
      <div className="flex-1 space-y-2">
        <h3 className="line-clamp-2 font-semibold">{stream.title}</h3>
        <p className="text-sm text-base-content/70">{stream.game_name}</p>
        <div className="flex items-center gap-2">
          <div className="avatar">
            <div className="w-8 rounded-full">
              <img
                src={`https://static-cdn.jtvnw.net/jtv_user_pictures/${stream.user_login}-profile_image-300x300.png`}
                alt={stream.user_name}
              />
            </div>
          </div>
          <span className="text-sm font-medium">{stream.user_name}</span>
        </div>
      </div>
    </div>
  );
}
