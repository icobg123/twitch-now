import type {StreamGroup} from "@src/hooks/useGroupedStreams";

type GroupHeaderProps = {
  group: StreamGroup;
};

export function GroupHeader({ group }: GroupHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <img
        src={group.box_art_url.replace("{width}x{height}", "96x96")}
        alt={group.name}
        className="h-12 w-12 rounded-lg object-cover"
      />
      <h3 className="font-semibold">{group.name}</h3>
      <div className="badge badge-primary ml-auto">
        {group.streams.length} {group.streams.length === 1 ? "stream" : "streams"}
      </div>
    </div>
  );
} 