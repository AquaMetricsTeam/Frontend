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
import { EditSwimmingPerformanceModal } from "@/features/swimming-performance/components/EditSwimmingPerformanceModal";
import { SwimmingPerformanceDetailSheet } from "@/features/swimming-performance/components/SwimmingPerformanceDetailSheet";
import { ArchiveSwimmingPerformanceDialog } from "@/features/swimming-performance/components/ArchiveSwimmingPerformanceDialog";
import type { SwimmingPerformance } from "@/features/swimming-performance/types";

export default function SwimmingPage() {
  const { t } = useTranslation("swimming");

  const { data: meRes } = useMe();
  const userRoles = meRes?.data?.roles || [];
  const canManage =
    userRoles.includes("SwimmingCoach") || userRoles.includes("Admin");

  // Filters State
  const {
    page,
    localSearch,
    setLocalSearch,
    debouncedSearch,
    athleteId,
    setAthleteFilter,
    trainingSessionId,
    setSessionFilter,
    stroke,
    setStrokeFilter,
    status,
    setStatusFilter,
    showArchived,
    setShowArchived,
    descending,
    setSortDescending,
  } = useSwimmingPerformanceFilters();

  // Query API
  const { data, isLoading, isError, refetch } = useSwimmingPerformances({
    pageIndex: page,
    pageSize: 15,
    search: debouncedSearch,
    athleteId,
    trainingSessionId,
    stroke,
    status,
    isArchived: showArchived ? true : undefined,
    descending,
  });

  const performancesResponse = data?.data;
  const performances = performancesResponse?.items ?? [];
  const totalCount = performancesResponse?.totalCount ?? performances.length;
  const totalPages = performancesResponse?.totalPages ?? 1;

  // Drawers & Modals State
  const [isLogDrawerOpen, setIsLogDrawerOpen] = useState(false);
  const [selectedForDetail, setSelectedForDetail] =
    useState<SwimmingPerformance | null>(null);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
  const [selectedForEdit, setSelectedForEdit] =
    useState<SwimmingPerformance | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedForArchive, setSelectedForArchive] =
    useState<SwimmingPerformance | null>(null);
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);

  function handleViewDetails(item: SwimmingPerformance) {
    setSelectedForDetail(item);
    setIsDetailSheetOpen(true);
  }

  function handleEdit(item: SwimmingPerformance) {
    setSelectedForEdit(item);
    setIsEditModalOpen(true);
  }

  function handleArchiveToggle(item: SwimmingPerformance) {
    setSelectedForArchive(item);
    setIsArchiveDialogOpen(true);
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
          stroke={stroke}
          onStrokeChange={setStrokeFilter}
          status={status}
          onStatusChange={setStatusFilter}
          showArchived={showArchived}
          onShowArchivedChange={setShowArchived}
          descending={descending}
          onSortChange={setSortDescending}
          onLogClick={() => setIsLogDrawerOpen(true)}
          canManage={canManage}
        />

        <WithPagination pageCount={totalPages}>
          <SwimmingPerformanceTable
            performances={performances}
            isLoading={isLoading}
            isError={isError}
            onRetry={refetch}
            onViewDetails={handleViewDetails}
            onEdit={handleEdit}
            onArchiveToggle={handleArchiveToggle}
            canManage={canManage}
            isArchivedView={showArchived}
          />
        </WithPagination>
      </Box>

      {/* Drawers & Modals */}
      <LogSwimmingPerformanceDrawer
        open={isLogDrawerOpen}
        onOpenChange={setIsLogDrawerOpen}
      />

      <SwimmingPerformanceDetailSheet
        performance={selectedForDetail}
        open={isDetailSheetOpen}
        onOpenChange={setIsDetailSheetOpen}
      />

      <EditSwimmingPerformanceModal
        performance={selectedForEdit}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
      />

      <ArchiveSwimmingPerformanceDialog
        performance={selectedForArchive}
        open={isArchiveDialogOpen}
        onOpenChange={setIsArchiveDialogOpen}
        isArchivedView={showArchived}
      />
    </PageWrapper>
  );
}
