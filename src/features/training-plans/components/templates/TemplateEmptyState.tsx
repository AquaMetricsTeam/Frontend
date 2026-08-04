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
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="size-12 rounded-2xl bg-muted flex items-center justify-center mb-3">
        <MdPool className="size-6 text-muted-foreground" />
      </div>
      <h3 className="text-sm font-semibold text-foreground">
        {isArchived ? "No archived templates" : "No training templates yet"}
      </h3>
      <p className="text-xs text-muted-foreground mt-1 max-w-sm">
        {isArchived
          ? "Archived training plans will appear here."
          : "Get started by creating your first training plan template."}
      </p>
      {!isArchived && (
        <Button size="sm" onClick={onCreateClick} className="mt-4">
          Create Training Plan
        </Button>
      )}
    </div>
  );
}
