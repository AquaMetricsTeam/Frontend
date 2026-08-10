import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MdPool } from "react-icons/md";
import PageWrapper from "@/components/layouts/PageWrapper";
import WithPagination from "@/components/HOCs/WithPagination";
import { Badge } from "@/components/ui/badge";
import Box from "@/components/layouts/Box";
import { useMe } from "@/features/auth/hooks/useMe";

import { useSwimmingPerformances } from "@/features/swimming-performance/hooks/useSwimmingPerformances";
import { useSwimmingPerformanceFilters } from "@/features/swimming-performance/hooks/useSwimmingPerformanceFilters";
import { SwimmingPerformanceFiltersBar } from "@/features/swimming-performance/components/SwimmingPerformanceFiltersBar";
import { SwimmingPerformanceTable } from "@/features/swimming-performance/components/SwimmingPerformanceTable";
import { LogSwimmingPerformanceDrawer } from "@/features/swimming-performance/components/LogSwimmingPerformanceDrawer";
import { EditTrainingRecordModal } from "@/features/swimming-performance/components/EditTrainingRecordModal";
import { SwimmingPerformanceDetailSheet } from "@/features/swimming-performance/components/SwimmingPerformanceDetailSheet";
import type { TrainingRecordResponse } from "@/features/training-record/types";

export default function SwimmingPage() {
  const { t } = useTranslation("swimming");

  const { data: meRes } = useMe();
  const userRoles = meRes?.data?.roles || [];
  const canManage = userRoles.includes("SwimmingCoach");

  // Filters State
  const {
    page,
    localSearch,
    setLocalSearch,
    debouncedSearch,
    athleteId,
    setAthleteFilter,
    trainingSessionId,
    sessionCompleted,
    setSessionCompletedFilter,
    injuryOccurred,
    setInjuryFilter,
    descending,
    setSortDescending,
  } = useSwimmingPerformanceFilters();

  // Query API - GET /Swimming-Performance/trainingRecord
  const { data, isLoading, isError, refetch } = useSwimmingPerformances({
    pageIndex: page,
    pageSize: 15,
    search: debouncedSearch,
    athleteId,
    trainingSessionId,
    sessionCompleted,
    injuryOccurred,
    descending,
  });

  const performancesResponse = data?.data;
  const records = performancesResponse?.items ?? [];
  const totalCount = performancesResponse?.totalCount ?? records.length;
  const totalPages = performancesResponse?.totalPages ?? 1;

  // Drawers & Modals State
  const [isLogDrawerOpen, setIsLogDrawerOpen] = useState(false);
  const [selectedForDetail, setSelectedForDetail] =
    useState<TrainingRecordResponse | null>(null);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
  const [selectedForEdit, setSelectedForEdit] =
    useState<TrainingRecordResponse | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  function handleViewDetails(item: TrainingRecordResponse) {
    setSelectedForDetail(item);
    setIsDetailSheetOpen(true);
  }

  function handleEdit(item: TrainingRecordResponse) {
    setSelectedForEdit(item);
    setIsEditModalOpen(true);
  }

  return (
    <PageWrapper>
      {/* Page Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <MdPool className="size-5" />
            </div>
            <h1
              className="text-2xl font-bold tracking-tight text-foreground"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {t("page.title")}
            </h1>
            <Badge
              variant="secondary"
              className="rounded-full px-2.5 py-0.5 text-xs font-semibold text-primary bg-primary/10 border-primary/20"
            >
              {t(
                totalCount === 1 ? "page.drillCount" : "page.drillCount_plural",
                { count: totalCount },
              )}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground ms-12">
            {t("page.description")}
          </p>
        </div>
      </div>

      {/* Main Table Box */}
      <Box>
        <SwimmingPerformanceFiltersBar
          localSearch={localSearch}
          onSearchChange={setLocalSearch}
          athleteId={athleteId}
          onAthleteChange={setAthleteFilter}
          sessionCompleted={sessionCompleted}
          onSessionCompletedChange={setSessionCompletedFilter}
          injuryOccurred={injuryOccurred}
          onInjuryChange={setInjuryFilter}
          descending={descending}
          onSortChange={setSortDescending}
          onLogClick={() => setIsLogDrawerOpen(true)}
          canManage={canManage}
        />

        <WithPagination pageCount={totalPages}>
          <SwimmingPerformanceTable
            records={records}
            isLoading={isLoading}
            isError={isError}
            onRetry={refetch}
            onViewDetails={handleViewDetails}
            onEdit={handleEdit}
            canManage={canManage}
          />
        </WithPagination>
      </Box>

      {/* Drawers & Modals */}
      <LogSwimmingPerformanceDrawer
        open={isLogDrawerOpen}
        onOpenChange={setIsLogDrawerOpen}
      />

      <SwimmingPerformanceDetailSheet
        record={selectedForDetail}
        open={isDetailSheetOpen}
        onOpenChange={setIsDetailSheetOpen}
        canManage={canManage}
      />

      <EditTrainingRecordModal
        record={selectedForEdit}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
      />
    </PageWrapper>
  );
}
