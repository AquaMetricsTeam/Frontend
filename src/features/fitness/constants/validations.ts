import { z } from "zod";

export const exercisePerformanceSchema = z.object({
  planExerciseId: z.number().min(1, "Exercise is required"),
  completedSets: z.number().min(0, "Sets cannot be negative"),
  completedReps: z.number().min(0, "Reps cannot be negative"),
  completedDuration: z.number().nullable().optional(),
  weightUsed: z.number().nullable().optional(),
  rpe: z.number().min(1).max(10).nullable().optional(),
  status: z.number().min(1).max(4),
  coachComment: z.string().optional().nullable(),
});

export const createFitnessRecordSchema = z
  .object({
    athleteId: z.string().min(1, "Athlete is required"),
    trainingSessionId: z.number().min(1, "Session is required"),
    performanceRating: z.number().min(1).max(10),
    fatigueLevel: z.number().min(1).max(10),
    sessionCompleted: z.boolean(),
    injuryOccurred: z.boolean(),
    injuryType: z.number().nullable().optional(),
    injuryBodyPart: z.number().nullable().optional(),
    injuryComment: z.string().nullable().optional(),
    overallComment: z.string().optional().nullable(),
    exercisePerformances: z
      .array(exercisePerformanceSchema)
      .min(1, "At least one exercise is required"),
  })
  .refine(
    (data) => {
      if (data.injuryOccurred) {
        return data.injuryType != null && data.injuryBodyPart != null;
      }
      return true;
    },
    {
      message: "Injury type and body part are required when injury occurred",
      path: ["injuryType"],
    },
  );

export type ExercisePerformanceFormValues = z.infer<
  typeof exercisePerformanceSchema
>;
export type CreateFitnessRecordFormValues = z.infer<
  typeof createFitnessRecordSchema
>;
