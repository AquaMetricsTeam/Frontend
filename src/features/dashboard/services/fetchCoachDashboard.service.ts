import { customFetch } from "@/services/customFetch";
import type { CoachDashboardData } from "../types/index";

export async function fetchCoachDashboard(): Promise<
  ApiResponse<CoachDashboardData>
> {
  return customFetch<ApiResponse<CoachDashboardData>>("/coach-dashboard");
}
