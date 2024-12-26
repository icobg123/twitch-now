import {StreamCard} from "../streams/StreamCard";
import {Stream} from "@src/lib/api/twitch";

type StreamsGridProps = {
    streams: Stream[];
};

export function StreamsGrid({streams}: StreamsGridProps) {
    return (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {streams.map((stream) => (
                <StreamCard key={stream.id} stream={stream}/>
            ))}
        </div>
    );
} 