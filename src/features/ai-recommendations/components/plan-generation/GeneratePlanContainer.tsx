import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  MdAutoAwesome,
  MdCheckCircle,
  MdArrowForward,
} from "react-icons/md";
import Box from "@/components/layouts/Box";
import { Button } from "@/components/ui/button";
import { useMe } from "@/features/auth/hooks/useMe";
import { useAthletesLookup } from "@/features/lookups/hooks/useAthletesLookup";
import { ROLE_DOMAIN_MAP } from "./../../constants/enums";
import { generatePlanSchema } from "./../../constants/validations";
import GeneratePlanForm from "./GeneratePlanForm";
import { useAiGeneration } from "./../../context/AiGenerationContext";

export default function GeneratePlanContainer() {
  const { t } = useTranslation("aiPlan");
  const navigate = useNavigate();

  const [athleteId, setAthleteId] = useState("");
  const [query, setQuery] = useState("");
  const [errors, setErrors] = useState<{
    athleteId?: string;
    domainId?: string;
    query?: string;
  }>({});

  const { isGenerating, startGeneration, lastResult } = useAiGeneration();

  const { data: meRes } = useMe();
  const user = meRes?.data;
  const primaryRole = user?.roles?.[0] ?? "";
  const domainId = ROLE_DOMAIN_MAP[primaryRole];

  const athletesQuery = useAthletesLookup();
  const athletes = athletesQuery.data?.data ?? [];

  const handleSubmit = useCallback(() => {
    if (domainId == null) {
      toast.error(t("validations.domainRequired"));
      return;
    }

    const result = generatePlanSchema.safeParse({ athleteId, domainId, query });
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        athleteId: fieldErrors.athleteId?.[0]
          ? t(fieldErrors.athleteId[0])
          : undefined,
        domainId: fieldErrors.domainId?.[0]
          ? t(fieldErrors.domainId[0])
          : undefined,
        query: fieldErrors.query?.[0] ? t(fieldErrors.query[0]) : undefined,
      });
      return;
    }

    setErrors({});

    const selectedAthlete = athletes.find((a) => a.athleteId === athleteId);

    startGeneration({
      athleteId,
      athleteName: selectedAthlete?.fullName,
      domainId: domainId!,
      query,
    });
  }, [athleteId, query, domainId, startGeneration, athletes, t]);

  return (
    <div className="space-y-4">
      {/* Background generating in-page status notice */}
      {isGenerating && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 flex items-center gap-3.5 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="relative flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
            <span className="absolute inset-0 rounded-lg bg-primary/20 animate-ping opacity-30" />
            <MdAutoAwesome className="size-5 animate-pulse text-primary" />
          </div>
          <div className="text-xs">
            <p className="font-bold text-foreground">
              {t("generate.generatingBackground", {
                defaultValue: "Generating AI Plan in the background...",
              })}
            </p>
            <p className="text-muted-foreground mt-0.5 leading-relaxed">
              {t("generate.generatingNotice", {
                defaultValue:
                  "AI Plan generation is in progress. You can freely navigate away; we will notify you once it is ready.",
              })}
            </p>
          </div>
        </div>
      )}

      {/* Success banner if a plan was recently generated */}
      {!isGenerating && lastResult && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-500">
              <MdCheckCircle className="size-5" />
            </div>
            <div className="text-xs truncate">
              <p className="font-bold text-foreground truncate">
                {t("toasts.generateSuccess", {
                  defaultValue: "Plan generated successfully.",
                })}
              </p>
              <p className="text-muted-foreground mt-0.5 truncate">
                {lastResult.planTitle ||
                  t("review.generatedPlanTitle", {
                    defaultValue: "Generated Plan",
                  })}
              </p>
            </div>
          </div>

          <Button
            size="sm"
            onClick={() => {
              navigate(`/ai/review/${lastResult.recommendationId}`, {
                state: {
                  missingExerciseNotes: lastResult.missingExerciseNotes,
                  planId:
                    lastResult.trainingPlanId ??
                    lastResult.nutritionPlanId ??
                    null,
                },
              });
            }}
            className="cursor-pointer gap-1.5 shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <span>{t("generate.viewPlan", { defaultValue: "View Plan" })}</span>
            <MdArrowForward className="size-4" />
          </Button>
        </div>
      )}

      <Box>
        <GeneratePlanForm
          athleteId={athleteId}
          onAthleteChange={(id) => {
            setAthleteId(id);
            if (errors.athleteId)
              setErrors((prev) => ({ ...prev, athleteId: undefined }));
          }}
          query={query}
          onQueryChange={(q) => {
            setQuery(q);
            if (errors.query)
              setErrors((prev) => ({ ...prev, query: undefined }));
          }}
          domainId={domainId}
          errors={errors}
          onSubmit={handleSubmit}
          isGenerating={isGenerating}
        />
      </Box>
    </div>
  );
}
