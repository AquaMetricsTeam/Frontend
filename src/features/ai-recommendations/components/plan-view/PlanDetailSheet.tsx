import { useTranslation } from "react-i18next";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  MdWorkspacePremium,
  MdCalendarToday,
  MdFlag,
  MdNotes,
} from "react-icons/md";
import type { AthleteCurrentPlanDto } from "../../types/index";
import PlanStatusBadge from "./PlanStatusBadge";
import PlanSourceBadge from "./PlanSourceBadge";
import { DomainBadge } from "./CurrentPlanCard";
import PlanNutritionMetrics from "./PlanNutritionMetrics";
import PlanLineageNote from "./PlanLineageNote";

interface PlanDetailSheetProps {
  plan: AthleteCurrentPlanDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PlanDetailSheet({
  plan,
  open,
  onOpenChange,
}: PlanDetailSheetProps) {
  const { t } = useTranslation("aiPlanView");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-lg">
        {/* Header */}
        <SheetHeader className="border-b border-border px-6 pt-6 pb-4 pe-10">
          <div className="flex min-w-0 items-center gap-2">
            <MdWorkspacePremium className="size-5 shrink-0 text-primary" />
            <SheetTitle className="truncate text-base font-bold text-foreground">
              {plan?.title}
            </SheetTitle>
          </div>
          {plan && (
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <DomainBadge domainId={plan.domainId} />
              <PlanSourceBadge isAiGenerated={plan.isAiGenerated} />
              <PlanStatusBadge status={plan.approvalStatus} />
            </div>
          )}
          <SheetDescription className="mt-1 text-xs text-muted-foreground">
            {t("card.title")}
          </SheetDescription>
        </SheetHeader>

        {/* Body */}
        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          {!plan ? (
            <div className="py-10 text-center text-xs text-muted-foreground">
              {t("card.noPlan")}
            </div>
          ) : (
            <>
              {plan.objectives && (
                <div className="space-y-2 rounded-xl border border-border bg-card p-4 shadow-xs">
                  <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <MdFlag className="size-4 text-primary" />
                    {t("card.objectives")}
                  </h4>
                  <p className="text-xs leading-relaxed text-foreground">
                    {plan.objectives}
                  </p>
                </div>
              )}

              {plan.description && (
                <div className="space-y-2 rounded-xl border border-border bg-card p-4 shadow-xs">
                  <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <MdNotes className="size-4 text-primary" />
                    {t("card.description")}
                  </h4>
                  <p className="text-xs leading-relaxed text-foreground">
                    {plan.description}
                  </p>
                </div>
              )}

              <PlanNutritionMetrics plan={plan} />

              {(plan.startDate || plan.endDate) && (
                <div className="space-y-3 rounded-xl border border-border bg-card p-4 shadow-xs">
                  <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <MdCalendarToday className="size-4 text-primary" />
                    {t("card.period")}
                  </h4>
                  <div className="flex flex-col gap-2.5">
                    {plan.startDate && (
                      <div className="flex items-center gap-2 text-xs">
                        <span className="w-24 shrink-0 font-semibold text-foreground">
                          {t("card.startDate")}
                        </span>
                        <span className="text-muted-foreground">
                          {plan.startDate}
                        </span>
                      </div>
                    )}
                    {plan.endDate && (
                      <div className="flex items-center gap-2 text-xs">
                        <span className="w-24 shrink-0 font-semibold text-foreground">
                          {t("card.endDate")}
                        </span>
                        <span className="text-muted-foreground">
                          {plan.endDate}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <PlanLineageNote
                overrideOfAssignmentId={plan.overrideOfAssignmentId}
              />
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}