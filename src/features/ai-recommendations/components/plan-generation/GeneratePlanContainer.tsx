import { useState, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Box from "@/components/layouts/Box";
import ErrorMessage from "@/components/feedbacks/ErrorMessage";
import { useMe } from "@/features/auth/hooks/useMe";
import { ROLE_DOMAIN_MAP } from "./../../constants/enums";
import { generatePlanSchema } from "./../../constants/validations";
import { generateIdempotencyKey } from "@/lib/utils";
import GeneratePlanForm from "./GeneratePlanForm";
import GeneratingOverlay from "./GeneratingOverlay";
import { useGeneratePlan } from "./../../hooks/useGeneratePlan";

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
  const idempotencyKey = useRef<string | null>(null);

  const { data: meRes } = useMe();
  const user = meRes?.data;
  const primaryRole = user?.roles?.[0] ?? "";
  const domainId = ROLE_DOMAIN_MAP[primaryRole];

  const generatePlan = useGeneratePlan((data) => {
    idempotencyKey.current = null;
    navigate(`/ai/review/${data.recommendationId}`, {
      state: {
        missingExerciseNotes: data.missingExerciseNotes,
        planId: data.trainingPlanId ?? data.nutritionPlanId ?? null,
      },
    });
  });

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
    const key = generateIdempotencyKey();
    idempotencyKey.current = key;

    generatePlan.mutate({
      payload: {
        athleteId,
        domainId: domainId!,
        query,
      },
      idempotencyKey: key,
    });
  }, [athleteId, query, domainId, generatePlan, t]);

  return (
    <>
      {generatePlan.isPending && <GeneratingOverlay />}

      {generatePlan.isError && !generatePlan.isPending && (
        <div className="mb-6">
          <ErrorMessage
            onRetry={() => {
              idempotencyKey.current = null;
              generatePlan.reset();
            }}
          />
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
          isGenerating={generatePlan.isPending}
        />
      </Box>
    </>
  );
}
