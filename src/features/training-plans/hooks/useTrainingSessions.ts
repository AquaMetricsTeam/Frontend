import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { fetchTrainingSessions } from "../services/fetchTrainingSessions.service";
import { SESSION_KEYS } from "../constants/queryKeys";
import type { FetchSessionsParams } from "../types/index";

export function useTrainingSessions(params: FetchSessionsParams) {
  return useQuery({
    queryKey: SESSION_KEYS.list(params),
    queryFn: () => fetchTrainingSessions(params),
  });
}

export function useSessionsFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") ?? 1);

  function setPage(value: number) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", String(value));
      return next;
    });
  }

  return { page, setPage };
}
