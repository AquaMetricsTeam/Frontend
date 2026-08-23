import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MdAdd, MdStickyNote2, MdRefresh } from "react-icons/md";
import PageWrapper from "@/components/layouts/PageWrapper";
import Box from "@/components/layouts/Box";
import WithPagination from "@/components/HOCs/WithPagination";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ComboboxSelect } from "@/components/common/ComboboxSelect";
import { useMe } from "@/features/auth/hooks/useMe";
import { useCoachAthletes } from "@/features/athletes/hooks/useCoachAthletes";
import { useAdminAthletes } from "@/features/athletes/hooks/useAdminAthletes";
import { useCoachNotes } from "@/features/coach-notes/hooks/useCoachNotes";
import { CoachNoteCard } from "@/features/coach-notes/components/CoachNoteCard";
import { CreateCoachNoteModal } from "@/features/coach-notes/components/CreateCoachNoteModal";
import { EditCoachNoteModal } from "@/features/coach-notes/components/EditCoachNoteModal";
import type { CoachNote, CoachNotesPaginatedResponse } from "@/features/coach-notes/types/index";

export default function CoachNotesPage() {
  const { t } = useTranslation("coachNotes");
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedAthleteId = searchParams.get("athleteId") || "";
  const page = Number(searchParams.get("page")) || 1;

  const { data: meRes, isLoading: isMeLoading } = useMe();

  const user = meRes?.data;
  const currentUserId = user?.userId;
  const roles = user?.roles || [];
  const isAdmin = roles.includes("Admin");
  const roleKnown = !isMeLoading && roles.length > 0;

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [editingNote, setEditingNote] = useState<CoachNote | null>(null);

  // Fetch athletes list for combobox selection
  const coachAthletesQuery = useCoachAthletes(
    { pageSize: 100 },
    roleKnown && !isAdmin,
  );
  const adminAthletesQuery = useAdminAthletes(
    { pageSize: 100 },
    roleKnown && isAdmin,
  );

  const rawAthletes = isAdmin
    ? adminAthletesQuery.data?.data?.items ?? []
    : coachAthletesQuery.data?.data?.items ?? [];

  const athletesOptions = useMemo(() => {
    return rawAthletes
      .map((a) => {
        const id = ("athleteId" in a && a.athleteId ? a.athleteId : a.id) || "";
        return {
          value: id,
          label: a.fullName,
        };
      })
      .filter((opt) => Boolean(opt.value));
  }, [rawAthletes]);

  // Automatically select the first athlete if none is selected in URL
  useEffect(() => {
    if (!selectedAthleteId && athletesOptions.length > 0) {
      const firstAthleteId = athletesOptions[0].value;
      if (firstAthleteId) {
        setSearchParams(
          (prev) => {
            const newParams = new URLSearchParams(prev);
            newParams.set("athleteId", firstAthleteId);
            return newParams;
          },
          { replace: true },
        );
      }
    }
  }, [selectedAthleteId, athletesOptions, setSearchParams]);

  const athleteNameMap = useMemo(() => {
    const map = new Map<string, string>();
    rawAthletes.forEach((a) => {
      const id = ("athleteId" in a && a.athleteId ? a.athleteId : a.id) || "";
      if (id) {
        map.set(id, a.fullName);
      }
    });
    return map;
  }, [rawAthletes]);

  // Fetch coach notes synced with URL athleteId & page
  const notesQueryParams = {
    athleteId: selectedAthleteId || undefined,
    pageNumber: page,
    pageSize: 12,
    isMy: true,
  };

  const notesQuery = useCoachNotes(notesQueryParams, roleKnown);

  const rawData = notesQuery.data as any;
  const responseData = (rawData?.data ?? rawData) as
    | CoachNotesPaginatedResponse
    | undefined;
  const notes = responseData?.items ?? [];
  const totalCount = responseData?.totalCount ?? 0;
  const totalPages = responseData?.totalPages ?? 1;

  const handleAthleteChange = (val: string) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (val) {
        newParams.set("athleteId", val);
      } else {
        newParams.delete("athleteId");
      }
      newParams.delete("page"); // Reset pagination to page 1 on filter change
      return newParams;
    });
  };

  return (
    <PageWrapper>
      {/* Header */}
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

        <Button
          size="sm"
          className="h-9 rounded-lg gap-1.5 self-start sm:self-auto cursor-pointer"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <MdAdd className="size-4" />
          {t("page.addNote")}
        </Button>
      </div>

      <Box>
        {/* Controls Bar: Athlete Combobox Filter */}
        <div className="mb-6 max-w-sm">
          <ComboboxSelect
            placeholder={t("page.filterByAthlete")}
            clearLabel={t("page.allAthletes")}
            options={athletesOptions}
            value={selectedAthleteId}
            onValueChange={handleAthleteChange}
          />
        </div>

        {/* Notes Grid */}
        <WithPagination pageCount={totalPages}>
          {notesQuery.isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Skeleton className="h-44 rounded-xl" />
              <Skeleton className="h-44 rounded-xl" />
              <Skeleton className="h-44 rounded-xl" />
            </div>
          ) : notesQuery.isError ? (
            <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-destructive/20 bg-destructive/5 space-y-3">
              <p className="text-sm font-semibold text-destructive">
                {t("toasts.fetchError", "Failed to load coach notes.")}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => notesQuery.refetch()}
                className="h-9 text-xs gap-1.5"
              >
                <MdRefresh className="size-4" />
                Retry
              </Button>
            </div>
          ) : notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-border bg-muted/20 my-4 space-y-3">
              <div className="p-3 rounded-full bg-primary/10 text-primary border border-primary/20">
                <MdStickyNote2 className="size-8" />
              </div>
              <div className="space-y-1 max-w-sm">
                <p className="text-base font-bold text-foreground">
                  {t("page.noNotesTitle")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("page.noNotesDescription")}
                </p>
              </div>
              <Button
                size="sm"
                className="mt-2 h-9 text-xs gap-1.5 cursor-pointer"
                onClick={() => setIsCreateModalOpen(true)}
              >
                <MdAdd className="size-4" />
                {t("page.addNote")}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {notes.map((note) => (
                <CoachNoteCard
                  key={note.id}
                  note={note}
                  currentUserId={currentUserId}
                  athleteName={athleteNameMap.get(note.athleteId)}
                  onEdit={(n) => setEditingNote(n)}
                />
              ))}
            </div>
          )}
        </WithPagination>
      </Box>

      {/* Modals */}
      <CreateCoachNoteModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        fixedAthleteId={selectedAthleteId || undefined}
        fixedAthleteName={
          selectedAthleteId
            ? athleteNameMap.get(selectedAthleteId)
            : undefined
        }
        athletesOptions={athletesOptions}
      />

      <EditCoachNoteModal
        open={!!editingNote}
        onOpenChange={(open) => {
          if (!open) setEditingNote(null);
        }}
        note={editingNote}
      />
    </PageWrapper>
  );
}
