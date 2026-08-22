export const TRAINING_PLAN_KEYS = {
  all: ["training-plans"] as const,
  list: (params: object) => [...TRAINING_PLAN_KEYS.all, "list", params] as const,
  detail: (id: number) => [...TRAINING_PLAN_KEYS.all, "detail", id] as const,
} as const;

export const ASSIGNMENT_KEYS = {
  all: ["training-plan-assignments"] as const,
  byPlan: (planId: number) => [...ASSIGNMENT_KEYS.all, "by-plan", planId] as const,
} as const;

export const SESSION_KEYS = {
  all: ["training-sessions"] as const,
  list: (params: object) => [...SESSION_KEYS.all, "list", params] as const,
  detail: (id: number, isPresent?: boolean) =>
    [...SESSION_KEYS.all, "detail", id, { isPresent: Boolean(isPresent) }] as const,
} as const;

export const ATTENDANCE_KEYS = {
  all: ["attendance"] as const,
  bySession: (sessionId: number) =>
    [...ATTENDANCE_KEYS.all, "by-session", sessionId] as const,
} as const;
