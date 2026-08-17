import { customFetch } from "@/services/customFetch";
import type { AdminDashboardData } from "../types/index";

export async function fetchAdminDashboard(): Promise<
  ApiResponse<AdminDashboardData>
> {
  return customFetch<ApiResponse<AdminDashboardData>>("/admin-dashboard");
}
