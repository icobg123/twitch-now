import { AlertCircle } from "lucide-react";
import { useFollowedLiveStreams } from "@src/hooks/useFollowedLiveStreams";

type LiveFollowedStreamsProps = {
  accessToken: string;
  userId: string;
};

export function LiveFollowedStreams({
  accessToken,
  userId,
}: LiveFollowedStreamsProps) {
  const { streams, isLoading, error } = useFollowedLiveStreams(
    accessToken,
    userId
  );

  if (isLoading) {
    return (
      <div className="flex justify-center py-2">
        <div className="loading loading-spinner loading-md"></div>
      </div>
    );
  }

  if (error) {
    return <div className="px-2 text-error">{error}</div>;
  }

  if (streams.length === 0) {
    return (
      <div className="py-2 text-center text-base-content/60">
        No live channels found
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {streams.map((stream) => (
        <div
          key={stream.id}
          className="card card-compact cursor-pointer bg-base-200 transition-colors hover:bg-base-300"
          onClick={() =>
            window.open(`https://twitch.tv/${stream.user_login}`, "_blank")
          }
        >
          <div className="card-body p-2">
            <div className="flex items-center gap-2">
              <div className="avatar">
                <div className="h-10 w-10 rounded">
                  <img
                    src={stream.thumbnail_url
                      .replace("{width}", "40")
                      .replace("{height}", "40")}
                    alt={stream.user_name}
                  />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-semibold">{stream.user_name}</h3>
                <p className="truncate text-sm text-base-content/70">
                  {stream.title}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-1">
                  <span className="badge badge-primary badge-xs">
                    {stream.viewer_count.toLocaleString()}
                  </span>
                  <span className="badge badge-xs">{stream.game_name}</span>
                  {stream.tags?.slice(0, 2).map((tag) => (
                    <span key={tag} className="badge badge-ghost badge-xs">
                      {tag}
                    </span>
                  ))}
                  {stream.is_mature && (
                    <span className="badge badge-warning badge-xs">18+</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
