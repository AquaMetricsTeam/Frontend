import PageWrapper from "@/components/layouts/PageWrapper";
import { AssignedPlansView } from "@/features/training-plans/components/assignments/AssignedPlansView";
import { TrainingHeader } from "@/features/training-plans/components/common/TrainingHeader";

export default function TrainingAssignmentsPage() {
  return (
    <PageWrapper>
      <TrainingHeader activeTab="assignments" />
      <AssignedPlansView />
    </PageWrapper>
  );
}
