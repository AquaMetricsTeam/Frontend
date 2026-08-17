import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { MdAdd, MdHowToReg, MdHourglassTop } from "react-icons/md";
import PageWrapper from "@/components/layouts/PageWrapper";
import WithPagination from "@/components/HOCs/WithPagination";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/common/SearchInput";
import Box from "@/components/layouts/Box";
import { cn } from "@/lib/utils";
import { useMe } from "@/features/auth/hooks/useMe";
import { useAdminAthletes } from "@/features/athletes/hooks/useAdminAthletes";
import { useCoachAthletes } from "@/features/athletes/hooks/useCoachAthletes";
import { useAthleteFilters } from "@/features/athletes/hooks/useAthleteFilters";
import { usePendingAthletes } from "@/features/athlete-registration/hooks/usePendingAthletes";
import { AdminAthletesTable } from "@/features/athletes/components/AdminAthletesTable";
import { CoachAthletesTable } from "@/features/athletes/components/CoachAthletesTable";
import { AssignCoachModal } from "@/features/athletes/components/AssignCoachModal";
import { CreateUserModal } from "@/features/users/components/CreateUserModal";
import { AthleteNotesSheet } from "@/features/coach-notes/components/AthleteNotesSheet";
import type { AdminAthlete } from "@/features/athletes/types/index";

export default function AthletesPage() {
  const { t } = useTranslation("athletes");
  const { data: meRes, isLoading: isMeLoading } = useMe();

  const currentUserId = meRes?.data?.userId;
  const userRoles = meRes?.data?.roles || [];
  const isAdmin = userRoles.includes("Admin");
  // Only determine role once meRes has loaded
  const roleKnown = !isMeLoading && userRoles.length > 0;

  const [selectedAthlete, setSelectedAthlete] = useState<AdminAthlete | null>(
    null,
  );
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Coach notes sheet state
  const [notesAthlete, setNotesAthlete] = useState<{
    id: string;
    fullName: string;
    email?: string;
  } | null>(null);

  const { localSearch, setLocalSearch, debouncedSearch, page } =
    useAthleteFilters();

  const queryParams = {
    pageNumber: page,
    pageSize: 15,
    search: debouncedSearch,
  };

  // Only one query fires — gated by roleKnown + role
  const adminQuery = useAdminAthletes(queryParams, roleKnown && isAdmin);
  const coachQuery = useCoachAthletes(queryParams, roleKnown && !isAdmin);
  const pendingQuery = usePendingAthletes(roleKnown && isAdmin);

  const activeQuery = isAdmin ? adminQuery : coachQuery;
  const responseData = activeQuery.data?.data;
  const totalCount = responseData?.totalCount ?? 0;
  const totalPages = responseData?.totalPages ?? 1;

  const adminAthletes = adminQuery.data?.data?.items ?? [];
  const coachAthletes = coachQuery.data?.data?.items ?? [];
  const pendingCount = pendingQuery.data?.data?.length ?? 0;

  function handleOpenAssignModal(athlete: AdminAthlete) {
    setSelectedAthlete(athlete);
    setIsAssignModalOpen(true);
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
              {t("page.title")}
            </h1>
            <Badge
              variant="secondary"
              className="rounded-full px-2.5 py-0.5 text-xs font-semibold text-primary bg-primary/10 border-primary/20"
            >
              {t(totalCount === 1 ? "page.count" : "page.count_plural", {
                count: totalCount,
              })}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("page.description")}
          </p>
        </div>

        {isAdmin && (
          <div className="flex items-center gap-2.5">
            <Link
              to="/athlete-registrations"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "h-9 gap-1.5 rounded-lg border-amber-500/30 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10 hover:border-amber-500 cursor-pointer",
              )}
            >
              <MdHowToReg className="size-4" />
              <span>{t("registration.actions.pendingRegistrations")}</span>
              {pendingCount > 0 && (
                <span className="ms-1 rounded-full bg-amber-500/20 px-1.5 py-0.2 text-[11px] font-bold">
                  {pendingCount}
                </span>
              )}
            </Link>
            <Button
              size="sm"
              className="h-9 rounded-lg gap-1.5 cursor-pointer"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <MdAdd className="size-4" />
              {t("page.createButton")}
            </Button>
          </div>
        )}
      </div>

      {/* Admin Notice for Pending Registrations */}
      {isAdmin && pendingCount > 0 && (
        <div className="mb-4 flex items-center justify-between rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-2.5 text-xs text-amber-800 dark:text-amber-300">
          <div className="flex items-center gap-2">
            <MdHourglassTop className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <span>
              {t("registration.banner.pendingAlert", { count: pendingCount })}
            </span>
          </div>
          <Link
            to="/athlete-registrations"
            className="font-semibold underline hover:text-amber-900 dark:hover:text-amber-100"
          >
            {t("registration.actions.reviewNow")} &rarr;
          </Link>
        </div>
      )}

      <Box>
        {/* Controls Row: Search */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
          <SearchInput
            value={localSearch}
            onChange={setLocalSearch}
            placeholder={t("search.placeholder")}
          />
        </div>

        {/* Table — role-gated */}
        <WithPagination pageCount={totalPages}>
          {isAdmin ? (
            <AdminAthletesTable
              athletes={adminAthletes}
              isLoading={adminQuery.isLoading || isMeLoading}
              isError={adminQuery.isError}
              onRetry={adminQuery.refetch}
              onOpenAssignModal={handleOpenAssignModal}
            />
          ) : (
            <CoachAthletesTable
              athletes={coachAthletes}
              isLoading={coachQuery.isLoading || isMeLoading}
              isError={coachQuery.isError}
              onRetry={coachQuery.refetch}
              onOpenNotes={(ath) => setNotesAthlete(ath)}
            />
          )}
        </WithPagination>
      </Box>

      {/* Modals for Admin */}
      {isAdmin && (
        <>
          <AssignCoachModal
            athlete={selectedAthlete}
            open={isAssignModalOpen}
            onOpenChange={setIsAssignModalOpen}
          />
          <CreateUserModal
            open={isCreateModalOpen}
            onOpenChange={setIsCreateModalOpen}
            fixedRole="Athlete"
          />
        </>
      )}

      {/* Athlete Notes Sheet */}
      <AthleteNotesSheet
        athlete={notesAthlete}
        open={!!notesAthlete}
        onOpenChange={(open) => {
          if (!open) setNotesAthlete(null);
        }}
        currentUserId={currentUserId}
      />
    </PageWrapper>
  );
}
