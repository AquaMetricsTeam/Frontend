import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { MdDirectionsRun } from "react-icons/md";
import PageWrapper from "@/components/layouts/PageWrapper";
import WithPagination from "@/components/HOCs/WithPagination";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/common/SearchInput";
import Box from "@/components/layouts/Box";
import { cn } from "@/lib/utils";
import { usePendingAthletes } from "@/features/athlete-registration/hooks/usePendingAthletes";
import { usePendingAthletesFilter } from "@/features/athlete-registration/hooks/usePendingAthletesFilter";
import { PendingAthletesTable } from "@/features/athlete-registration/components/PendingAthletesTable";
import { AthleteRegistrationDetailsSheet } from "@/features/athlete-registration/components/AthleteRegistrationDetailsSheet";
import { ApproveAthleteDialog } from "@/features/athlete-registration/components/ApproveAthleteDialog";
import { RejectAthleteDialog } from "@/features/athlete-registration/components/RejectAthleteDialog";
import { PendingRegistrationStatsBanner } from "@/features/athlete-registration/components/PendingRegistrationStatsBanner";
import type { PendingAthlete } from "@/features/athlete-registration/types/index";

const PAGE_SIZE = 15;

export default function AthleteRegistrationsPage() {
  const { t } = useTranslation("athletes");

  const { data, isLoading, isError, refetch } = usePendingAthletes();
  const allPendingAthletes = useMemo(() => data?.data ?? [], [data?.data]);

  const { localSearch, setLocalSearch, debouncedSearch, page } =
    usePendingAthletesFilter();

  // Selected athlete states
  const [sheetAthlete, setSheetAthlete] = useState<PendingAthlete | null>(null);
  const [approveAthlete, setApproveAthlete] = useState<PendingAthlete | null>(
    null,
  );
  const [rejectAthlete, setRejectAthlete] = useState<PendingAthlete | null>(
    null,
  );

  // Client-side search filtering
  const filteredAthletes = useMemo(() => {
    if (!debouncedSearch.trim()) return allPendingAthletes;
    const query = debouncedSearch.toLowerCase().trim();
    return allPendingAthletes.filter(
      (a) =>
        a.fullName.toLowerCase().includes(query) ||
        a.email.toLowerCase().includes(query) ||
        a.athleteId.toLowerCase().includes(query),
    );
  }, [allPendingAthletes, debouncedSearch]);

  const totalCount = filteredAthletes.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  // Paginated slice
  const paginatedAthletes = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredAthletes.slice(start, start + PAGE_SIZE);
  }, [filteredAthletes, page]);

  function handleOpenSheet(athlete: PendingAthlete) {
    setSheetAthlete(athlete);
  }

  function handleOpenApprove(athlete: PendingAthlete) {
    setApproveAthlete(athlete);
  }

  function handleOpenReject(athlete: PendingAthlete) {
    setRejectAthlete(athlete);
  }

  return (
    <PageWrapper>
      {/* Page Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2.5">
            <h1
              className="text-2xl font-bold tracking-tight text-foreground"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {t("registration.page.title")}
            </h1>
            <Badge
              variant="secondary"
              className="rounded-full px-2.5 py-0.5 text-xs font-semibold text-amber-700 bg-amber-500/10 border-amber-500/20 dark:text-amber-400"
            >
              {t("registration.page.pendingCount", { count: allPendingAthletes.length })}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("registration.page.description")}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/athletes"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "h-9 gap-1.5 rounded-lg cursor-pointer",
            )}
          >
            <MdDirectionsRun className="size-4 text-primary" />
            <span>{t("registration.page.viewAllAthletes")}</span>
          </Link>
        </div>
      </div>

      {/* Stats Banner */}
      <PendingRegistrationStatsBanner pendingCount={allPendingAthletes.length} />

      <Box>
        {/* Controls Row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
          <SearchInput
            value={localSearch}
            onChange={setLocalSearch}
            placeholder={t("registration.search.placeholder")}
          />
        </div>

        {/* Paginated Table */}
        <WithPagination pageCount={totalPages}>
          <PendingAthletesTable
            athletes={paginatedAthletes}
            isLoading={isLoading}
            isError={isError}
            onRetry={refetch}
            onReview={handleOpenSheet}
            onApprove={handleOpenApprove}
            onReject={handleOpenReject}
          />
        </WithPagination>
      </Box>

      {/* Review Details Sheet */}
      <AthleteRegistrationDetailsSheet
        athlete={sheetAthlete}
        open={!!sheetAthlete}
        onOpenChange={(open) => {
          if (!open) setSheetAthlete(null);
        }}
        onApproveClick={(athlete) => {
          setSheetAthlete(null);
          handleOpenApprove(athlete);
        }}
        onRejectClick={(athlete) => {
          setSheetAthlete(null);
          handleOpenReject(athlete);
        }}
      />

      {/* Approve Confirmation Dialog */}
      <ApproveAthleteDialog
        athlete={approveAthlete}
        open={!!approveAthlete}
        onOpenChange={(open) => {
          if (!open) setApproveAthlete(null);
        }}
      />

      {/* Reject Confirmation Dialog */}
      <RejectAthleteDialog
        athlete={rejectAthlete}
        open={!!rejectAthlete}
        onOpenChange={(open) => {
          if (!open) setRejectAthlete(null);
        }}
      />
    </PageWrapper>
  );
}
