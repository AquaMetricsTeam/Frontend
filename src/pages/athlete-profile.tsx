import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MdArrowBack, MdRefresh } from "react-icons/md";
import PageWrapper from "@/components/layouts/PageWrapper";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMe } from "@/features/auth/hooks/useMe";
import { useAthleteOverview } from "@/features/athletes/hooks/useAthleteOverview";
import { useAthletePerformance } from "@/features/athletes/hooks/useAthletePerformance";
import { AthleteHeroHeader } from "@/features/athletes/components/profile/AthleteHeroHeader";
import {
  AthleteProfileTabs,
  type AthleteProfileTabKey,
} from "@/features/athletes/components/profile/AthleteProfileTabs";
import { AthleteOverviewTab } from "@/features/athletes/components/profile/tabs/AthleteOverviewTab";
import { AthleteSwimmingSessionsTab } from "@/features/athletes/components/profile/tabs/AthleteSwimmingSessionsTab";
import { AthleteFitnessSessionsTab } from "@/features/athletes/components/profile/tabs/AthleteFitnessSessionsTab";
import { AthleteTrainingPlansTab } from "@/features/athletes/components/profile/tabs/AthleteTrainingPlansTab";
import { AthleteMedicalTab } from "@/features/athletes/components/profile/tabs/AthleteMedicalTab";
import { AthleteCoachesGroupsTab } from "@/features/athletes/components/profile/tabs/AthleteCoachesGroupsTab";
import { AssignCoachModal } from "@/features/athletes/components/AssignCoachModal";
import { AthleteNotesSheet } from "@/features/coach-notes/components/AthleteNotesSheet";
import { useCurrentTrainingPlan } from "@/features/ai-recommendations/hooks/useCurrentTrainingPlan";
import { useCurrentNutritionPlan } from "@/features/ai-recommendations/hooks/useCurrentNutritionPlan";
import CurrentPlanCard from "@/features/ai-recommendations/components/plan-view/CurrentPlanCard";
import type { AdminAthlete } from "@/features/athletes/types/index";

export default function AthleteProfilePage() {
  const { athleteId } = useParams<{ athleteId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation("athletes");

  const { data: meRes } = useMe();
  const currentUserId = meRes?.data?.userId;
  const userRoles = meRes?.data?.roles || [];
  const isAdmin = userRoles.includes("Admin");

  const [activeTab, setActiveTab] = useState<AthleteProfileTabKey>("overview");
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);

  // Queries
  const {
    data: overviewRes,
    isLoading: isOverviewLoading,
    isError: isOverviewError,
    refetch: refetchOverview,
  } = useAthleteOverview(athleteId || "");

  const { data: performanceRes } = useAthletePerformance(athleteId || "");

  const isNutrition = userRoles.includes("NutritionSpecialist");
  const trainingPlanQuery = useCurrentTrainingPlan(
    athleteId || "",
    !isAdmin && !isNutrition,
  );
  const nutritionPlanQuery = useCurrentNutritionPlan(
    athleteId || "",
    !isAdmin && isNutrition,
  );
  const planQuery = isNutrition ? nutritionPlanQuery : trainingPlanQuery;

  const athlete = overviewRes?.data;
  const performanceData = performanceRes?.data;

  // Adapt for assign modal if needed
  const assignModalAthlete: AdminAthlete | null = athlete
    ? {
        id: athlete.id,
        athleteId: athlete.id,
        fullName: athlete.fullName,
        email: athlete.email,
        profilePictureUrl: athlete.profilePictureUrl ?? null,
        role: "Athlete",
        isActive:
          String(athlete.registrationStatus).toLowerCase() === "active" ||
          String(athlete.registrationStatus) === "1",
        createdAt: athlete.dateOfBirth,
        assignedCoaches: (athlete.coaches || []).map((c, idx) => ({
          assignmentId: idx + 1,
          coachId: c.coachId,
          coachName: c.coachName,
          role: c.domainName,
        })),
      }
    : null;

  // Loading Skeleton State
  if (isOverviewLoading) {
    return (
      <PageWrapper>
        <div className="space-y-6">
          {/* Hero Header Skeleton */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 md:p-8 space-y-6 shadow-xs">
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-32 rounded-lg" />
              <Skeleton className="h-9 w-28 rounded-xl" />
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Skeleton className="size-24 rounded-2xl shrink-0" />
              <div className="space-y-3 w-full max-w-md">
                <Skeleton className="h-8 w-64 rounded-lg" />
                <Skeleton className="h-4 w-44 rounded-md" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20 rounded-lg" />
                  <Skeleton className="h-6 w-24 rounded-lg" />
                </div>
              </div>
            </div>
          </div>

          {/* Tabs bar skeleton */}
          <Skeleton className="h-12 w-full rounded-2xl" />

          {/* Content skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Skeleton className="h-28 rounded-2xl" />
            <Skeleton className="h-28 rounded-2xl" />
            <Skeleton className="h-28 rounded-2xl" />
            <Skeleton className="h-28 rounded-2xl" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-64 rounded-2xl" />
          </div>
        </div>
      </PageWrapper>
    );
  }

  // Error State
  if (isOverviewError || !athlete) {
    return (
      <PageWrapper>
        <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-3xl border border-border bg-card p-8 text-center shadow-xs">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive text-xl font-bold">
            !
          </div>
          <h2 className="mt-4 text-lg font-bold text-foreground">
            {t("profile.error.title")}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground max-w-sm">
            {t("profile.error.description")}
          </p>
          <div className="mt-6 flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/athletes")}
              className="rounded-xl gap-2 text-xs font-semibold cursor-pointer"
            >
              <MdArrowBack className="size-4 rtl:rotate-180" />
              <span>{t("profile.backToAthletes")}</span>
            </Button>
            <Button
              size="sm"
              onClick={() => refetchOverview()}
              className="rounded-xl gap-2 text-xs font-semibold cursor-pointer"
            >
              <MdRefresh className="size-4" />
              <span>{t("profile.error.retry")}</span>
            </Button>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="space-y-6 pb-12">
        {/* Hero Identity Header */}
        <AthleteHeroHeader
          athlete={athlete}
          performanceData={performanceData}
          isAdmin={isAdmin}
          onOpenAssignModal={() => setIsAssignModalOpen(true)}
          onOpenNotes={!isAdmin ? () => setIsNotesOpen(true) : undefined}
        />

        {/* Tab Switcher */}
        <AthleteProfileTabs
          activeTab={activeTab}
          onChangeTab={setActiveTab}
        />

        {/* Tab Contents */}
        {activeTab === "overview" && (
          <AthleteOverviewTab athlete={athlete} />
        )}

        {activeTab === "swimming" && (
          <AthleteSwimmingSessionsTab athleteId={athlete.id} />
        )}

        {activeTab === "fitness" && (
          <AthleteFitnessSessionsTab athleteId={athlete.id} />
        )}

        {activeTab === "plans" && (
          <div className="space-y-6">
            {!isAdmin && <CurrentPlanCard query={planQuery} />}
            <AthleteTrainingPlansTab athleteId={athlete.id} />
          </div>
        )}

        {activeTab === "medical" && <AthleteMedicalTab athlete={athlete} />}

        {activeTab === "coaches" && (
          <AthleteCoachesGroupsTab
            athlete={athlete}
            isAdmin={isAdmin}
            onOpenAssignModal={() => setIsAssignModalOpen(true)}
          />
        )}
      </div>

      {/* Admin Assign Coach Modal */}
      {isAdmin && assignModalAthlete && (
        <AssignCoachModal
          athlete={assignModalAthlete}
          open={isAssignModalOpen}
          onOpenChange={setIsAssignModalOpen}
        />
      )}

      {/* Athlete Notes Sheet (Coaches only) */}
      {!isAdmin && (
        <AthleteNotesSheet
          athlete={{
            id: athlete.id,
            fullName: athlete.fullName,
            email: athlete.email,
          }}
          open={isNotesOpen}
          onOpenChange={setIsNotesOpen}
          currentUserId={currentUserId}
        />
      )}
    </PageWrapper>
  );
}
