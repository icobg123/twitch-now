import {useQuery} from "@tanstack/react-query";
import {fetchFollowedStreams, type Stream} from "@src/lib/api/twitch";

const CACHE_KEY = "followed-streams-cache";
const CACHE_EXPIRY = 2 * 60 * 1000; // 2 minutes in milliseconds

type CacheData = {
  streams: Stream[];
  timestamp: number;
  lastUpdated: Date;
};

function getCache(): CacheData | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const data = JSON.parse(cached) as CacheData;
    const isExpired = Date.now() - new Date(data.timestamp).getTime() > CACHE_EXPIRY;

    return isExpired ? null : data;
  } catch {
    return null;
  }
}

function setCache(streams: Stream[]) {
  try {
    const cacheData: CacheData = {
      streams,
      timestamp: Date.now(),
      lastUpdated: new Date()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
  } catch (error) {
    console.error("Failed to cache streams:", error);
  }
}

export function useFollowedLiveStreams(
  accessToken: string,
  userId: string,
  isDisabled: boolean
) {
  return useQuery({
    queryKey: ["followed-streams", userId],
    queryFn: async () => {
      const streams = await fetchFollowedStreams(accessToken, userId);
      const data = {
        streams,
        lastUpdated: new Date()
      };
      setCache(streams);
      return data;
    },
    enabled: !isDisabled && !!accessToken && !!userId,
    refetchInterval: CACHE_EXPIRY,
    staleTime: CACHE_EXPIRY,
    gcTime: CACHE_EXPIRY,
    initialData: () => {
      const cached = getCache();
      return cached ? {
        streams: cached.streams,
        lastUpdated: cached.lastUpdated
      } : undefined;
    },
    placeholderData: () => ({
      streams: [],
      lastUpdated: new Date()
    })
  });
} 