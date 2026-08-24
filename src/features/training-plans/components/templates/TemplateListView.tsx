import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MdAdd } from "react-icons/md";
import Box from "@/components/layouts/Box";
import WithPagination from "@/components/HOCs/WithPagination";
import TableLoadingAndError from "@/components/HOCs/TableLoadingAndError";
import { SearchInput } from "@/components/common/SearchInput";
import { SegmentedControl } from "@/components/common/SegmentedControl";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useTrainingPlans,
  useTrainingPlansFilters,
} from "../../hooks/useTrainingPlans";
import { TemplateTableRow } from "./TemplateTableRow";
import { TemplateEmptyState } from "./TemplateEmptyState";
import { CreateTemplateSheet } from "./CreateTemplateSheet";
import { EditTemplateSheet } from "./EditTemplateSheet";
import { TemplateDetailSheet } from "./TemplateDetailSheet";
import { AssignPlanSheet } from "../assignments/AssignPlanSheet";
import type { TrainingPlan } from "../../types/index";

type ArchiveFilter = "active" | "archived";

export function TemplateListView() {
  const { t } = useTranslation("training");
  const [createOpen, setCreateOpen] = useState(false);
  const [viewPlan, setViewPlan] = useState<TrainingPlan | null>(null);
  const [assignPlan, setAssignPlan] = useState<TrainingPlan | null>(null);
  const [editPlan, setEditPlan] = useState<TrainingPlan | null>(null);

  const { search, setSearch, page, isArchived, setArchived } =
    useTrainingPlansFilters();

  const archiveFilter: ArchiveFilter = isArchived ? "archived" : "active";

  const archiveOptions: { value: ArchiveFilter; label: string }[] = [
    {
      value: "active",
      label: t("templates.filter.active", { defaultValue: "Active" }),
    },
    {
      value: "archived",
      label: t("templates.filter.archived", { defaultValue: "Archived" }),
    },
  ];

  const { data, isLoading, isError, refetch } = useTrainingPlans({
    pageNumber: page,
    pageSize: 15,
    search,
    onlyArchived: isArchived,
  });

  const plans = data?.data?.items ?? [];
  const totalPages = data?.data?.totalPages ?? 1;

  return (
    <>
      <Box>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder={t("assignments.searchPlans")}
            />
            <SegmentedControl
              options={archiveOptions}
              value={archiveFilter}
              onChange={(val) => setArchived(val === "archived")}
            />
          </div>
          <Button
            size="sm"
            onClick={() => setCreateOpen(true)}
            className="gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <MdAdd className="size-4" />
            {t("templates.actions.new")}
          </Button>
        </div>

        <WithPagination pageCount={totalPages}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("templates.table.plan")}</TableHead>
                <TableHead>{t("templates.table.exercises")}</TableHead>
                <TableHead>{t("templates.table.duration")}</TableHead>
                <TableHead className="text-end">
                  {t("templates.table.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableLoadingAndError
                isLoading={isLoading}
                isError={isError}
                hasNoData={plans.length === 0}
                skeletonProps={{ columns: 4, rows: 6 }}
                errorMessageProps={{ onRetry: refetch }}
              >
                {plans.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <TemplateEmptyState
                        isArchived={archiveFilter === "archived"}
                        onCreateClick={() => setCreateOpen(true)}
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  plans.map((plan) => (
                    <TemplateTableRow
                      key={plan.id}
                      plan={plan}
                      onView={setViewPlan}
                      onEdit={setEditPlan}
                      onAssign={setAssignPlan}
                    />
                  ))
                )}
              </TableLoadingAndError>
            </TableBody>
          </Table>
        </WithPagination>
      </Box>

      <CreateTemplateSheet open={createOpen} onOpenChange={setCreateOpen} />
      <EditTemplateSheet
        plan={editPlan}
        open={editPlan !== null}
        onOpenChange={(open) => {
          if (!open) setEditPlan(null);
        }}
      />
      <AssignPlanSheet
        plan={assignPlan}
        open={assignPlan !== null}
        onOpenChange={(open) => {
          if (!open) setAssignPlan(null);
        }}
      />
      <TemplateDetailSheet
        plan={viewPlan}
        open={viewPlan !== null}
        onOpenChange={(open) => {
          if (!open) setViewPlan(null);
        }}
        onEdit={(plan) => {
          setViewPlan(null);
          setEditPlan(plan);
        }}
        onAssign={(plan) => {
          setViewPlan(null);
          setAssignPlan(plan);
        }}
      />
    </>
  );
}
