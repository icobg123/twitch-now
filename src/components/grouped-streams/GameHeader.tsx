import {Stream} from "@src/lib/api/twitch";

type Props = {
    gameName: string;
    gameStreams: Stream[];
};

export function GameHeader({ gameName, gameStreams }: Props) {
    return (
        <div className="flex items-center gap-2">
            <div className="indicator">
                {gameStreams[0]?.game_box_art_url && (
                    <>
                        <span className="indicator-item badge badge-primary badge-sm">
                            {gameStreams.length}
                        </span>
                        <div className="relative h-[40px] w-[85px] overflow-hidden rounded">
                            <img
                                src={gameStreams[0].game_box_art_url.replace('{width}x{height}', '120x160')}
                                alt={gameName}
                                className="absolute left-1/2 top-1/3 h-auto w-[120px] -translate-x-1/2 -translate-y-1/3"
                            />
                        </div>
                    </>
                )}
            </div>
            <h2 className="text-lg font-semibold">{gameName}</h2>
        </div>
    );
} 