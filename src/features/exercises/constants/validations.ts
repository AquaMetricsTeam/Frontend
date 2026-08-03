import { z } from "zod";

export const createExerciseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});

export const updateExerciseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});

export type CreateExerciseFormValues = z.infer<typeof createExerciseSchema>;
export type UpdateExerciseFormValues = z.infer<typeof updateExerciseSchema>;
