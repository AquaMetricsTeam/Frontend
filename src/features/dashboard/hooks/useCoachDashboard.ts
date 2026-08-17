import { useQuery } from "@tanstack/react-query";
import { fetchCoachDashboard } from "../services/fetchCoachDashboard.service";
import { DASHBOARD_QUERY_KEYS } from "../constants/queryKeys";

export function useCoachDashboard() {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.coach(),
    queryFn: fetchCoachDashboard,
  });
}
