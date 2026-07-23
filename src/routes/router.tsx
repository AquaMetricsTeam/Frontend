import { createBrowserRouter, Navigate } from "react-router-dom";
import RootLayout from "@/components/layouts/RootLayout";
import MainLayout from "@/components/layouts/MainLayout";
import { ProtectedRoute } from "@/components/HOCs/ProtectedRoute";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import LoginPage from "@/pages/login";
import UnauthorizedPage from "@/pages/unauthorized";
import type { UserRole } from "@/features/auth/types";

const DASHBOARD_ROLES: UserRole[] = [
  "Admin",
  "SwimmingCoach",
  "FitnessCoach",
  "NutritionSpecialist",
];

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/unauthorized",
        element: <UnauthorizedPage />,
      },

      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <MainLayout />,
            children: [
              {
                path: "/",
                element: (
                  <ProtectedRoute allowedRoles={DASHBOARD_ROLES}>
                    <Dashboard />
                  </ProtectedRoute>
                ),
              },
              { path: "/", element: <Navigate to="/" replace /> },
            ],
          },
        ],
      },

      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
