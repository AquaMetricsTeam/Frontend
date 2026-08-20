// ─── Knowledge Index Status ───────────────────────────────────────────────────
// Backend `KnowledgeIndexStatus` enum — always numeric on the wire.
// 1 Pending → 4 Processing → 2 Indexed (success) | 3 Failed (no reason exposed).
export const KnowledgeIndexStatus = {
  Pending: 1,
  Indexed: 2,
  Failed: 3,
  Processing: 4,
} as const;
export type KnowledgeIndexStatus =
  (typeof KnowledgeIndexStatus)[keyof typeof KnowledgeIndexStatus];

// ─── Domain Id ────────────────────────────────────────────────────────────────
// Stable backend constants (seeded by DbInitializer). There is no GET /api/domains
// endpoint — the API expects/returns these integer ids directly.
export const DomainId = {
  Swimming: 1,
  Fitness: 2,
  Nutrition: 3,
} as const;
export type DomainId = (typeof DomainId)[keyof typeof DomainId];

// ─── Domain display metadata ──────────────────────────────────────────────────
// Labels live in the `aiKnowledge` i18n namespace; consume with
// useTranslation("aiKnowledge") + t(labelKey). Never invent other domain ids.
export const KNOWLEDGE_DOMAINS: { id: DomainId; labelKey: string }[] = [
  { id: DomainId.Swimming, labelKey: "domain.swimming" },
  { id: DomainId.Fitness, labelKey: "domain.fitness" },
  { id: DomainId.Nutrition, labelKey: "domain.nutrition" },
];