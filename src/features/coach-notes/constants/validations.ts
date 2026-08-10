import { z } from "zod";

export const createCoachNoteSchema = z.object({
  athleteId: z.string().min(1, "validations.athleteRequired"),
  content: z
    .string()
    .min(3, "validations.contentMinLength")
    .max(2000, "validations.contentMaxLength"),
});

export const updateCoachNoteSchema = z.object({
  content: z
    .string()
    .min(3, "validations.contentMinLength")
    .max(2000, "validations.contentMaxLength"),
});

export type CreateCoachNoteFormValues = z.infer<typeof createCoachNoteSchema>;
export type UpdateCoachNoteFormValues = z.infer<typeof updateCoachNoteSchema>;
