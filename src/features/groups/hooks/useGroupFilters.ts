import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "@/hooks/useDebounce";

export function useGroupFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const pageNumber = Math.max(1, Number(searchParams.get("pageNumber") || "1"));
  const urlSearch = searchParams.get("search") || "";
  const onlyArchived = searchParams.get("onlyArchived") === "true";

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
      next.delete("pageNumber");
      return next;
    });
  }, [debouncedSearch, setSearchParams]);

  const setOnlyArchived = useCallback(
    (value: boolean) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value) {
          next.set("onlyArchived", "true");
        } else {
          next.delete("onlyArchived");
        }
        next.delete("pageNumber");
        return next;
      });
    },
    [setSearchParams],
  );

  return {
    localSearch,
    setLocalSearch,
    debouncedSearch: debouncedSearch.trim() || undefined,
    onlyArchived,
    setOnlyArchived,
    pageNumber,
  };
}
