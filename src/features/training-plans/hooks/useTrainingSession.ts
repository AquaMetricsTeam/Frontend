import { useQuery } from "@tanstack/react-query";
import { fetchTrainingSession } from "../services/fetchTrainingSession.service";
import { SESSION_KEYS } from "../constants/queryKeys";

export function useTrainingSession(
  id: number,
  enabled: boolean = true,
  isPresent: boolean = false,
) {
  return useQuery({
    queryKey: SESSION_KEYS.detail(id, isPresent),
    queryFn: () => fetchTrainingSession(id, isPresent),
    enabled: enabled && id > 0,
  });
}
