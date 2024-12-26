import {LastUpdated} from "@src/components/common/LastUpdated";
import {GameGroupSkeleton} from "@src/components/grouped-streams/GameGroupSkeleton";
import {GameHeader} from "@src/components/grouped-streams/GameHeader";
import {StreamCard} from "@src/components/streams/StreamCard";
import {Stream} from "@src/lib/api/twitch";
import {useMemo} from "react";

type Props = {
  streams: Stream[];
  isLoading: boolean;
  lastUpdated: Date | null;
};

export function GroupedStreamsView({ streams, isLoading, lastUpdated }: Props) {
  const groupedStreams = useMemo(() => {
    const groups: Record<string, Stream[]> = {};
    streams?.forEach((stream) => {
      const gameName = stream.game_name || "Other";
      if (!groups[gameName]) {
        groups[gameName] = [];
      }
      groups[gameName].push(stream);
    });
    return groups;
  }, [streams]);

  if (isLoading) {
    return (
      <div className="space-y-6 p-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <GameGroupSkeleton key={i} />
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
    <div className="space-y-6 p-2">
      {Object.entries(groupedStreams).map(([gameName, gameStreams]) => (
        <div key={gameName} className="space-y-4">
          <GameHeader gameName={gameName} gameStreams={gameStreams} />
          <div className="space-y-4">
            {gameStreams.map((stream) => (
              <StreamCard key={stream.id} stream={stream} />
            ))}
          </div>
        </div>
      ))}
      {lastUpdated && (
        <div className="pt-2">
          <LastUpdated date={lastUpdated} />
        </div>
      )}
    </div>
  );
}
