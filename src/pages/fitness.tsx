import { useState } from "react";
import PageWrapper from "@/components/layouts/PageWrapper";
import WithPagination from "@/components/HOCs/WithPagination";
import Box from "@/components/layouts/Box";
import { Badge } from "@/components/ui/badge";
import { MdFitnessCenter } from "react-icons/md";
import { useTrainingRecords } from "@/features/training-record/hooks/useTrainingRecords";
import { useFitnessRecordFilters } from "@/features/fitness/hooks/useFitnessRecordFilters";
import { FitnessFiltersBar } from "@/features/fitness/components/FitnessFiltersBar";
import { LogFitnessRecordDrawer } from "@/features/fitness/components/LogFitnessRecordDrawer";
import { FitnessRecordsTable } from "@/features/fitness/components/FitnessRecordsTable";
import { FitnessRecordDetailSheet } from "@/features/fitness/components/FitnessRecordDetailSheet";
import { EditFitnessRecordModal } from "@/features/fitness/components/EditFitnessRecordModal";
import type { TrainingRecordResponse } from "@/features/training-record/types";

export default function FitnessPage() {
  const {
    page,
    localSearch,
    setLocalSearch,
    debouncedSearch,
    athleteId,
    setAthleteFilter,
    sessionCompleted,
    setCompletedFilter,
    descending,
    setSortDescending,
  } = useFitnessRecordFilters();

  const { data, isLoading, isError, refetch } = useTrainingRecords({
    pageIndex: page,
    pageSize: 15,
    search: debouncedSearch,
    athleteId,
    sessionCompleted,
    descending,
  });

  const recordsResponse = data?.data;
  const records = recordsResponse?.items ?? [];
  const totalCount = recordsResponse?.totalCount ?? records.length;
  const totalPages = recordsResponse?.totalPages ?? 1;

  // Drawers / Modals state
  const [isLogDrawerOpen, setIsLogDrawerOpen] = useState(false);

  const [selectedForDetail, setSelectedForDetail] =
    useState<TrainingRecordResponse | null>(null);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);

  const [selectedForEdit, setSelectedForEdit] =
    useState<TrainingRecordResponse | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  function handleViewDetails(record: TrainingRecordResponse) {
    setSelectedForDetail(record);
    setIsDetailSheetOpen(true);
  }

  function handleEdit(record: TrainingRecordResponse) {
    setSelectedForEdit(record);
    setIsEditModalOpen(true);
  }

  return (
    <PageWrapper>
      {/* Page Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <MdFitnessCenter className="size-5" />
            </div>
            <h1
              className="text-2xl font-bold tracking-tight text-foreground"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Fitness Records
            </h1>
            <Badge
              variant="secondary"
              className="rounded-full px-2.5 py-0.5 text-xs font-semibold text-primary bg-primary/10 border-primary/20"
            >
              {totalCount} {totalCount === 1 ? "record" : "records"}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground ms-12">
            Track athlete fitness session performances and exercise data
          </p>
        </div>
      </div>

      <Box>
        <FitnessFiltersBar
          localSearch={localSearch}
          onSearchChange={setLocalSearch}
          athleteId={athleteId}
          onAthleteChange={setAthleteFilter}
          sessionCompleted={sessionCompleted}
          onSessionCompletedChange={setCompletedFilter}
          descending={descending}
          onSortChange={setSortDescending}
          onLogClick={() => setIsLogDrawerOpen(true)}
        />

        <WithPagination pageCount={totalPages}>
          <FitnessRecordsTable
            records={records}
            isLoading={isLoading}
            isError={isError}
            onRetry={refetch}
            onViewDetails={handleViewDetails}
            onEdit={handleEdit}
          />
        </WithPagination>
      </Box>

      <LogFitnessRecordDrawer
        open={isLogDrawerOpen}
        onOpenChange={setIsLogDrawerOpen}
      />

      <FitnessRecordDetailSheet
        record={selectedForDetail}
        open={isDetailSheetOpen}
        onOpenChange={setIsDetailSheetOpen}
        onEdit={handleEdit}
      />

      <EditFitnessRecordModal
        record={selectedForEdit}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
      />
    </PageWrapper>
  );
}
