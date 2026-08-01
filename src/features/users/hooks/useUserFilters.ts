import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "@/hooks/useDebounce";

export function useUserFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Math.max(1, Number(searchParams.get("page") || "1"));
  const urlSearch = searchParams.get("search") || "";
  const role = searchParams.get("role") || undefined;

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

  const setRole = useCallback(
    (newRole: string | undefined) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (newRole) {
          next.set("role", newRole);
        } else {
          next.delete("role");
        }
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
    role,
    page,
    setRole,
  };
}
