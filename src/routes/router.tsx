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
import AthleteProfilePage from "@/pages/athlete-profile";
import AthleteRegistrationsPage from "@/pages/athlete-registrations";
import GroupsPage from "@/pages/groups";
import ExercisesPage from "@/pages/exercises";
import ExercisesLandingPage from "@/pages/exercises-landing";
import TrainingTemplatesPage from "@/pages/training-templates";
import TrainingAssignmentsPage from "@/pages/training-assignments";
import TrainingSessionsPage from "@/pages/training-sessions";
import NutritionPage from "@/pages/nutrition";
import SwimmingPage from "@/pages/swimming";
import FitnessPage from "@/pages/fitness";
import CoachNotesPage from "@/pages/coach-notes";
import type { UserRole } from "@/features/auth/types";

const ATHLETE_ROLES: UserRole[] = [
  "Admin",
  "SwimmingCoach",
  "FitnessCoach",
  "NutritionSpecialist",
];

const NUTRITION_ROLES: UserRole[] = [
  "Admin",
  "NutritionSpecialist",
];

const TRAINING_ROLES: UserRole[] = [
  "SwimmingCoach",
  "Admin",
  "FitnessCoach",
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
                  <ProtectedRoute allowedRoles={ATHLETE_ROLES}>
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
                  <ProtectedRoute allowedRoles={ATHLETE_ROLES}>
                    <AthletesPage />
                  </ProtectedRoute>
                ),
              },
              {
                path: "/athlete-registrations",
                element: (
                  <ProtectedRoute allowedRoles={["Admin"]}>
                    <AthleteRegistrationsPage />
                  </ProtectedRoute>
                ),
              },
              {
                path: "/athletes/:athleteId",
                element: (
                  <ProtectedRoute allowedRoles={ATHLETE_ROLES}>
                    <AthleteProfilePage />
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
                      "Admin",
                    ]}
                  >
                    <ExercisesLandingPage />
                  </ProtectedRoute>
                ),
              },
              {
                path: "/exercises/:type/:value",
                element: (
                  <ProtectedRoute
                    allowedRoles={[
                      "SwimmingCoach",
                      "FitnessCoach",
                      "Admin",
                    ]}
                  >
                    <ExercisesPage />
                  </ProtectedRoute>
                ),
              },
              {
                path: "/training",
                element: <Navigate to="/training-templates" replace />,
              },
              {
                path: "/training-plans",
                element: <Navigate to="/training-templates" replace />,
              },
              {
                path: "/training-templates",
                element: (
                  <ProtectedRoute allowedRoles={TRAINING_ROLES}>
                    <TrainingTemplatesPage />
                  </ProtectedRoute>
                ),
              },
              {
                path: "/training-assignments",
                element: (
                  <ProtectedRoute allowedRoles={TRAINING_ROLES}>
                    <TrainingAssignmentsPage />
                  </ProtectedRoute>
                ),
              },
              {
                path: "/training-sessions",
                element: (
                  <ProtectedRoute allowedRoles={TRAINING_ROLES}>
                    <TrainingSessionsPage />
                  </ProtectedRoute>
                ),
              },
              {
                path: "/nutrition",
                element: (
                  <ProtectedRoute allowedRoles={NUTRITION_ROLES}>
                    <NutritionPage />
                  </ProtectedRoute>)
              },
              {
                path: "/swimming",
                element: (
                  <ProtectedRoute allowedRoles={["SwimmingCoach"]}>
                    <SwimmingPage />
                  </ProtectedRoute>
                ),
              },
              {
                path: "/fitness",
                element: (
                  <ProtectedRoute allowedRoles={["FitnessCoach"]}>
                    <FitnessPage />
                  </ProtectedRoute>
                ),
              },
              {
                path: "/coach-notes",
                element: (
                  <ProtectedRoute
                    allowedRoles={[
                      "SwimmingCoach",
                      "FitnessCoach",
                      "Admin",
                    ]}
                  >
                    <CoachNotesPage />
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
