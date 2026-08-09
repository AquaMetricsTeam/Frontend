// ─── Enums ──────────────────────────────────────────────────────────────────

export const MealType = {
  Breakfast: 1,
  Lunch: 2,
  Dinner: 3,
  Snack: 4,
  PreWorkout: 5,
  PostWorkout: 6,
} as const;

export type MealType = (typeof MealType)[keyof typeof MealType];

// ─── Nutrition Plan Meal ────────────────────────────────────────────────────

export interface NutritionPlanMeal {
  id?: string;
  mealType: MealType;
  description: string;
  calories: number;
  proteinGrams: number;
  carbGrams: number;
  fatGrams: number;
  dietaryNotes?: string;
}

// ─── Nutrition Plan ─────────────────────────────────────────────────────────

export interface NutritionPlan {
  id: string;
  name: string;
  objective?: string;
  schedule?: string;
  meals: NutritionPlanMeal[];
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}

// ─── Nutrition Plan Assignment ──────────────────────────────────────────────

export interface NutritionPlanAssignment {
  id: number;
  nutritionPlanId: number;
  nutritionPlanName?: string;
  athleteId?: string;
  groupId?: number | null;
  startDate: string;
  endDate: string | null;
  assignedAt?: string;
}

// ─── Group Assignment Response (real API: POST /nutrition-plan-assignments/group) ──
// The API returns the successfully created assignment records as a flat array.
// Conflicting athletes are silently skipped — there is no skipped list in the response.

export type GroupAssignmentResponse = NutritionPlanAssignment[];

// ─── API Response Payloads ──────────────────────────────────────────────────

export interface GetNutritionPlansParams {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
}

export interface NutritionPlansPaginatedResponse {
  items: NutritionPlan[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

// ─── Mutation Payloads ──────────────────────────────────────────────────────

export interface CreateNutritionPlanPayload {
  name: string;
  objective?: string;
  schedule?: string;
  meals: NutritionPlanMeal[];
}

export interface UpdateNutritionPlanPayload {
  id: string;
  name: string;
  objective?: string;
  schedule?: string;
  meals: NutritionPlanMeal[];
}

export interface AssignPlanToAthletePayload {
  nutritionPlanId: number;
  athleteId: string;
  startDate: string;
  endDate: string | null;
}

export interface AssignPlanToGroupPayload {
  nutritionPlanId: number;
  groupId: number;
  startDate: string;
  endDate: string | null;
}

// ─── Multi-athlete batch assignment (client-side sequential) ────────────────

/** One athlete's assignment result after a sequential batch attempt. */
export interface AthleteAssignmentResult {
  athleteId: string;
  fullName: string;
  status: "success" | "conflict" | "error";
  /** Server error/conflict message when status !== "success" */
  message?: string;
}

/** Aggregated result returned by useAssignMultipleAthletes after all
 *  individual POST requests have settled. */
export interface MultiAthleteAssignmentResult {
  succeeded: AthleteAssignmentResult[];
  failed: AthleteAssignmentResult[];
}

export interface GetPlanAssignmentsParams {
  pageNumber?: number;
  pageSize?: number;
}

export interface PlanAssignmentsPaginatedResponse {
  items: NutritionPlanAssignment[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

// Form Value Types — derived from the Zod schemas so runtime validation and
// TypeScript types are always in sync. Import from validations.ts directly
// when you need the schema itself; import from here for component prop types.
export type {
  NutritionPlanFormValues,
  AssignmentFormValues,
} from "../constants/validations";
