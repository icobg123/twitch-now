import {ArrowUpDown, Gamepad, Users} from "lucide-react";
import {useState} from "react";
import type {FilterBy, SortBy} from "@src/hooks/useStreamFilters";

type StreamsNavigationProps = {
  filterBy: FilterBy;
  sortBy: SortBy;
  setFilterBy: (filter: FilterBy) => void;
  setSortBy: (sort: SortBy) => void;
};

export function StreamsNavigation({
  filterBy,
  sortBy,
  setFilterBy,
  setSortBy,
}: StreamsNavigationProps) {
  const [isSortOpen, setIsSortOpen] = useState(false);

  const handleSortChange = (newSortBy: SortBy) => {
    console.log('Changing sort to:', newSortBy);
    setSortBy(newSortBy);
    setIsSortOpen(false);
  };

  return (
    <footer className="btm-nav btm-nav-sm border-t border-base-300 bg-base-100">
      <button
        className={`${filterBy === "all" ? "active !bg-primary/10 !text-primary" : ""}`}
        onClick={() => setFilterBy("all")}
      >
        <Users className="h-4 w-4" />
        <span className="btm-nav-label text-xs">All</span>
      </button>

      <button
        className={`${filterBy === "gaming" ? "active !bg-primary/10 !text-primary" : ""}`}
        onClick={() => setFilterBy("gaming")}
      >
        <Gamepad className="h-4 w-4" />
        <span className="btm-nav-label text-xs">Gaming</span>
      </button>

      <div className="dropdown dropdown-end dropdown-top">
        <button
          className={`flex h-full w-full flex-col items-center justify-center gap-0.5 ${
            isSortOpen
              ? "!bg-primary/10 !text-primary"
              : sortBy !== "viewers-desc"
                ? "active !bg-primary/10 !text-primary"
                : ""
          }`}
          onClick={() => setIsSortOpen(!isSortOpen)}
          onBlur={(e) => {
            setTimeout(() => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                setIsSortOpen(false);
              }
            }, 100);
          }}
          tabIndex={0}
        >
          <ArrowUpDown
            className={`h-4 w-4 transition-transform ${
              isSortOpen ? "rotate-180" : ""
            }`}
          />
          <span className="btm-nav-label text-xs">Sort</span>
        </button>
        <ul
          className={`menu dropdown-content w-52 translate-y-[-0.5rem] rounded-box bg-base-100 p-2 shadow ${
            isSortOpen ? "" : "hidden"
          }`}
          tabIndex={0}
        >
          <li>
            <button
              className={sortBy === "viewers-desc" ? "active !text-primary" : ""}
              onClick={() => handleSortChange("viewers-desc")}
            >
              Viewers (High to Low)
            </button>
          </li>
          <li>
            <button
              className={sortBy === "viewers-asc" ? "active !text-primary" : ""}
              onClick={() => handleSortChange("viewers-asc")}
            >
              Viewers (Low to High)
            </button>
          </li>
          <li>
            <button
              className={sortBy === "started" ? "active !text-primary" : ""}
              onClick={() => handleSortChange("started")}
            >
              Recently Started
            </button>
          </li>
          <li>
            <button
              className={sortBy === "name" ? "active !text-primary" : ""}
              onClick={() => handleSortChange("name")}
            >
              Streamer Name
            </button>
          </li>
        </ul>
      </div>
    </footer>
  );
} 