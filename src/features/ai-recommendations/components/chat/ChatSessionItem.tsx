import { useTranslation } from "react-i18next";
import { MdPerson } from "react-icons/md";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ChatSessionResponse } from "../../types/index";

interface ChatSessionItemProps {
  session: ChatSessionResponse;
  isSelected: boolean;
  onClick: () => void;
}

export default function ChatSessionItem({
  session,
  isSelected,
  onClick,
}: ChatSessionItemProps) {
  const { t, i18n } = useTranslation("aiChat");

  const displayName =
    session.title ?? session.athleteName ?? t("sidebar.generalChat");

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative w-full cursor-pointer p-3.5 text-start transition-colors border-b border-border last:border-b-0",
        isSelected
          ? "bg-muted/80 border-s-2 border-s-primary"
          : "border-s-2 border-s-transparent hover:bg-muted/40",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">
            {displayName}
          </p>

          <div className="mt-1 flex items-center gap-1.5">
            {session.athleteId && (
              <Badge variant="secondary" className="gap-1 text-[10px] px-1.5 py-0">
                <MdPerson className="size-2.5" />
                {t("sidebar.personalized")}
              </Badge>
            )}
            {!session.athleteId && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                {t("sidebar.general")}
              </Badge>
            )}
          </div>
        </div>

        <div className="shrink-0 text-end">
          {session.messageCount > 0 && (
            <span className="text-[10px] text-muted-foreground">
              {session.messageCount}
            </span>
          )}
          {session.updatedAt && (
            <p className="mt-0.5 text-[10px] text-muted-foreground/70">
              {new Date(session.updatedAt).toLocaleDateString(i18n.language)}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}
