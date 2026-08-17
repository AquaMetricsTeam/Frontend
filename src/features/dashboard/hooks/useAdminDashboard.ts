import { useQuery } from "@tanstack/react-query";
import { fetchAdminDashboard } from "../services/fetchAdminDashboard.service";
import { DASHBOARD_QUERY_KEYS } from "../constants/queryKeys";

export function useAdminDashboard() {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.admin(),
    queryFn: fetchAdminDashboard,
  });
}
