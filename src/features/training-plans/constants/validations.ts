import { z } from "zod";

// ─── Step 1 ────────────────────────────────────────────────────────────────────

export const planInfoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});

export type PlanInfoFormValues = z.infer<typeof planInfoSchema>;

// ─── Step 2 ────────────────────────────────────────────────────────────────────

export const planExerciseSchema = z.object({
  exerciseId: z.coerce.number().min(1, "Exercise is required"),
  sets: z.coerce.number().min(1, "Min 1 set"),
  reps: z.coerce.number().min(0),
  duration: z.coerce.number().min(0),
  intensity: z.coerce.number().min(1).max(3).optional().default(2),
  notes: z.string().optional(),
});

export const exercisesStepSchema = z.object({
  exercises: z.array(planExerciseSchema).min(1, "Add at least one exercise"),
});

export type PlanExerciseFormValues = z.infer<typeof planExerciseSchema>;
export type ExercisesStepFormValues = z.infer<typeof exercisesStepSchema>;

// ─── Step 3 ────────────────────────────────────────────────────────────────────

export const assignmentStepSchema = z.object({
  assignNow: z.boolean().default(false),
  athleteIds: z.array(z.string()).default([]),
  groupIds: z.array(z.number()).default([]),
});

export type AssignmentStepFormValues = z.infer<typeof assignmentStepSchema>;

// ─── Session Form ──────────────────────────────────────────────────────────────

export const sessionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  trainingPlanId: z.coerce.number().min(1, "Training plan is required"),
  sessionDate: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  location: z.string().min(1, "Location is required"),
  notes: z.string().optional(),
});

export type SessionFormValues = z.infer<typeof sessionSchema>;
