import { useParams, useLocation, Navigate } from "react-router-dom";
import PageWrapper from "@/components/layouts/PageWrapper";
import Box from "@/components/layouts/Box";
import PlanReviewView from "@/features/ai-recommendations/components/plan-generation/PlanReviewView";

interface ReviewLocationState {
  missingExerciseNotes?: string | null;
  planId?: number | null;
}

export default function AiReviewRecommendationPage() {
  const { recommendationId } = useParams<{ recommendationId: string }>();
  const location = useLocation();
  const state = (location.state ?? {}) as ReviewLocationState;
  const id = Number(recommendationId);

  if (Number.isNaN(id)) {
    return <Navigate to="/ai-recommendations" replace />;
  }

  return (
    <PageWrapper>
      <Box>
        <PlanReviewView
          recommendationId={id}
          missingExerciseNotes={state.missingExerciseNotes ?? null}
          routePlanId={state.planId ?? null}
        />
      </Box>
    </PageWrapper>
  );
}
