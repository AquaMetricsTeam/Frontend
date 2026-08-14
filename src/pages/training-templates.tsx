import PageWrapper from "@/components/layouts/PageWrapper";
import { TemplateListView } from "@/features/training-plans/components/templates/TemplateListView";
import { TrainingHeader } from "@/features/training-plans/components/common/TrainingHeader";

export default function TrainingTemplatesPage() {
  return (
    <PageWrapper>
      <TrainingHeader activeTab="templates" />
      <TemplateListView />
    </PageWrapper>
  );
}
