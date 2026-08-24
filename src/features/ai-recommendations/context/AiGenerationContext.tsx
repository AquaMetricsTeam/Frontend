import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { generatePlan } from "../services/generatePlan.service";
import { AI_KEYS } from "../constants/queryKeys";
import { generateIdempotencyKey } from "@/lib/utils";
import type { AiPlanResponse } from "../types/index";

interface StartGenerationParams {
  athleteId: string;
  athleteName?: string;
  domainId: number;
  query: string;
}

interface AiGenerationContextType {
  isGenerating: boolean;
  athleteName?: string;
  athleteId?: string;
  domainId?: number;
  query?: string;
  lastResult: AiPlanResponse | null;
  startGeneration: (params: StartGenerationParams) => Promise<void>;
  resetLastResult: () => void;
}

const AiGenerationContext = createContext<AiGenerationContextType | undefined>(
  undefined,
);

export function AiGenerationProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation("aiPlan");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isGenerating, setIsGenerating] = useState(false);
  const [athleteName, setAthleteName] = useState<string | undefined>();
  const [athleteId, setAthleteId] = useState<string | undefined>();
  const [domainId, setDomainId] = useState<number | undefined>();
  const [query, setQuery] = useState<string | undefined>();
  const [lastResult, setLastResult] = useState<AiPlanResponse | null>(null);

  const activeKeyRef = useRef<string | null>(null);

  const resetLastResult = useCallback(() => {
    setLastResult(null);
  }, []);

  const startGeneration = useCallback(
    async (params: StartGenerationParams) => {
      if (isGenerating) {
        toast.warning(t("toasts.conflictError"));
        return;
      }

      setIsGenerating(true);
      setAthleteName(params.athleteName);
      setAthleteId(params.athleteId);
      setDomainId(params.domainId);
      setQuery(params.query);
      setLastResult(null);

      const idempotencyKey = generateIdempotencyKey();
      activeKeyRef.current = idempotencyKey;

      try {
        const response = await generatePlan(
          {
            athleteId: params.athleteId,
            domainId: params.domainId,
            query: params.query,
          },
          idempotencyKey,
        );

        setIsGenerating(false);
        activeKeyRef.current = null;
        setLastResult(response.data);

        queryClient.invalidateQueries({ queryKey: AI_KEYS.recommendations() });

        const resultData = response.data;
        const targetUrl = `/ai/review/${resultData.recommendationId}`;
        const navState = {
          missingExerciseNotes: resultData.missingExerciseNotes,
          planId: resultData.trainingPlanId ?? resultData.nutritionPlanId ?? null,
        };

        toast.success(response.message || t("toasts.generateSuccess"), {
          duration: 15000,
          action: {
            label: t("generate.viewPlan", { defaultValue: "View Plan" }),
            onClick: () => {
              navigate(targetUrl, { state: navState });
            },
          },
        });
      } catch (error: any) {
        setIsGenerating(false);
        activeKeyRef.current = null;

        const err = error as Error & { status?: number; errors?: string[] | null };
        if (err.status === 409) {
          toast.error(t("toasts.conflictError"));
          return;
        }
        if (err.status === 403) {
          toast.error(t("toasts.accessError"));
          return;
        }
        if (err.status === 400) {
          if (err.errors?.length) {
            toast.error(err.errors.join(" · "));
          } else {
            toast.error(t("toasts.invalidPlanError"));
          }
          return;
        }
        toast.error(t("toasts.generateError"));
      }
    },
    [isGenerating, t, queryClient, navigate],
  );

  return (
    <AiGenerationContext.Provider
      value={{
        isGenerating,
        athleteName,
        athleteId,
        domainId,
        query,
        lastResult,
        startGeneration,
        resetLastResult,
      }}
    >
      {children}
    </AiGenerationContext.Provider>
  );
}

export function useAiGeneration() {
  const context = useContext(AiGenerationContext);
  if (!context) {
    throw new Error("useAiGeneration must be used within an AiGenerationProvider");
  }
  return context;
}
