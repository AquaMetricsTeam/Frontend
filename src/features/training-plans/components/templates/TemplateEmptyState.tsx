import { useTranslation } from "react-i18next";
import { MdPool } from "react-icons/md";
import { Button } from "@/components/ui/button";

interface TemplateEmptyStateProps {
  isArchived: boolean;
  onCreateClick: () => void;
}

export function TemplateEmptyState({
  isArchived,
  onCreateClick,
}: TemplateEmptyStateProps) {
  const { t } = useTranslation("training");

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="size-12 rounded-2xl bg-muted flex items-center justify-center mb-3">
        <MdPool className="size-6 text-muted-foreground" />
      </div>
      <h3 className="text-sm font-semibold text-foreground">
        {isArchived
          ? t("templates.emptyArchived.title", {
              defaultValue: "No archived training plans",
            })
          : t("templates.emptyActive.title", {
              defaultValue: "No training plans yet",
            })}
      </h3>
      <p className="text-xs text-muted-foreground mt-1 max-w-sm">
        {isArchived
          ? t("templates.emptyArchived.description", {
              defaultValue: "Archived training plans will appear here.",
            })
          : t("templates.emptyActive.description", {
              defaultValue:
                "Get started by creating your first training plan template.",
            })}
      </p>
      {!isArchived && (
        <Button size="sm" onClick={onCreateClick} className="mt-4 cursor-pointer">
          {t("templates.actions.new", { defaultValue: "Create Training Plan" })}
        </Button>
      )}
    </div>
  );
}
