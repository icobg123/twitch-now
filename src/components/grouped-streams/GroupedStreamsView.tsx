import {Stream} from "@src/types/twitch";
import {StreamCard} from "../streams/StreamCard";
import {LastUpdated} from "../common/LastUpdated";
import {Loader2} from "lucide-react";
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
        <div className="space-y-6 p-4">
            {Object.entries(groupedStreams).map(([gameName, gameStreams]) => (
                <div key={gameName} className="space-y-4">
                    <h2 className="text-lg font-semibold">{gameName}</h2>
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
