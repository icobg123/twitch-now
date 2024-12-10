import { useState, useMemo } from "react";
import type { Stream } from "@src/lib/api/twitch";
import { useFollowedLiveStreams } from "./useFollowedLiveStreams";
import { useTwitchAuth } from "./useTwitchAuth";

export type SortOption = "viewers-desc" | "viewers-asc" | "started" | "name";
export type FilterOption = "all" | "gaming";

export function useStreamFilters() {
  const [sortBy, setSortBy] = useState<SortOption>("viewers-desc");
  const [filterBy, setFilterBy] = useState<FilterOption>("all");

  const {
    accessToken,
    userId,
    error: authError
  } = useTwitchAuth();

  const { 
    data, 
    isLoading, 
    isFetching, 
    error: streamsError 
  } = useFollowedLiveStreams(
    accessToken ?? "", 
    userId ?? "", 
    !accessToken || !userId
  );

  const filteredAndSortedStreams = useMemo(() => {
    const streams = data?.streams ?? [];
    
    // First apply filters
    let filtered = [...streams];

    if (filterBy === "gaming") {
      filtered = filtered.filter(
        (stream) =>
          stream.game_name &&
          ["Games", "Gaming", "Slots", "Casino", "Sports"].some((category) =>
            stream.game_name.toLowerCase().includes(category.toLowerCase())
          )
      );
    }

    // Then sort
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "viewers-desc":
          return (b.viewer_count || 0) - (a.viewer_count || 0);
        case "viewers-asc":
          return (a.viewer_count || 0) - (b.viewer_count || 0);
        case "started":
          return (
            new Date(b.started_at || 0).getTime() -
            new Date(a.started_at || 0).getTime()
          );
        case "name":
          return (a.user_name || "")
            .toLowerCase()
            .localeCompare((b.user_name || "").toLowerCase());
        default:
          return 0;
      }
    });
  }, [data?.streams, sortBy, filterBy]);

  return {
    sortBy,
    filterBy,
    setSortBy,
    setFilterBy,
    streams: filteredAndSortedStreams,
    isLoading,
    isFetching,
    error: authError || streamsError,
    lastUpdated: data?.lastUpdated,
    isAuthenticated: !!accessToken
  };
}
