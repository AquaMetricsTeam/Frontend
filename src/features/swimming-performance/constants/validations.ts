import { z } from "zod";
import { StrokeType, PerformanceStatus, PerformanceGrade } from "../types";

const strokeValues = Object.values(StrokeType) as number[];
const gradeValues = Object.values(PerformanceGrade) as number[];
const statusValues = Object.values(PerformanceStatus) as number[];

export const swimmingDrillSchema = z.object({
  stroke: z.number().refine((val) => strokeValues.includes(val), {
    message: "Invalid stroke type",
  }),
  distanceMeters: z
    .number()
    .min(1, "Distance must be greater than 0"),
  repetitions: z
    .number()
    .min(1, "Repetitions must be at least 1"),
  restIntervalSeconds: z
    .number()
    .min(0, "Rest interval cannot be negative"),
  bestRepTime: z.string().min(1, "Best rep time is required"),
  averageRepTime: z.string().min(1, "Average rep time is required"),
  worstRepTime: z.string().min(1, "Worst rep time is required"),
  technique: z.number().refine((val) => gradeValues.includes(val)),
  start: z.number().refine((val) => gradeValues.includes(val)),
  turns: z.number().refine((val) => gradeValues.includes(val)),
  finish: z.number().refine((val) => gradeValues.includes(val)),
  paceConsistency: z.number().refine((val) => gradeValues.includes(val)),
  rpe: z.number().min(1).max(10).optional().nullable(),
  status: z.number().refine((val) => statusValues.includes(val)),
  coachComment: z.string().optional().nullable(),
});

export const createSwimmingPerformanceSchema = z.object({
  trainingRecordId: z.number().min(1, "Training record ID is required"),
  swimmingPerformances: z
    .array(swimmingDrillSchema)
    .min(1, "At least one swimming performance drill must be logged"),
});

export const updateSwimmingPerformanceSchema = swimmingDrillSchema;

export type SwimmingDrillFormValues = z.infer<typeof swimmingDrillSchema>;
export type CreateSwimmingPerformanceFormValues = z.infer<
  typeof createSwimmingPerformanceSchema
>;
