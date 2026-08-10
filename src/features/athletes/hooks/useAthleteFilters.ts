import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";

export function useAthleteFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const searchParam = searchParams.get("search") || "";

  const [localSearch, setLocalSearch] = useState(searchParam);
  const [debouncedSearch, setDebouncedSearch] = useState(searchParam);

  useEffect(() => {
    setLocalSearch(searchParam);
  }, [searchParam]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(localSearch);
    }, 400);

    return () => clearTimeout(timer);
  }, [localSearch]);

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (debouncedSearch === searchParam) return;

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
  }, [debouncedSearch, searchParam, setSearchParams]);

  return {
    localSearch,
    setLocalSearch,
    debouncedSearch,
    page,
  };
}
