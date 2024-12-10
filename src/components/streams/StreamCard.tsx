import { type Stream } from "@src/lib/api/twitch";
import { Clock } from "lucide-react";

function getStreamDuration(startTime: string): string {
  const start = new Date(startTime);
  const now = new Date();
  const diffMs = now.getTime() - start.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export function StreamCard({ stream }: { stream: Stream }) {
  return (
    <a
      href={`https://twitch.tv/${stream.user_login}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex gap-3 bg-base-100 shadow-md transition-all hover:shadow-lg hover:bg-base-200"
    >
      <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-l-lg">
        <img
          src={stream.thumbnail_url
            .replace("{width}", "128")
            .replace("{height}", "80")}
          alt={stream.title}
          className="h-full w-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute bottom-0 left-0 right-0">
          <span className="truncate rounded-tr-lg bg-black/70 p-1 text-sm font-medium text-white">
            {stream.user_name}
          </span>
        </div>
      </div>
      <div className="relative min-w-0 flex-1 py-1 pr-2 flex flex-col">
        {/* Title */}
        <h3 className="line-clamp-1 text-sm font-semibold">{stream.title}</h3>

        {/* Game name */}
        <p className="text-xs italic text-base-content/70">
          {stream.game_name}
        </p>

        {/* Stream info row */}
        <div className="mt-auto flex items-center justify-between text-xs pt-1">
          <div className="flex items-center gap-2">
            {/* Duration */}
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-base-content/70" />
              <span>{getStreamDuration(stream.started_at)}</span>
            </div>

            {/* Language */}
            <span className="uppercase text-base-content/50">
              {stream.language}
            </span>
          </div>

          {/* Viewer count */}
          <div className="flex items-center gap-1">
            <div className="size-3 rounded-full bg-red-500"></div>
            <span>{stream.viewer_count.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </a>
  );
}
