import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "@/hooks/useDebounce";

export function useFitnessRecordFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const initialSearch = searchParams.get("search") ?? "";
  const athleteId = searchParams.get("athleteId") ?? undefined;
  const sessionCompleted = searchParams.has("completed")
    ? searchParams.get("completed") === "true"
    : undefined;
  const injuryOccurred = searchParams.has("injury")
    ? searchParams.get("injury") === "true"
    : undefined;
  const descending = searchParams.get("sort") !== "asc";

  const [localSearch, setLocalSearch] = useState(initialSearch);
  const debouncedSearch = useDebounce(localSearch, 300);

  useEffect(() => {
    setLocalSearch(initialSearch);
  }, [initialSearch]);

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (debouncedSearch === initialSearch) return;

    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (debouncedSearch) {
          next.set("search", debouncedSearch);
        } else {
          next.delete("search");
        }
        next.delete("page");
        return next;
      },
      { replace: true },
    );
  }, [debouncedSearch, initialSearch, setSearchParams]);

  function setAthleteFilter(id?: string) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        id ? next.set("athleteId", id) : next.delete("athleteId");
        next.delete("page");
        return next;
      },
      { replace: true },
    );
  }

  function setCompletedFilter(val?: boolean) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        val !== undefined
          ? next.set("completed", String(val))
          : next.delete("completed");
        next.delete("page");
        return next;
      },
      { replace: true },
    );
  }

  function setInjuryFilter(val?: boolean) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        val !== undefined
          ? next.set("injury", String(val))
          : next.delete("injury");
        next.delete("page");
        return next;
      },
      { replace: true },
    );
  }

  function setSortDescending(desc: boolean) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        desc ? next.delete("sort") : next.set("sort", "asc");
        return next;
      },
      { replace: true },
    );
  }

  return {
    page,
    localSearch,
    setLocalSearch,
    debouncedSearch,
    athleteId,
    setAthleteFilter,
    sessionCompleted,
    setCompletedFilter,
    injuryOccurred,
    setInjuryFilter,
    descending,
    setSortDescending,
  };
}
