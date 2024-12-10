import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchFollowedStreams, type Stream } from "@src/lib/api/twitch";
import { useState, useEffect } from "react";

export function useFollowedLiveStreams(
  accessToken: string,
  userId: string,
  skip: boolean
) {
  const queryKey = ["followed-streams", userId];
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const { data: streams, isLoading, error, isFetching } = useQuery<Stream[], Error>({
    queryKey,
    queryFn: () => {
      console.log('📡 Query function executing');
      return fetchFollowedStreams(accessToken, userId);
    },
    enabled: !skip && !!accessToken && !!userId,
    staleTime: 0,
    refetchInterval: 2 * 60 * 1000,
    refetchOnWindowFocus: true,
    retry: 2,
    initialData: [],
    refetchOnMount: true,
  });

  // Update lastUpdated whenever streams data changes
  useEffect(() => {
    if (!isFetching) {
      setLastUpdated(new Date());
    }
  }, [streams, isFetching]);

  return {
    streams,
    isLoading,
    isFetching,
    error: error?.message ?? null,
    lastUpdated,
  };
} 