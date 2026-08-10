import { createBrowserRouter, Navigate } from "react-router-dom";
import RootLayout from "@/components/layouts/RootLayout";
import MainLayout from "@/components/layouts/MainLayout";
import { ProtectedRoute } from "@/components/HOCs/ProtectedRoute";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import LoginPage from "@/pages/login";
import UnauthorizedPage from "@/pages/unauthorized";
import UsersPage from "@/pages/users";
import AthletesPage from "@/pages/athletes";
import GroupsPage from "@/pages/groups";
import ExercisesPage from "@/pages/exercises";
import TrainingPage from "@/pages/training";
<<<<<<< HEAD
import NutritionPage from "@/pages/nutrition";
=======
import SwimmingPage from "@/pages/swimming";
import FitnessPage from "@/pages/fitness";
>>>>>>> origin/develop
import type { UserRole } from "@/features/auth/types";

const DASHBOARD_ROLES: UserRole[] = [
  "Admin",
  "SwimmingCoach",
  "FitnessCoach",
  "NutritionSpecialist",
];

const NUTRITION_ROLES: UserRole[] = [
  "Admin",
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
              {
                path: "/users",
                element: (
                  <ProtectedRoute allowedRoles={["Admin"]}>
                    <UsersPage />
                  </ProtectedRoute>
                ),
              },
              {
                path: "/athletes",
                element: (
                  <ProtectedRoute allowedRoles={DASHBOARD_ROLES}>
                    <AthletesPage />
                  </ProtectedRoute>
                ),
              },
              {
                path: "/groups",
                element: (
                  <ProtectedRoute
                    allowedRoles={[
                      "SwimmingCoach",
                      "FitnessCoach",
                      "NutritionSpecialist",
                    ]}
                  >
                    <GroupsPage />
                  </ProtectedRoute>
                ),
              },
              {
                path: "/exercises",
                element: (
                  <ProtectedRoute
                    allowedRoles={[
                      "SwimmingCoach",
                      "FitnessCoach",
                      "NutritionSpecialist",
                    ]}
                  >
                    <ExercisesPage />
                  </ProtectedRoute>
                ),
              },
              {
                path: "/training",
                element: (
                  <ProtectedRoute
                    allowedRoles={["SwimmingCoach", "Admin", "FitnessCoach"]}
                  >
                    <TrainingPage />
                  </ProtectedRoute>
                ),
              },
              {
<<<<<<< HEAD
                path: "/nutrition",
                element: (
                  <ProtectedRoute allowedRoles={NUTRITION_ROLES}>
                    <NutritionPage />
=======
                path: "/swimming",
                element: (
                  <ProtectedRoute allowedRoles={["SwimmingCoach", "Admin"]}>
                    <SwimmingPage />
                  </ProtectedRoute>
                ),
              },
              {
                path: "/fitness",
                element: (
                  <ProtectedRoute allowedRoles={["FitnessCoach", "Admin"]}>
                    <FitnessPage />
>>>>>>> origin/develop
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
