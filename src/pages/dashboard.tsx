import { Navigate } from "react-router-dom";
import { useAuth } from "@/components/Providers/AuthProvider";
import { AdminDashboard } from "@/features/dashboard/components/AdminDashboard";
import { CoachDashboard } from "@/features/dashboard/components/CoachDashboard";
import { DashboardSkeleton } from "@/features/dashboard/components/DashboardSkeleton";
import { DashboardError } from "@/features/dashboard/components/DashboardError";
import { useAdminDashboard } from "@/features/dashboard/hooks/useAdminDashboard";
import { useCoachDashboard } from "@/features/dashboard/hooks/useCoachDashboard";
import PageWrapper from "@/components/layouts/PageWrapper";
import type { UserRole } from "@/features/auth/types";

const COACH_ROLES: UserRole[] = ["SwimmingCoach", "FitnessCoach"];

function AdminDashboardPage() {
  const { data: res, isLoading, isError, refetch } = useAdminDashboard();

  if (isLoading) return <PageWrapper><DashboardSkeleton /></PageWrapper>;
  if (isError || !res?.data) return <PageWrapper><DashboardError onRetry={refetch} /></PageWrapper>;

  return <PageWrapper><AdminDashboard data={res.data} /></PageWrapper>;
}

function CoachDashboardPage() {
  const { data: res, isLoading, isError, refetch } = useCoachDashboard();

  if (isLoading) return <PageWrapper><DashboardSkeleton /></PageWrapper>;
  if (isError || !res?.data) return <PageWrapper><DashboardError onRetry={refetch} /></PageWrapper>;

  return <PageWrapper><CoachDashboard data={res.data} /></PageWrapper>;
}

export default function Dashboard() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const roles: UserRole[] = user?.roles ?? [];

  if (isLoading) {
    return <PageWrapper><DashboardSkeleton /></PageWrapper>;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (roles.includes("Admin")) {
    return <AdminDashboardPage />;
  }

  if (COACH_ROLES.some((r) => roles.includes(r))) {
    return <CoachDashboardPage />;
  }

  if (roles.includes("NutritionSpecialist")) {
    return <Navigate to="/athletes" replace />;
  }

  return <Navigate to="/unauthorized" replace />;
}
