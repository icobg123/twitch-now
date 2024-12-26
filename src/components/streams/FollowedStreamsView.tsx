import {Stream} from "@src/lib/api/twitch";
import {StreamCard} from "./StreamCard";
import {LastUpdated} from "../common/LastUpdated";
import {StreamSkeleton} from "./StreamSkeleton";

type Props = {
  streams: Stream[];
  isLoading: boolean;
  lastUpdated: Date | null;
};

export function FollowedStreamsView({
  streams,
  isLoading,
  lastUpdated,
}: Props) {
  if (isLoading) {
    return (
      <div className="space-y-4 p-2">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <StreamSkeleton key={item} />
        ))}
      </div>
    );
  }

  if (!streams?.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-lg font-semibold">No Live Streams</p>
        <p className="text-base-content/70">
          None of the channels you follow are currently live.
        </p>
        {lastUpdated && <LastUpdated date={lastUpdated} />}
      </div>
    );
  }

  return (
    <div className="space-y-4 p-2">
      {streams.map((stream) => (
        <StreamCard key={stream.id} stream={stream} />
      ))}
      {lastUpdated && (
        <div className="pt-2">
          <LastUpdated date={lastUpdated} />
        </div>
      )}
    </div>
  );
}
