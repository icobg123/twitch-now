import {useEffect, useMemo, useState} from "react";
import {useFollowedLiveStreams} from "@src/hooks/useFollowedLiveStreams";
import {useTwitchAuth} from "@src/hooks/useTwitchAuth";
import {storage} from "@src/lib/storage";

export type SortOption = "viewers-desc" | "viewers-asc" | "started" | "name";
export type FilterOption = "all" | "gaming";

export type SortBy = "viewers-desc" | "viewers-asc" | "started" | "name-asc" | "name-desc";
export type FilterBy = "all" | "gaming";

const DEFAULT_SORT: SortBy = "viewers-desc";
const DEFAULT_FILTER: FilterBy = "all";

export function useStreamFilters() {
  const [sortBy, setSortBy] = useState<SortBy>(DEFAULT_SORT);
  const [filterBy, setFilterBy] = useState<FilterBy>(DEFAULT_FILTER);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load saved preferences
  useEffect(() => {
    async function loadSavedPreferences() {
      try {
        const [savedSort, savedFilter] = await Promise.all([
          storage.get<SortBy>("streamSort"),
          storage.get<FilterBy>("streamFilter")
        ]);

        if (savedSort) setSortBy(savedSort);
        if (savedFilter) setFilterBy(savedFilter);
      } catch (error) {
        console.error("Failed to load stream preferences:", error);
      } finally {
        setIsInitialized(true);
      }
    }

    loadSavedPreferences();
  }, []);

  // Save preferences when they change
  useEffect(() => {
    if (!isInitialized) return;

    async function savePreferences() {
      try {
        await Promise.all([
          storage.set("streamSort", sortBy),
          storage.set("streamFilter", filterBy)
        ]);
      } catch (error) {
        console.error("Failed to save stream preferences:", error);
      }
    }

    savePreferences();
  }, [sortBy, filterBy, isInitialized]);

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
    let filtered = [...streams];

    if (filterBy === "gaming") {
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
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "viewers-desc":
          return (b.viewer_count ?? 0) - (a.viewer_count ?? 0);
        case "viewers-asc":
          return (a.viewer_count ?? 0) - (b.viewer_count ?? 0);
        case "started":
          return new Date(b.started_at ?? 0).getTime() - 
                 new Date(a.started_at ?? 0).getTime();
        case "name-asc":
          return (a.user_name ?? "").toLowerCase()
            .localeCompare((b.user_name ?? "").toLowerCase());
        case "name-desc":
          return (b.user_name ?? "").toLowerCase()
            .localeCompare((a.user_name ?? "").toLowerCase());
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
    isAuthenticated: !!accessToken,
    isInitialized
  };
}
