import type {
  FetchChatSessionsParams,
  FetchRecommendationsParams,
  FetchAthleteRecommendationsParams,
} from "../types/index";

export const AI_KEYS = {
  all: ["ai-recommendations"] as const,

  // Chat
  chat: () => [...AI_KEYS.all, "chat"] as const,
  chatSessions: (params?: FetchChatSessionsParams) =>
    [...AI_KEYS.chat(), "sessions", params] as const,
  chatSession: (sessionId: number) =>
    [...AI_KEYS.chat(), "session", sessionId] as const,
  chatMessages: (sessionId: number) =>
    [...AI_KEYS.chat(), "messages", sessionId] as const,

  // Recommendations
  recommendations: () => [...AI_KEYS.all, "recommendations"] as const,
  recommendationList: (params: FetchRecommendationsParams) =>
    [...AI_KEYS.recommendations(), "list", params] as const,
  athleteRecommendations: (
    athleteId: string,
    params?: FetchAthleteRecommendationsParams,
  ) => [...AI_KEYS.recommendations(), "athlete", athleteId, params] as const,
  recommendationDetail: (id: number) =>
    [...AI_KEYS.recommendations(), "detail", id] as const,

  // Current plan
  currentPlan: () => [...AI_KEYS.all, "currentPlan"] as const,
  athleteCurrentPlan: (athleteId: string, type: "training" | "nutrition") =>
    [...AI_KEYS.currentPlan(), athleteId, type] as const,
};
