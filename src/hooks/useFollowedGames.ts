import {useQuery} from "@tanstack/react-query";
import {fetchFollowedGames} from "@src/lib/api/twitch";

export function useFollowedGames(
  accessToken: string,
  userId: string,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ["followed-games", userId],
    queryFn: () => fetchFollowedGames(accessToken, userId),
    enabled: enabled && !!accessToken && !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  });
} 