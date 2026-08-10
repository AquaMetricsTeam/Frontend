import { z } from "zod";

// ─── Meal Validation ────────────────────────────────────────────────────────

export const mealSchema = z.object({
  // The API returns numeric IDs; coerce to string so both number and string
  // values from the server pass validation without type errors.
  id: z.string().optional(),

  // mealType arrives as a number (1–6) from the API.
  mealType: z.number().int().min(1).max(6),

  description: z.string().min(1, "Meal description is required"),

  // Numeric macro fields: the form already provides numeric values.
  calories: z.number().int().min(0, "Calories must be non-negative"),
  proteinGrams: z.number().int().min(0, "Protein must be non-negative"),
  carbGrams: z.number().int().min(0, "Carbs must be non-negative"),
  fatGrams: z.number().int().min(0, "Fat must be non-negative"),

  dietaryNotes: z.string().optional(),
});

export type MealFormValues = z.infer<typeof mealSchema>;

// ─── Nutrition Plan Validation ──────────────────────────────────────────────

export const nutritionPlanSchema = z.object({
  // plan.id also comes as a number from the API; normalize to string in code.
  id: z.string().optional(),

  name: z
    .string()
    .min(1, "Plan name is required")
    .max(150, "Plan name must not exceed 150 characters"),

  objective: z.string().optional(),
  schedule: z.string().optional(),

  // UI-only field for the calorie boundary check. Not sent to the API.
  targetCalories: z.number().min(0).optional().default(0),

  meals: z.array(mealSchema).min(1, "At least one meal is required"),
});

export type NutritionPlanFormValues = z.infer<typeof nutritionPlanSchema>;
export type NutritionPlanFormRawValues = z.input<typeof nutritionPlanSchema>;

// ─── Assignment Validation ──────────────────────────────────────────────────

export const assignmentSchema = z
  .object({
    nutritionPlanId: z.string().min(1, "Nutrition plan is required"),
    athleteId: z.string().optional(),
    groupId: z.string().optional(),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
  })
  .refine(
    (data) => {
      const hasAthlete = !!data.athleteId && data.athleteId.trim().length > 0;
      const hasGroup = !!data.groupId && data.groupId.trim().length > 0;
      return hasAthlete !== hasGroup;
    },
    {
      message: "Either athlete or group must be selected, but not both",
      path: ["athleteId"],
    },
  )
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return end >= start;
    },
    {
      message: "End date must be greater than or equal to start date",
      path: ["endDate"],
    },
  );

export type AssignmentFormValues = z.infer<typeof assignmentSchema>;
