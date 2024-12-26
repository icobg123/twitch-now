import {useGroupedStreams} from "@src/hooks/useGroupedStreams";
import {EmptyState} from "../common/EmptyState";
import {LastUpdated} from "../common/LastUpdated";
import {GroupSkeleton} from "./GroupSkeleton";
import {GroupHeader} from "./GroupHeader";
import {StreamsGrid} from "./StreamsGrid";
import {Stream} from "@src/lib/api/twitch";

type GroupedStreamsViewProps = {
  isLoading: boolean;
  streams: Stream[];
  lastUpdated?: Date;
};

export function GroupedStreamsView({
  isLoading,
  streams,
  lastUpdated,
}: GroupedStreamsViewProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 p-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <GroupSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (streams.length === 0) {
    return (
      <EmptyState
        message="No live streams found"
        lastUpdated={lastUpdated}
      />
    );
  }

  const groupedStreams = useGroupedStreams(streams);

  return (
    <div className="space-y-6 p-4">
      {groupedStreams.map((group) => (
        <div key={group.id} className="space-y-3">
          <GroupHeader group={group} />
          <StreamsGrid streams={group.streams} />
        </div>
      ))}
      <LastUpdated timestamp={lastUpdated} />
    </div>
  );
} 