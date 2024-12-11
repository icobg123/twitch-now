import {useMemo} from "react";
import {useFollowedGames} from "@src/hooks/useFollowedGames";
import type {SortBy} from "@src/hooks/useStreamFilters";

export type Game = {
  id: string;
  name: string;
  box_art_url: string;
  viewer_count?: number;
  broadcaster_count?: number;
};

export function useGameFilters(
  accessToken: string,
  userId: string,
  sortBy: SortBy,
  enabled: boolean = true
) {
  const {
    data: gamesData,
    isLoading,
    error,
    isFetching,
  } = useFollowedGames(accessToken, userId, enabled);

  const sortedGames = useMemo(() => {
    const games = gamesData?.games ?? [];
    return [...games].sort((a, b) => {
      switch (sortBy) {
        case "game-viewers-desc":
          return (b.viewer_count ?? 0) - (a.viewer_count ?? 0);
        case "game-viewers-asc":
          return (a.viewer_count ?? 0) - (b.viewer_count ?? 0);
        case "game-channels-desc":
          return (b.broadcaster_count ?? 0) - (a.broadcaster_count ?? 0);
        case "game-channels-asc":
          return (a.broadcaster_count ?? 0) - (b.broadcaster_count ?? 0);
        case "game-name-asc":
          return (a.name ?? "").toLowerCase().localeCompare((b.name ?? "").toLowerCase());
        case "game-name-desc":
          return (b.name ?? "").toLowerCase().localeCompare((a.name ?? "").toLowerCase());
        default:
          return 0;
      }
    });
  }, [gamesData?.games, sortBy]);

  return {
    games: sortedGames,
    isLoading,
    error,
    isFetching,
    lastUpdated: gamesData?.lastUpdated,
  };
} 