import {Stream} from "@src/types/twitch";
import {StreamCard} from "./StreamCard";
import {LastUpdated} from "../common/LastUpdated";
import {Loader2} from "lucide-react";

type Props = {
    streams: Stream[];
    isLoading: boolean;
    lastUpdated: Date | null;
};

export function FollowedStreamsView({ streams, isLoading, lastUpdated }: Props) {
    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
        <div className="space-y-4 p-4">
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
