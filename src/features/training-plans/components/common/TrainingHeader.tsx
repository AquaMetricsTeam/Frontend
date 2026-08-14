import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MdPool, MdAssignment, MdEventNote } from "react-icons/md";
import { SegmentedControl } from "@/components/common/SegmentedControl";

export type TrainingViewTab = "templates" | "assignments" | "sessions";

interface TrainingHeaderProps {
  activeTab: TrainingViewTab;
}

const TAB_ROUTES: Record<TrainingViewTab, string> = {
  templates: "/training-templates",
  assignments: "/training-assignments",
  sessions: "/training-sessions",
};

export function TrainingHeader({ activeTab }: TrainingHeaderProps) {
  const { t } = useTranslation("training");
  const navigate = useNavigate();

  const VIEW_OPTIONS: {
    value: TrainingViewTab;
    label: string;
    icon: React.ElementType;
  }[] = [
    { value: "templates", label: t("views.templates"), icon: MdPool },
    { value: "assignments", label: t("views.assignments"), icon: MdAssignment },
    { value: "sessions", label: t("views.sessions"), icon: MdEventNote },
  ];

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1
          className="text-2xl font-bold tracking-tight text-foreground"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {t("page.title")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("page.description")}
        </p>
      </div>

      <SegmentedControl
        options={VIEW_OPTIONS}
        value={activeTab}
        onChange={(tab) => navigate(TAB_ROUTES[tab])}
        className="self-start flex-wrap sm:self-auto"
      />
    </div>
  );
}
