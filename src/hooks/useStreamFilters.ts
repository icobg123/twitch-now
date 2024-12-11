import {useEffect, useMemo, useState} from "react";
import {useFollowedLiveStreams} from "@src/hooks/useFollowedLiveStreams";
import {useTwitchAuth} from "@src/hooks/useTwitchAuth";

export type SortOption = "viewers-desc" | "viewers-asc" | "started" | "name";
export type FilterOption = "all" | "gaming";

export type SortBy = "viewers-desc" | "viewers-asc" | "started" | "name";
export type FilterBy = "all" | "gaming";

export function useStreamFilters() {
  const [sortBy, setSortBy] = useState<SortBy>("viewers-desc");
  const [filterBy, setFilterBy] = useState<FilterBy>("all");

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

  useEffect(() => {
    console.log('Sort/Filter changed:', { sortBy, filterBy });
  }, [sortBy, filterBy]);

  const filteredAndSortedStreams = useMemo(() => {
    console.log('Sorting streams with:', { sortBy });
    
    const streams = data?.streams ?? [];
    let filtered = [...streams];

    if (filterBy === "gaming") {
      const beforeCount = filtered.length;
      filtered = filtered.filter((stream) => {
        const gameName = stream.game_name?.toLowerCase() ?? '';
        const gamingCategories = [
          'game',
          'gaming',
          'slots',
          'casino',
          'sports',
          'rpg',
          'fps',
          'moba',
          'simulator'
        ];
        return gamingCategories.some(category => 
          gameName.includes(category)
        );
      });
      console.log(`Filtered gaming streams: ${beforeCount} → ${filtered.length}`);
    }

    // Then sort
    return filtered.sort((a, b) => {
      console.log('Sorting by:', sortBy);
      switch (sortBy) {
        case "viewers-desc":
          return (b.viewer_count ?? 0) - (a.viewer_count ?? 0);
        case "viewers-asc":
          return (a.viewer_count ?? 0) - (b.viewer_count ?? 0);
        case "started":
          return new Date(b.started_at ?? 0).getTime() - 
                 new Date(a.started_at ?? 0).getTime();
        case "name":
          return (a.user_name ?? "").toLowerCase()
            .localeCompare((b.user_name ?? "").toLowerCase());
        default:
          console.warn('Unknown sort option:', sortBy);
          return 0;
      }
    });
  }, [data?.streams, sortBy, filterBy]);

  useEffect(() => {
    console.log('Stream data changed:', {
      streamCount: data?.streams?.length,
      firstStream: data?.streams?.[0],
      filterBy,
      sortBy
    });
  }, [data?.streams, filterBy, sortBy]);

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
