// ─── Chat ────────────────────────────────────────────────────────────────────

export interface ChatSessionResponse {
  id: number;
  coachId: string;
  domainId: number;
  athleteId: string | null;
  athleteName: string | null;
  title: string | null;
  createdAt: string;
  updatedAt: string | null;
  messageCount: number;
}

export interface ChatMessageResponse {
  id: number;
  chatSessionId: number;
  role: "user" | "assistant";
  content: string;
  evidence: RetrievedDocument[];
  createdAt: string;
}

export interface RetrievedDocument {
  documentId: number;
  chunkId: string;
  content: string;
  score: number;
  metadata: Record<string, string | null>;
}

export interface ChatReplyResponse {
  session: ChatSessionResponse;
  userMessage: ChatMessageResponse;
  assistantMessage: ChatMessageResponse;
}

// ─── Plan Generation ─────────────────────────────────────────────────────────

export interface AiPlanResponse {
  recommendationId: number;
  trainingPlanId: number | null;
  nutritionPlanId: number | null;
  assignmentId: number;
  athleteId: string;
  domainId: number;
  planTitle: string;
  recommendation: string;
  status: number;
  assignmentStatus: string;
  isActive: boolean;
  generatedAt: string;
  lineCount: number;
  missingExerciseNotes: string | null;
}

// ─── Recommendation Review ───────────────────────────────────────────────────

export interface AiRecommendationResponse {
  id: number;
  athleteId: string;
  domainId: number;
  recommendation: string;
  rationale: string;
  status: number;
  generatedAt: string;
  requestedById: string;
  evidence: RecommendationEvidenceResponse[];
}

export interface RecommendationEvidenceResponse {
  documentId: number;
  documentTitle: string;
  chunkId: string;
  score: number;
}

// ─── Recommendation List ─────────────────────────────────────────────────────

export interface RecommendationListItem {
  id: number;
  athleteId: string;
  athleteName: string;
  domainId: number;
  recommendation: string;
  status: number;
  generatedAt: string;
}

// ─── Current Plan ────────────────────────────────────────────────────────────

export interface AthleteCurrentPlanDto {
  assignmentId: number;
  planId: number;
  domainId: number;
  title: string;
  objectives: string | null;
  description: string | null;
  dailyCalories: number | null;
  proteinGrams: number | null;
  carbGrams: number | null;
  fatGrams: number | null;
  startDate: string | null;
  endDate: string | null;
  isActive: boolean;
  approvalStatus: number;
  source: number;
  isAiGenerated: boolean;
  overrideOfAssignmentId: number | null;
}

// ─── Paginated response (backend format) ─────────────────────────────────────

export interface PagedResponse<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

// ─── Request payloads ────────────────────────────────────────────────────────

export interface CreateChatSessionRequest {
  athleteId?: string;
  title?: string;
}

export interface SendChatMessageRequest {
  message: string;
}

export interface GenerateAiPlanRequest {
  athleteId: string;
  domainId: number;
  query: string;
}

export interface RecommendationReviewRequest {
  decision: 1 | 2;
  comments?: string;
}

// ─── Fetch params ────────────────────────────────────────────────────────────

export interface FetchChatSessionsParams {
  pageNumber?: number;
  pageSize?: number;
}

export interface FetchRecommendationsParams {
  domainId?: number;
  pageNumber?: number;
  pageSize?: number;
}

export interface FetchAthleteRecommendationsParams {
  pageNumber?: number;
  pageSize?: number;
}
