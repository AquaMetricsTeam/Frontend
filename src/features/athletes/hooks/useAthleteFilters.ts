import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export function useAthleteFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const searchParam = searchParams.get("search") || "";

  const [localSearch, setLocalSearch] = useState(searchParam);
  const [debouncedSearch, setDebouncedSearch] = useState(searchParam);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(localSearch);
    }, 400);

    return () => clearTimeout(timer);
  }, [localSearch]);

  useEffect(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);

        if (debouncedSearch) {
          next.set("search", debouncedSearch);
        } else {
          next.delete("search");
        }

        next.set("page", "1");
        return next;
      },
      { replace: true },
    );
  }, [debouncedSearch, setSearchParams]);

  return {
    localSearch,
    setLocalSearch,
    debouncedSearch,
    page,
  };
}
