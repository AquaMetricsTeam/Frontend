import { useQuery } from "@tanstack/react-query";
import { getMeService } from "../services/me.service";
import { getStoredToken } from "@/utils/authStorage";
import { AUTH_QUERY_KEYS } from "../constants/queryKeys";

export function useMe(options?: { staleTime?: number }) {
  return useQuery({
    queryKey: AUTH_QUERY_KEYS.me(),
    queryFn: getMeService,
    enabled: !!getStoredToken(),
    staleTime: options?.staleTime ?? Infinity,
    retry: false,
  });
}


