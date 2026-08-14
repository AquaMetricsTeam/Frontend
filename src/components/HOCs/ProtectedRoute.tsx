import { type ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/components/Providers/AuthProvider";
import { Loading } from "@/components/feedbacks/Loading";
import type { UserRole } from "@/features/auth/types";

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  redirectTo?: string;
  children?: ReactNode;
}

export function ProtectedRoute({
  allowedRoles,
  redirectTo = "/login",
  children,
}: ProtectedRouteProps) {
  const { isLoading, isAuthenticated, hasAnyRole } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loading />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !hasAnyRole(allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}

