import { z } from "zod";

export const createExerciseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().nullable().optional(),
  muscleGroup: z.number().nullable().optional(),
  category: z.number().nullable().optional(),
});

export const updateExerciseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().nullable().optional(),
  muscleGroup: z.number().nullable().optional(),
  category: z.number().nullable().optional(),
});

export type CreateExerciseFormValues = z.infer<typeof createExerciseSchema>;
export type UpdateExerciseFormValues = z.infer<typeof updateExerciseSchema>;
