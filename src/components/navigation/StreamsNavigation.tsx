import {
  ArrowDown01,
  ArrowDown10,
  ArrowDownAZ,
  ArrowDownZA,
  ArrowUpDown,
  ClockArrowDown,
  ClockArrowUp,
  Gamepad,
  Radio,
  Users,
} from "lucide-react";
import {useState} from "react";
import type {FilterBy, SortBy} from "@src/hooks/useStreamFilters";

type StreamsNavigationProps = {
  filterBy: FilterBy;
  sortBy: SortBy;
  setFilterBy: (filter: FilterBy) => void;
  setSortBy: (sort: SortBy) => void;
};

type SortType = "viewers" | "started" | "name" | "game-viewers" | "game-channels" | "game-name";
type SortDirection = "asc" | "desc";

// Add icon and label mappings
const SORT_TYPE_CONFIG = {
  viewers: {
    icon: <ArrowDown10 className="h-4 w-4" />,
    label: "Viewers"
  },
  started: {
    icon: <ClockArrowDown className="h-4 w-4" />,
    label: "Duration"
  },
  name: {
    icon: <ArrowDownAZ className="h-4 w-4" />,
    label: "Name"
  },
  "game-viewers": {
    icon: <ArrowDown10 className="h-4 w-4" />,
    label: "Viewers"
  },
  "game-channels": {
    icon: <Users className="h-4 w-4" />,
    label: "Channels"
  },
  "game-name": {
    icon: <ArrowDownAZ className="h-4 w-4" />,
    label: "Name"
  }
} as const;

const SORT_DIRECTION_CONFIG = {
  desc: {
    viewers: <ArrowDown10 className="h-4 w-4" />,
    started: <ClockArrowDown className="h-4 w-4" />,
    name: <ArrowDownZA className="h-4 w-4" />,
    "game-viewers": <ArrowDown10 className="h-4 w-4" />,
    "game-channels": <ArrowDown10 className="h-4 w-4" />,
    "game-name": <ArrowDownZA className="h-4 w-4" />,
  },
  asc: {
    viewers: <ArrowDown01 className="h-4 w-4" />,
    started: <ClockArrowUp className="h-4 w-4" />,
    name: <ArrowDownAZ className="h-4 w-4" />,
    "game-viewers": <ArrowDown01 className="h-4 w-4" />,
    "game-channels": <ArrowDown01 className="h-4 w-4" />,
    "game-name": <ArrowDownAZ className="h-4 w-4" />,
  }
} as const;

export function StreamsNavigation({
  filterBy,
  sortBy,
  setFilterBy,
  setSortBy,
}: StreamsNavigationProps) {
  const [isSortTypeOpen, setIsSortTypeOpen] = useState(false);
  const [isSortDirOpen, setIsSortDirOpen] = useState(false);

  // Extract current sort type and direction
  const getCurrentSortType = (): SortType => {
    if (sortBy.startsWith("viewers-")) return "viewers";
    if (sortBy.startsWith("started-")) return "started";
    if (sortBy.startsWith("name-")) return "name";
    if (sortBy.startsWith("game-viewers-")) return "game-viewers";
    if (sortBy.startsWith("game-channels-")) return "game-channels";
    if (sortBy.startsWith("game-name-")) return "game-name";
    return "viewers";
  };

  const getCurrentSortDirection = (): SortDirection => {
    return sortBy.endsWith("-desc") ? "desc" : "asc";
  };

  const handleSortChange = (type: SortType, direction: SortDirection) => {
    const newSort = `${type}-${direction}` as SortBy;
    setSortBy(newSort);
    setIsSortTypeOpen(false);
    setIsSortDirOpen(false);
  };

  // Update the icon getters to use the config objects
  const getSortTypeIcon = (type: SortType) => {
    return SORT_TYPE_CONFIG[type]?.icon ?? <ArrowUpDown className="h-4 w-4" />;
  };

  const getSortDirIcon = (direction: SortDirection, type: SortType) => {
    return SORT_DIRECTION_CONFIG[direction]?.[type] ?? <ArrowUpDown className="h-4 w-4" />;
  };

  return (
    <footer className="btm-nav btm-nav-sm border-t border-base-300 bg-base-100">
      <button
        className={`${filterBy === "live" ? "active !bg-primary/10 !text-primary" : ""}`}
        onClick={() => setFilterBy("live")}
      >
        <Radio className="h-4 w-4" />
        <span className="btm-nav-label text-xs">Live</span>
      </button>

      <button
        className={`${filterBy === "games" ? "active !bg-primary/10 !text-primary" : ""}`}
        onClick={() => setFilterBy("games")}
      >
        <Gamepad className="h-4 w-4" />
        <span className="btm-nav-label text-xs">Games</span>
      </button>

      <div className="dropdown dropdown-end dropdown-top">
        <button
          className={`flex h-full w-full flex-col items-center justify-center gap-0.5`}
          onClick={() => setIsSortTypeOpen(!isSortTypeOpen)}
          onBlur={(e) => {
            setTimeout(() => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                setIsSortTypeOpen(false);
              }
            }, 100);
          }}
          tabIndex={0}
        >
          {getSortTypeIcon(getCurrentSortType())}
          <span className="btm-nav-label text-xs">Sort</span>
        </button>
        <ul
          className={`menu dropdown-content w-52 translate-y-[-0.5rem] rounded-box bg-base-100 p-2 shadow ${
            isSortTypeOpen ? "" : "hidden"
          }`}
          tabIndex={0}
        >
          {filterBy === "live" ? (
            <>
              {(["viewers", "started", "name"] as const).map((type) => (
                <li key={type}>
                  <button
                    className={getCurrentSortType() === type ? "active !text-primary" : ""}
                    onClick={() => handleSortChange(type, getCurrentSortDirection())}
                  >
                    {SORT_TYPE_CONFIG[type].icon}
                    {SORT_TYPE_CONFIG[type].label}
                  </button>
                </li>
              ))}
            </>
          ) : (
            <>
              {(["game-viewers", "game-channels", "game-name"] as const).map((type) => (
                <li key={type}>
                  <button
                    className={getCurrentSortType() === type ? "active !text-primary" : ""}
                    onClick={() => handleSortChange(type, getCurrentSortDirection())}
                  >
                    {SORT_TYPE_CONFIG[type].icon}
                    {SORT_TYPE_CONFIG[type].label}
                  </button>
                </li>
              ))}
            </>
          )}
        </ul>
      </div>

      <div className="dropdown dropdown-end dropdown-top">
        <button
          className={`flex h-full w-full flex-col items-center justify-center gap-0.5`}
          onClick={() => setIsSortDirOpen(!isSortDirOpen)}
          onBlur={(e) => {
            setTimeout(() => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                setIsSortDirOpen(false);
              }
            }, 100);
          }}
          tabIndex={0}
        >
          {getSortDirIcon(getCurrentSortDirection(), getCurrentSortType())}
          <span className="btm-nav-label text-xs">Order</span>
        </button>
        <ul
          className={`menu dropdown-content w-52 translate-y-[-0.5rem] rounded-box bg-base-100 p-2 shadow ${
            isSortDirOpen ? "" : "hidden"
          }`}
          tabIndex={0}
        >
          <li>
            <button
              className={getCurrentSortDirection() === "desc" ? "active !text-primary" : ""}
              onClick={() => handleSortChange(getCurrentSortType(), "desc")}
            >
              {getSortDirIcon("desc", getCurrentSortType())}
              Descending
            </button>
          </li>
          <li>
            <button
              className={getCurrentSortDirection() === "asc" ? "active !text-primary" : ""}
              onClick={() => handleSortChange(getCurrentSortType(), "asc")}
            >
              {getSortDirIcon("asc", getCurrentSortType())}
              Ascending
            </button>
          </li>
        </ul>
      </div>
    </footer>
  );
}
