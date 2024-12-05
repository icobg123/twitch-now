import { useEffect, useState } from "react";
import { fetchFollowedChannels } from "@src/lib/api/twitch";

type FollowedChannelsProps = {
  accessToken: string;
  userId: string;
};

type FollowedChannel = {
  broadcaster_id: string;
  broadcaster_login: string;
  broadcaster_name: string;
  followed_at: string;
};

export function FollowedChannels({ accessToken, userId }: FollowedChannelsProps) {
  const [channels, setChannels] = useState<FollowedChannel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    async function loadFollowedChannels() {
      try {
        setIsLoading(true);
        const response = await fetchFollowedChannels(accessToken, userId);
        setChannels(response.data);
        setTotal(response.total || response.data.length);
      } catch (err) {
        console.error("Error loading followed channels:", err);
        setError("Failed to load followed channels");
      } finally {
        setIsLoading(false);
      }
    }

    loadFollowedChannels();
  }, [accessToken, userId]);

  if (isLoading) {
    return <div className="loading loading-spinner" />;
  }

  if (error) {
    return <div className="text-error text-sm">{error}</div>;
  }

  if (channels.length === 0) {
    return <div className="text-sm">No followed channels found.</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm text-base-content/70">
        Following {total} channels
      </div>
      <div className="overflow-y-auto max-h-96">
        <ul className="space-y-2">
          {channels.map(channel => (
            <li 
              key={channel.broadcaster_id}
              className="p-2 bg-base-200 rounded-lg hover:bg-base-300 transition-colors"
            >
              <div className="flex flex-col">
                <span className="font-semibold">{channel.broadcaster_name}</span>
                <span className="text-xs text-base-content/70">
                  @{channel.broadcaster_login}
                </span>
                <span className="text-xs text-base-content/70">
                  Followed on: {new Date(channel.followed_at).toLocaleDateString()}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 