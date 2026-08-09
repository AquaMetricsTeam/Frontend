// ─── Enums ───────────────────────────────────────────────────────────────────

export const StrokeType = {
  Freestyle: 1,
  Backstroke: 2,
  Breaststroke: 3,
  Butterfly: 4,
  IndividualMedley: 5,
  Kick: 6,
  Pull: 7,
  Drill: 8,
  Mixed: 9,
} as const;

export type StrokeType = (typeof StrokeType)[keyof typeof StrokeType];

export const PerformanceStatus = {
  Completed: 1,
  PartiallyCompleted: 2,
  Skipped: 3,
  Modified: 4,
} as const;

export type PerformanceStatus =
  (typeof PerformanceStatus)[keyof typeof PerformanceStatus];

export const PerformanceGrade = {
  NeedsWork: 1,
  Fair: 2,
  Good: 3,
  Excellent: 4,
  Mastered: 5,
} as const;

export type PerformanceGrade =
  (typeof PerformanceGrade)[keyof typeof PerformanceGrade];

// ─── Domain Models ────────────────────────────────────────────────────────────

export interface SwimmingPerformance {
  id: number;
  trainingRecordId?: number;
  athleteId?: string;
  athleteName?: string;
  trainingSessionId?: number;
  trainingSessionTitle?: string;
  sessionDate?: string;
  stroke: StrokeType;
  distanceMeters: number;
  repetitions: number;
  restIntervalSeconds: number;
  bestRepTime: string; // e.g. "00:01:08"
  averageRepTime: string; // e.g. "00:01:10"
  worstRepTime: string; // e.g. "00:01:13"
  technique: PerformanceGrade;
  start: PerformanceGrade;
  turns: PerformanceGrade;
  finish: PerformanceGrade;
  paceConsistency: PerformanceGrade;
  rpe?: number | null;
  status: PerformanceStatus;
  coachComment?: string | null;
  isArchived?: boolean;
}

export type SwimmingPerformanceResponse = SwimmingPerformance;
export type SwimmingPerformanceDetailsResponse = SwimmingPerformance;

// ─── Payloads & Requests ─────────────────────────────────────────────────────

export interface SwimmingDrillRequest {
  stroke: StrokeType;
  distanceMeters: number;
  repetitions: number;
  restIntervalSeconds: number;
  bestRepTime: string; // "00:mm:ss"
  averageRepTime: string; // "00:mm:ss"
  worstRepTime: string; // "00:mm:ss"
  technique: PerformanceGrade;
  start: PerformanceGrade;
  turns: PerformanceGrade;
  finish: PerformanceGrade;
  paceConsistency: PerformanceGrade;
  rpe?: number | null;
  status: PerformanceStatus;
  coachComment?: string | null;
}

export interface CreateSwimmingPerformancePayload {
  trainingRecordId: number;
  swimmingPerformances: SwimmingDrillRequest[];
}

export interface UpdateSwimmingPerformancePayload {
  stroke: StrokeType;
  distanceMeters: number;
  repetitions: number;
  restIntervalSeconds: number;
  bestRepTime: string;
  averageRepTime: string;
  worstRepTime: string;
  technique: PerformanceGrade;
  start: PerformanceGrade;
  turns: PerformanceGrade;
  finish: PerformanceGrade;
  paceConsistency: PerformanceGrade;
  rpe?: number | null;
  status: PerformanceStatus;
  coachComment?: string | null;
}

// ─── Fetch Parameters & Pagination ──────────────────────────────────────────

export interface SwimmingPerformanceQueryParameters {
  pageIndex?: number;
  pageSize?: number;
  athleteId?: string;
  trainingSessionId?: number;
  stroke?: StrokeType;
  status?: PerformanceStatus;
  descending?: boolean;
  isArchived?: boolean;
  search?: string;
}

export interface SwimmingPerformancesPaginatedResponse {
  items: SwimmingPerformance[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
}
