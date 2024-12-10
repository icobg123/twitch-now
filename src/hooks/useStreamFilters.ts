import { useState, useMemo } from "react";
import type { Stream } from "@src/lib/api/twitch";

export type SortOption = "viewers-desc" | "viewers-asc" | "started" | "name";
export type FilterOption = "all" | "gaming";

export function useStreamFilters(streams: Stream[]) {
  const [sortBy, setSortBy] = useState<SortOption>("viewers-desc");
  const [filterBy, setFilterBy] = useState<FilterOption>("all");

  const filteredAndSortedStreams = useMemo(() => {
    // First apply filters
    let filtered = [...streams];

    if (filterBy === "gaming") {
      filtered = filtered.filter(stream => 
        stream.game_name && [
          "Games",
          "Gaming",
          "Slots",
          "Casino",
          "Sports"
        ].some(category => 
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
          return (
            (a.user_name || "").toLowerCase().localeCompare(
              (b.user_name || "").toLowerCase()
            )
          );
        default:
          return 0;
      }
    });
  }, [streams, sortBy, filterBy]);

  console.log('Sorting by:', sortBy, 'Filtered streams:', filteredAndSortedStreams);

  return {
    sortBy,
    filterBy,
    setSortBy,
    setFilterBy,
    filteredStreams: filteredAndSortedStreams,
  };
} 