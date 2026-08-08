import { useQuery } from "@tanstack/react-query";
import { fetchTrainingSession } from "../services/fetchTrainingSession.service";
import { SESSION_KEYS } from "../constants/queryKeys";

export function useTrainingSession(id: number, enabled: boolean = true) {
  return useQuery({
    queryKey: SESSION_KEYS.detail(id),
    queryFn: () => fetchTrainingSession(id),
    enabled: enabled && id > 0,
  });
}
