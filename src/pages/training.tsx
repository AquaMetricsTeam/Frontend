import { useSearchParams } from "react-router-dom";
import { MdPool, MdAssignment, MdEventNote } from "react-icons/md";
import PageWrapper from "@/components/layouts/PageWrapper";
import { SegmentedControl } from "@/components/common/SegmentedControl";
import { TemplateListView } from "@/features/training-plans/components/templates/TemplateListView";
import { AssignedPlansView } from "@/features/training-plans/components/assignments/AssignedPlansView";
import { SessionsView } from "@/features/training-plans/components/sessions/SessionsView";

type TrainingView = "templates" | "assignments" | "sessions";

const VIEW_OPTIONS: {
  value: TrainingView;
  label: string;
  icon: React.ElementType;
}[] = [
  { value: "templates", label: "Templates", icon: MdPool },
  { value: "assignments", label: "Assigned Plans", icon: MdAssignment },
  { value: "sessions", label: "Sessions", icon: MdEventNote },
];

export default function TrainingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const view = (searchParams.get("view") as TrainingView) ?? "templates";

  function setView(next: TrainingView) {
    setSearchParams({ view: next });
  }

  return (
    <PageWrapper>
      {/* Page Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Swimming Training
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage training plans, assignments, and daily sessions
          </p>
        </div>

        <SegmentedControl
          options={VIEW_OPTIONS}
          value={view}
          onChange={setView}
          className="self-start flex-wrap  sm:self-auto"
        />
      </div>

      {/* View Content */}
      {view === "templates" && <TemplateListView />}
      {view === "assignments" && <AssignedPlansView />}
      {view === "sessions" && <SessionsView />}
    </PageWrapper>
  );
}
