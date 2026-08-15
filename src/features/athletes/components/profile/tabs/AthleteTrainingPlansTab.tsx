import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  MdAssignment,
  MdPool,
  MdFitnessCenter,
  MdTimer,
  MdPerson,
  MdRefresh,
  MdVisibility,
} from "react-icons/md";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchInput } from "@/components/common/SearchInput";
import { TemplateDetailSheet } from "@/features/training-plans/components/templates/TemplateDetailSheet";
import type { TrainingPlan } from "@/features/training-plans/types/index";
import { useAthleteTrainingPlans } from "../../../hooks/useAthleteTrainingPlans";
import type { AthleteOverviewTrainingPlanResponse } from "../../../types/index";

interface AthleteTrainingPlansTabProps {
  athleteId: string;
}

export function AthleteTrainingPlansTab({
  athleteId,
}: AthleteTrainingPlansTabProps) {
  const { t } = useTranslation("athletes");
  const [search, setSearch] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<TrainingPlan | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const { data: response, isLoading, isError, refetch } =
    useAthleteTrainingPlans(athleteId);

  const plans = response?.data || [];

  const filteredPlans = plans.filter((p) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      String(p.title || "").toLowerCase().includes(q) ||
      String(p.description || "").toLowerCase().includes(q) ||
      String(p.domainName || "").toLowerCase().includes(q) ||
      String(p.planSource || "").toLowerCase().includes(q)
    );
  });

  function handleOpenPlan(plan: AthleteOverviewTrainingPlanResponse) {
    setSelectedPlan({
      id: plan.id,
      title: plan.title,
      description: plan.description || "",
      domainId: plan.domainId || 1,
      domainName: plan.domainName || "Swimming",
      planSource: plan.planSource || "Coach",
      approvalStatus: String(plan.approvalStatus || ""),
      estimatedDurationMinutes: plan.estimatedDurationMinutes || 0,
      planExercises: [],
    } as unknown as TrainingPlan);
    setIsDetailOpen(true);
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-9 w-48 rounded-xl" />
          <Skeleton className="h-9 w-72 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-xs">
        <p className="text-sm font-medium text-destructive">
          {t("profile.error.title")}
        </p>
        <Button
          size="sm"
          variant="outline"
          onClick={() => refetch()}
          className="mt-4 rounded-xl gap-1.5 text-xs font-semibold cursor-pointer"
        >
          <MdRefresh className="size-4" />
          <span>{t("profile.error.retry")}</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Controls / Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <MdAssignment className="size-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              {t("profile.plans.title")}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t("profile.plans.subtitle", { count: plans.length })}
            </p>
          </div>
        </div>

        <div className="w-full sm:w-72">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder={t("profile.plans.searchPlaceholder")}
          />
        </div>
      </div>

      {/* Plans Grid */}
      {filteredPlans.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center shadow-xs">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MdAssignment className="size-6" />
          </div>
          <h4 className="mt-3 text-sm font-semibold text-foreground">
            {t("profile.plans.noPlansFound")}
          </h4>
          <p className="mt-1 text-xs text-muted-foreground">
            {search
              ? t("profile.plans.tryDifferentSearch")
              : t("profile.plans.noPlansAssigned")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPlans.map((plan) => {
            const domainStr = String(plan.domainName || "").toLowerCase();
            const isSwimming =
              domainStr === "swimming" ||
              plan.domainId === 1;

            const rawStatus =
              plan.approvalStatus !== null &&
              plan.approvalStatus !== undefined &&
              String(plan.approvalStatus).trim() !== ""
                ? String(plan.approvalStatus).trim()
                : null;

            return (
              <div
                key={plan.id}
                onClick={() => handleOpenPlan(plan)}
                className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-xs hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group select-none"
              >
                <div>
                  {/* Header: Domain Badge + Approval Status (only if exists) */}
                  <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3">
                    <Badge
                      variant="secondary"
                      className={`text-xs gap-1 font-semibold ${
                        isSwimming
                          ? "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/20"
                          : "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20"
                      }`}
                    >
                      {isSwimming ? (
                        <MdPool className="size-3.5" />
                      ) : (
                        <MdFitnessCenter className="size-3.5" />
                      )}
                      <span>{plan.domainName || "Training"}</span>
                    </Badge>

                    {rawStatus && (
                      <Badge
                        variant="outline"
                        className="text-[11px] font-semibold border-primary/30 bg-primary/10 text-primary"
                      >
                        {rawStatus}
                      </Badge>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div className="mt-3.5 space-y-1.5">
                    <h4 className="text-base font-bold text-foreground group-hover:text-primary transition-colors flex items-center justify-between gap-2">
                      <span className="truncate">{plan.title}</span>
                      <MdVisibility className="size-4 text-muted-foreground group-hover:text-primary shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h4>
                    {plan.description && (
                      <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                        {plan.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer Chips */}
                <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
                  {/* Estimated Duration */}
                  {plan.estimatedDurationMinutes ? (
                    <div className="flex items-center gap-1.5">
                      <MdTimer className="size-4 text-primary shrink-0" />
                      <span className="font-semibold text-foreground">
                        {plan.estimatedDurationMinutes} {t("profile.plans.minutes")}
                      </span>
                    </div>
                  ) : (
                    <span />
                  )}

                  {/* Source */}
                  {plan.planSource && (
                    <div className="flex items-center gap-1 text-[11px]">
                      <MdPerson className="size-3.5 text-muted-foreground" />
                      <span>{plan.planSource}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Plan Details Sheet */}
      <TemplateDetailSheet
        plan={selectedPlan}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
    </div>
  );
}
