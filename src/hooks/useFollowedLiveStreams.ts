import { useEffect, useState } from "react";
import { fetchFollowedStreams } from "@src/lib/api/twitch";

type Stream = {
  id: string;
  user_id: string;
  user_login: string;
  user_name: string;
  game_name: string;
  title: string;
  viewer_count: number;
  started_at: string;
  thumbnail_url: string;
  tags: string[];
  is_mature: boolean;
};

export function useFollowedLiveStreams(
  accessToken: string, 
  userId: string,
  disabled: boolean = false
) {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStreams() {
      if (disabled) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const response = await fetchFollowedStreams(accessToken, userId);
        setStreams(response.data);
      } catch (err) {
        console.error("Error loading streams:", err);
        setError("Failed to load streams");
      } finally {
        setIsLoading(false);
      }
    }

    loadStreams();
  }, [accessToken, userId, disabled]);

  return { streams, isLoading, error };
} 