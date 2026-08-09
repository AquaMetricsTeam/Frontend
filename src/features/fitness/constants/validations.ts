import { z } from "zod";

const PerformanceStatusEnum = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
]);

export const exercisePerformanceSchema = z.object({
  planExerciseId: z.coerce.number().min(1, "Exercise is required"),
  completedSets: z.coerce.number().min(0, "Sets cannot be negative"),
  completedReps: z.coerce.number().min(0, "Reps cannot be negative"),
  completedDuration: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? null : Number(v)),
    z.number().nullable().optional(),
  ),
  weightUsed: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? null : Number(v)),
    z.number().nullable().optional(),
  ),
  rpe: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? null : Number(v)),
    z.number().min(1).max(10).nullable().optional(),
  ),
  status: PerformanceStatusEnum,
  coachComment: z.string().optional().nullable(),
});

export const createFitnessRecordSchema = z.object({
  athleteId: z.string().min(1, "Athlete is required"),
  trainingSessionId: z.coerce.number().min(1, "Session is required"),
  performanceRating: z.coerce.number().min(1).max(10),
  fatigueLevel: z.coerce.number().min(1).max(10),
  sessionCompleted: z.boolean(),
  injuryOccurred: z.boolean(),
  overallComment: z.string().optional().nullable(),
  exercisePerformances: z
    .array(exercisePerformanceSchema)
    .min(1, "At least one exercise is required"),
});

export type ExercisePerformanceFormValues = z.infer<
  typeof exercisePerformanceSchema
>;
export type CreateFitnessRecordFormValues = z.infer<
  typeof createFitnessRecordSchema
>;
