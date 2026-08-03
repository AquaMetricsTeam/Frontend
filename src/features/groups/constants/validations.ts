import { z } from "zod";

export const createGroupSchema = z.object({
  name: z.string().min(1, "Group name is required"),
  description: z.string().optional(),
});

export const updateGroupSchema = z.object({
  name: z.string().min(1, "Group name is required"),
  description: z.string().optional(),
});

export const assignAthletesSchema = z.object({
  athleteIds: z.array(z.string().uuid()).min(1, "Select at least one athlete"),
});

export type CreateGroupFormValues = z.infer<typeof createGroupSchema>;
export type UpdateGroupFormValues = z.infer<typeof updateGroupSchema>;
export type AssignAthletesFormValues = z.infer<typeof assignAthletesSchema>;
