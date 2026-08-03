import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "@/hooks/useDebounce";

export function useExerciseFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Math.max(1, Number(searchParams.get("page") || "1"));
  const urlSearch = searchParams.get("search") || "";

  const [localSearch, setLocalSearch] = useState(urlSearch);
  const isMounted = useRef(false);

  useEffect(() => {
    setLocalSearch(urlSearch);
  }, [urlSearch]);

  const debouncedSearch = useDebounce(localSearch, 300);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      const trimmed = debouncedSearch.trim();
      if (trimmed) {
        next.set("search", trimmed);
      } else {
        next.delete("search");
      }
      next.delete("page");
      return next;
    });
  }, [debouncedSearch, setSearchParams]);

  const resetPage = useCallback(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("page");
      return next;
    });
  }, [setSearchParams]);

  return {
    localSearch,
    setLocalSearch,
    debouncedSearch: debouncedSearch.trim() || undefined,
    page,
    resetPage,
  };
}
