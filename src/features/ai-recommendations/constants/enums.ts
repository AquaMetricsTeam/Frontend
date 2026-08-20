// ─── Approval Status (Training / Nutrition Plans) ─────────────────────────────
export const ApprovalStatus = {
  Draft: 1,
  Approved: 2,
  Rejected: 3,
} as const;
export type ApprovalStatus =
  (typeof ApprovalStatus)[keyof typeof ApprovalStatus];

// ─── Plan Source ──────────────────────────────────────────────────────────────
export const PlanSource = {
  Manual: 1,
  AiAssisted: 2,
} as const;
export type PlanSource = (typeof PlanSource)[keyof typeof PlanSource];

// ─── Recommendation Status ────────────────────────────────────────────────────
export const RecommendationStatus = {
  Pending: 1,
  Approved: 2,
  Rejected: 3,
} as const;
export type RecommendationStatus =
  (typeof RecommendationStatus)[keyof typeof RecommendationStatus];

// ─── Recommendation Decision (Review API) ─────────────────────────────────────
export const RecommendationDecision = {
  Approved: 1,
  Rejected: 2,
} as const;
export type RecommendationDecision =
  (typeof RecommendationDecision)[keyof typeof RecommendationDecision];

// ─── Domain Id ────────────────────────────────────────────────────────────────
export const DomainId = {
  Swimming: 1,
  Fitness: 2,
  Nutrition: 3,
} as const;
export type DomainId = (typeof DomainId)[keyof typeof DomainId];

// ─── Role → Domain Mapping ────────────────────────────────────────────────────
export const ROLE_DOMAIN_MAP: Record<string, DomainId> = {
  SwimmingCoach: DomainId.Swimming,
  FitnessCoach: DomainId.Fitness,
  NutritionSpecialist: DomainId.Nutrition,
};

// ─── Coach Roles That Use AI ──────────────────────────────────────────────────
export const AI_COACH_ROLES = [
  "SwimmingCoach",
  "FitnessCoach",
  "NutritionSpecialist",
] as const;
