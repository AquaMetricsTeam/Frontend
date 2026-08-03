import { z } from "zod";

export const assignCoachSchema = z.object({
  coachId: z.string().min(1, "Please select a coach"),
});

export type AssignCoachFormValues = z.infer<typeof assignCoachSchema>;
