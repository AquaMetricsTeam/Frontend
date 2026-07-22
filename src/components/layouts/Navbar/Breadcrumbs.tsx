import { useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MdChevronRight, MdChevronLeft, MdHome } from "react-icons/md";
import { LANG_DIR } from "@/constants/i18nConfig";
import { cn } from "@/lib/utils";

const ROUTE_NAME_MAP: Record<string, string> = {
  "": "common:nav.items.dashboard",
  athletes: "common:nav.items.athletes",
  users: "common:nav.items.usersStaff",
  swimming: "common:nav.items.swimming",
  fitness: "common:nav.items.fitness",
  "training-plans": "common:nav.items.trainingPlans",
  nutrition: "common:nav.items.nutrition",
  attendance: "common:nav.items.attendance",
  "coach-notes": "common:nav.items.coachNotes",
  "ai-recommendations": "common:nav.items.aiRecommendations",
  "knowledge-base": "common:nav.items.knowledgeBase",
  notifications: "common:nav.items.notifications",
  reports: "common:nav.items.reports",
  settings: "common:nav.items.settings",
};

export function Breadcrumbs({ className }: { className?: string }) {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const isRtl = LANG_DIR[i18n.language as Locale] === "rtl";

  const pathSegments = location.pathname.split("/").filter(Boolean);

  const ChevronIcon = isRtl ? MdChevronLeft : MdChevronRight;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground", className)}
    >
      <Link
        to="/"
        className="flex items-center gap-1 hover:text-foreground transition-colors"
      >
        <MdHome className="size-3.5 text-primary" />
        <span className="font-medium">{t("common:nav.items.dashboard")}</span>
      </Link>

      {pathSegments.map((segment, index) => {
        const url = `/${pathSegments.slice(0, index + 1).join("/")}`;
        const isLast = index === pathSegments.length - 1;
        const translationKey = ROUTE_NAME_MAP[segment];
        const label = translationKey ? t(translationKey as TranslationKey) : segment;

        return (
          <div key={url} className="flex items-center gap-1.5">
            <ChevronIcon className="size-3.5 text-muted-foreground/60 shrink-0" />
            {isLast ? (
              <span className="font-semibold text-foreground truncate max-w-[160px]">
                {label}
              </span>
            ) : (
              <Link
                to={url}
                className="hover:text-foreground transition-colors truncate max-w-[120px]"
              >
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
