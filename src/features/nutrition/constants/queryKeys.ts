import type { GetNutritionPlansParams } from "../types/index";

export const NUTRITION_KEYS = {
  all: ["nutrition"] as const,
  
  // Plans
  plans: () => [...NUTRITION_KEYS.all, "plans"] as const,
  planList: (params: GetNutritionPlansParams) =>
    [...NUTRITION_KEYS.plans(), "list", params] as const,
  planDetail: (id: string) =>
    [...NUTRITION_KEYS.plans(), "detail", id] as const,
  
  // Assignments
  assignments: () => [...NUTRITION_KEYS.all, "assignments"] as const,
  assignmentsByPlan: (planId: string | number) =>
    [...NUTRITION_KEYS.assignments(), "plan", String(planId)] as const,
};
