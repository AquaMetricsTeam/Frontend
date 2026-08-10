import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "@/hooks/useDebounce";

export function useSwimmingPerformanceFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const initialSearch = searchParams.get("search") ?? "";
  const athleteId = searchParams.get("athleteId") ?? undefined;
  const trainingSessionId = searchParams.get("sessionId")
    ? Number(searchParams.get("sessionId"))
    : undefined;
  const sessionCompleted = searchParams.get("completed")
    ? searchParams.get("completed") === "true"
    : undefined;
  const injuryOccurred = searchParams.get("injury")
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
        if (id) next.set("athleteId", id);
        else next.delete("athleteId");
        next.delete("page");
        return next;
      },
      { replace: true },
    );
  }

  function setSessionFilter(sessionId?: number) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (sessionId) next.set("sessionId", String(sessionId));
        else next.delete("sessionId");
        next.delete("page");
        return next;
      },
      { replace: true },
    );
  }

  function setSessionCompletedFilter(val?: boolean) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (val !== undefined) next.set("completed", String(val));
        else next.delete("completed");
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
        if (val !== undefined) next.set("injury", String(val));
        else next.delete("injury");
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
        if (!desc) next.set("sort", "asc");
        else next.delete("sort");
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
    trainingSessionId,
    setSessionFilter,
    sessionCompleted,
    setSessionCompletedFilter,
    injuryOccurred,
    setInjuryFilter,
    descending,
    setSortDescending,
  };
}
