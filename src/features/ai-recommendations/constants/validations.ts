import { z } from "zod";

export const createChatSessionSchema = z.object({
  athleteId: z.string().optional(),
  title: z.string().max(200, "validations.titleMaxLength").optional(),
});

export const sendChatMessageSchema = z.object({
  message: z
    .string()
    .min(1, "validations.messageRequired")
    .max(4000, "validations.messageMaxLength"),
});

export const generatePlanSchema = z.object({
  athleteId: z.string().min(1, "validations.athleteRequired"),
  domainId: z.number().min(1).max(3),
  query: z
    .string()
    .min(1, "validations.queryRequired")
    .max(2000, "validations.queryMaxLength"),
});

export const reviewRecommendationSchema = z.object({
  decision: z.union([z.literal(1), z.literal(2)]),
  comments: z
    .string()
    .max(2000, "validations.commentsMaxLength")
    .optional(),
});

export type CreateChatSessionFormValues = z.infer<
  typeof createChatSessionSchema
>;
export type SendChatMessageFormValues = z.infer<typeof sendChatMessageSchema>;
export type GeneratePlanFormValues = z.infer<typeof generatePlanSchema>;
export type ReviewRecommendationFormValues = z.infer<
  typeof reviewRecommendationSchema
>;
