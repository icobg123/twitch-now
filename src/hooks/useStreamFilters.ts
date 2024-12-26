import {useFollowedLiveStreams} from "./useFollowedLiveStreams";
import {useState} from "react";
import {useTwitchAuth} from "./useTwitchAuth";

export type FilterBy = "live" | "games";
export type SortBy = "viewers-desc" | "viewers-asc" | "started-desc" | "started-asc" | "name-desc" | "name-asc";

export function useStreamFilters() {
  const [filterBy, setFilterBy] = useState<FilterBy>("live");
  const [sortBy, setSortBy] = useState<SortBy>("viewers-desc");
  
  const { accessToken, userId } = useTwitchAuth();

  const {
    data,
    isLoading,
    error,
  } = useFollowedLiveStreams(
    accessToken ?? "",
    userId ?? "",
    !accessToken || !userId
  );

  const streams = data?.streams ?? [];
  const lastUpdated = data?.lastUpdated;

  return {
    streams,
    isLoading,
    error,
    filterBy,
    sortBy,
    setFilterBy,
    setSortBy,
    lastUpdated,
  };
}
