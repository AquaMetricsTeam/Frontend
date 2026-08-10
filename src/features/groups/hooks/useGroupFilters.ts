import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "@/hooks/useDebounce";

export function useGroupFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const pageNumber = Math.max(
    1,
    Number(searchParams.get("pageNumber") || searchParams.get("page") || "1"),
  );
  const urlSearch = searchParams.get("search") || "";
  const onlyArchived = searchParams.get("onlyArchived") === "true";

  const [localSearch, setLocalSearch] = useState(urlSearch);
  const isFirstRender = useRef(true);

  useEffect(() => {
    setLocalSearch(urlSearch);
  }, [urlSearch]);

  const debouncedSearch = useDebounce(localSearch, 300);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const trimmed = debouncedSearch.trim();
    if (trimmed === urlSearch) return;

    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (trimmed) {
        next.set("search", trimmed);
      } else {
        next.delete("search");
      }
      next.delete("pageNumber");
      next.delete("page");
      return next;
    });
  }, [debouncedSearch, urlSearch, setSearchParams]);

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
        next.delete("page");
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
