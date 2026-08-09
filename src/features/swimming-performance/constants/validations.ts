import { z } from "zod";
import { StrokeType, PerformanceStatus, PerformanceGrade } from "../types";

const strokeValues = Object.values(StrokeType);
const gradeValues = Object.values(PerformanceGrade);
const statusValues = Object.values(PerformanceStatus);

export const swimmingDrillSchema = z.object({
  stroke: z.number().refine((val) => strokeValues.includes(val as any), {
    message: "Invalid stroke type",
  }),
  distanceMeters: z.coerce
    .number()
    .min(1, "Distance must be greater than 0"),
  repetitions: z.coerce
    .number()
    .min(1, "Repetitions must be at least 1"),
  restIntervalSeconds: z.coerce
    .number()
    .min(0, "Rest interval cannot be negative"),
  bestRepTime: z.string().min(1, "Best rep time is required"),
  averageRepTime: z.string().min(1, "Average rep time is required"),
  worstRepTime: z.string().min(1, "Worst rep time is required"),
  technique: z.number().refine((val) => gradeValues.includes(val as any)),
  start: z.number().refine((val) => gradeValues.includes(val as any)),
  turns: z.number().refine((val) => gradeValues.includes(val as any)),
  finish: z.number().refine((val) => gradeValues.includes(val as any)),
  paceConsistency: z.number().refine((val) => gradeValues.includes(val as any)),
  rpe: z.coerce.number().min(1).max(10).optional().nullable(),
  status: z.number().refine((val) => statusValues.includes(val as any)),
  coachComment: z.string().optional().nullable(),
});

export const createSwimmingPerformanceSchema = z.object({
  trainingRecordId: z.coerce.number().min(1, "Training record ID is required"),
  swimmingPerformances: z
    .array(swimmingDrillSchema)
    .min(1, "At least one swimming performance drill must be logged"),
});

export const updateSwimmingPerformanceSchema = swimmingDrillSchema;

export type SwimmingDrillFormValues = z.infer<typeof swimmingDrillSchema>;
export type CreateSwimmingPerformanceFormValues = z.infer<
  typeof createSwimmingPerformanceSchema
>;
