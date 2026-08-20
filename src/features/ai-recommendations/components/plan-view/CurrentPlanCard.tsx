import { useState } from "react";
import { useTranslation } from "react-i18next";
import WithLoadingAndError from "@/components/HOCs/WithLoadingAndError";
import type { UseQueryResult } from "@tanstack/react-query";
import {
  MdWorkspacePremium,
  MdPool,
  MdFitnessCenter,
  MdRestaurant,
  MdLocalFireDepartment,
  MdEggAlt,
  MdRiceBowl,
  MdOilBarrel,
  MdChevronRight,
} from "react-icons/md";
import type { ComponentType } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AthleteCurrentPlanDto } from "../../types/index";
import PlanStatusBadge from "./PlanStatusBadge";
import PlanSourceBadge from "./PlanSourceBadge";
import PlanDetailSheet from "./PlanDetailSheet";

interface CurrentPlanCardProps {
  query: UseQueryResult<ApiResponse<AthleteCurrentPlanDto | null>, Error>;
}

export default function CurrentPlanCard({ query }: CurrentPlanCardProps) {
  const { t } = useTranslation("aiPlanView");
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const plan = query.data?.data;

  return (
    <>
      <WithLoadingAndError
        isLoading={query.isLoading}
        isError={query.isError}
        hasNoData={!query.isLoading && !query.isError && plan == null}
        noDataMessageProps={{
          messageKey: "aiPlanView:card.noPlan",
          descriptionKey: "aiPlanView:card.noPlanDescription",
        }}
      >
        {plan && (
          <div
            role="button"
            tabIndex={0}
            aria-haspopup="dialog"
            aria-expanded={isDetailOpen}
            aria-label={`${t("card.title")} — ${plan.title}`}
            onClick={() => setIsDetailOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setIsDetailOpen(true);
              }
            }}
            className="group flex w-full cursor-pointer select-none flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-xs transition-all hover:border-primary/50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 lg:flex-row lg:items-center lg:justify-between"
          >
            {/* Title + Badges */}
            <div className="flex min-w-0 flex-wrap items-center gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <MdWorkspacePremium className="size-5" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <h3 className="text-sm font-bold text-foreground transition-colors group-hover:text-primary">
                    {t("card.title")}
                  </h3>
                  <DomainBadge domainId={plan.domainId} />
                  <PlanSourceBadge isAiGenerated={plan.isAiGenerated} />
                  <PlanStatusBadge status={plan.approvalStatus} />
                </div>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {plan.title}
                </p>
              </div>
            </div>

            {/* Key metrics + details affordance */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 lg:justify-end">
              {plan.domainId === 3 && (
                <div className="flex flex-wrap items-center gap-2">
                  <MetricPill
                    icon={MdLocalFireDepartment}
                    accent="text-amber-500"
                    value={t("nutrition.calories", {
                      value: plan.dailyCalories ?? "—",
                    })}
                  />
                  <MetricPill
                    icon={MdEggAlt}
                    accent="text-emerald-500"
                    value={t("nutrition.grams", {
                      value: plan.proteinGrams ?? "—",
                    })}
                  />
                  <MetricPill
                    icon={MdRiceBowl}
                    accent="text-cyan-500"
                    value={t("nutrition.grams", {
                      value: plan.carbGrams ?? "—",
                    })}
                  />
                  <MetricPill
                    icon={MdOilBarrel}
                    accent="text-orange-500"
                    value={t("nutrition.grams", {
                      value: plan.fatGrams ?? "—",
                    })}
                  />
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                className="gap-1 rounded-xl text-xs font-semibold"
              >
                {t("card.viewDetails")}
                <MdChevronRight className="size-4 rtl:rotate-180" />
              </Button>
            </div>
          </div>
        )}
      </WithLoadingAndError>

      <PlanDetailSheet
        plan={plan ?? null}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
    </>
  );
}

function MetricPill({
  icon: Icon,
  accent,
  value,
}: {
  icon: ComponentType<{ className?: string }>;
  accent: string;
  value: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground">
      <Icon className={`size-4 shrink-0 ${accent}`} />
      <span className="font-semibold text-foreground">{value}</span>
    </span>
  );
}

export function DomainBadge({ domainId }: { domainId: number }) {
  const { t } = useTranslation("aiPlanView");

  if (domainId === 3) {
    return (
      <Badge
        variant="secondary"
        className="gap-1 bg-emerald-500/10 text-xs font-semibold text-emerald-700 border-emerald-500/20 dark:text-emerald-400"
      >
        <MdRestaurant className="size-3.5" />
        {t("domain.nutrition")}
      </Badge>
    );
  }

  if (domainId === 1) {
    return (
      <Badge
        variant="secondary"
        className="gap-1 bg-cyan-500/10 text-xs font-semibold text-cyan-700 border-cyan-500/20 dark:text-cyan-400"
      >
        <MdPool className="size-3.5" />
        {t("domain.swimming")}
      </Badge>
    );
  }

  return (
    <Badge
      variant="secondary"
      className="gap-1 bg-blue-500/10 text-xs font-semibold text-blue-700 border-blue-500/20 dark:text-blue-400"
    >
      <MdFitnessCenter className="size-3.5" />
      {t("domain.training")}
    </Badge>
  );
}