import { z } from "zod";

export const staffRoleValues = [
  "Admin",
  "SwimmingCoach",
  "FitnessCoach",
  "NutritionSpecialist",
  "Athlete",
] as const;

export const roleFilterSchema = z.enum(["all", ...staffRoleValues]);
export type RoleFilter = z.infer<typeof roleFilterSchema>;

export const ROLE_FILTER_LABELS: Record<RoleFilter, string> = {
  all: "All",
  Admin: "Administrator",
  SwimmingCoach: "Swimming Coach",
  FitnessCoach: "Fitness Coach",
  NutritionSpecialist: "Nutrition Specialist",
  Athlete: "Athlete",
};

export const createUserSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
  role: z.enum(staffRoleValues, { message: "Role is required" }),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;

