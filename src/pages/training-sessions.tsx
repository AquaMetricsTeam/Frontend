import PageWrapper from "@/components/layouts/PageWrapper";
import { SessionsView } from "@/features/training-plans/components/sessions/SessionsView";
import { TrainingHeader } from "@/features/training-plans/components/common/TrainingHeader";

export default function TrainingSessionsPage() {
  return (
    <PageWrapper>
      <TrainingHeader activeTab="sessions" />
      <SessionsView />
    </PageWrapper>
  );
}
