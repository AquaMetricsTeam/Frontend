import { useState } from "react";
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
import { AssignPlanSheet } from "../assignments/AssignPlanSheet";
import type { TrainingPlan } from "../../types/index";

type ArchiveFilter = "active" | "archived";

const ARCHIVE_OPTIONS: { value: ArchiveFilter; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "archived", label: "Archived" },
];

export function TemplateListView() {
  const [createOpen, setCreateOpen] = useState(false);
  const [assignPlan, setAssignPlan] = useState<TrainingPlan | null>(null);
  const [editPlan, setEditPlan] = useState<TrainingPlan | null>(null);
  const [archiveFilter, setArchiveFilter] = useState<ArchiveFilter>("active");

  const { search, setSearch, page } = useTrainingPlansFilters();

  const { data, isLoading, isError, refetch } = useTrainingPlans({
    pageNumber: page,
    pageSize: 15,
    search,
    isArchived: archiveFilter === "archived",
  });

  const plans = data?.data?.items ?? [];
  const totalPages = data?.data?.totalPages ?? 1;

  return (
    <>
      <Box>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search plans..."
            />
            <SegmentedControl
              options={ARCHIVE_OPTIONS}
              value={archiveFilter}
              onChange={setArchiveFilter}
            />
          </div>
          <Button
            size="sm"
            onClick={() => setCreateOpen(true)}
            className="gap-1.5 self-start sm:self-auto"
          >
            <MdAdd className="size-4" />
            New Training Plan
          </Button>
        </div>

        <WithPagination pageCount={totalPages}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-end">Actions</TableHead>
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
    </>
  );
}
