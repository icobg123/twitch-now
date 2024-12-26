import {Stream} from "@src/lib/api/twitch";

type Props = {
  gameName: string;
  gameStreams: Stream[];
};

export function GameHeader({ gameName, gameStreams }: Props) {
  const viewerCount = gameStreams.reduce(
    (sum, stream) => sum + stream.viewer_count,
    0
  );
  const streamCount = gameStreams.length;

  return (
    <div className="flex items-center gap-3 rounded-lg px-2 py-0.5 transition-colors hover:bg-base-200">
      <div className="indicator">
        {gameStreams[0]?.game_box_art_url && (
          <>
            <div className="indicator-item indicator-end">
              <div
                className="badge badge-primary badge-sm"
                title={`${streamCount} active streams`}
              >
                {streamCount}
              </div>
            </div>
            <div className="relative h-[50px] w-[38px] overflow-hidden rounded-md shadow-sm">
              <img
                src={gameStreams[0].game_box_art_url.replace(
                  "{width}x{height}",
                  "76x100"
                )}
                alt={`${gameName} box art`}
                className="absolute left-1/2 top-1/2 h-full w-auto -translate-x-1/2 -translate-y-1/2 object-cover"
                loading="lazy"
              />
            </div>
          </>
        )}
      </div>
      <div className="flex flex-col">
        <h2 className="text-lg font-semibold leading-tight">{gameName}</h2>
        <span className="text-xs text-base-content/70">
          {new Intl.NumberFormat().format(viewerCount)} viewers
        </span>
      </div>
    </div>
  );
}
