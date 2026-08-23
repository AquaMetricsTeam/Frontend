import { useQuery } from "@tanstack/react-query";
import { getMeService } from "../services/me.service";
import { getStoredToken } from "@/utils/authStorage";
import { AUTH_QUERY_KEYS } from "../constants/queryKeys";

export function useMe(options?: { staleTime?: number }) {
  return useQuery({
    queryKey: AUTH_QUERY_KEYS.me(),
    queryFn: async () => {
      const token = getStoredToken();
      if (!token) return null;
      return getMeService();
    },
    staleTime: options?.staleTime ?? Infinity,
    retry: false,
  });
}


