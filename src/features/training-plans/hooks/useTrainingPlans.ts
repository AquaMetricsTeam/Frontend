import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { fetchTrainingPlans } from "../services/fetchTrainingPlans.service";
import { TRAINING_PLAN_KEYS } from "../constants/queryKeys";
import type { FetchTrainingPlansParams } from "../types/index";

export function useTrainingPlans(params: FetchTrainingPlansParams) {
  return useQuery({
    queryKey: TRAINING_PLAN_KEYS.list(params),
    queryFn: () => fetchTrainingPlans(params),
  });
}

export function useTrainingPlansFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") ?? 1);
  const search = searchParams.get("search") ?? "";
  const isArchived = searchParams.get("archived") === "true";

  function setSearch(value: string) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("search", value);
      next.set("page", "1");
      return next;
    });
  }

  function setArchived(value: boolean) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("archived", String(value));
      next.set("page", "1");
      return next;
    });
  }

  return { page, search, isArchived, setSearch, setArchived };
}
