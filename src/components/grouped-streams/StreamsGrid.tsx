import type {Stream} from "@src/hooks/useStreamFilters";
import {StreamCard} from "../streams/StreamCard";

type StreamsGridProps = {
  streams: Stream[];
};

export function StreamsGrid({ streams }: StreamsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {streams.map((stream) => (
        <StreamCard key={stream.id} stream={stream} />
      ))}
    </div>
  );
} 