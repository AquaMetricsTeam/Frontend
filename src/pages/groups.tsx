import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MdAdd, MdGroup, MdFilterList } from "react-icons/md";
import PageWrapper from "@/components/layouts/PageWrapper";
import WithPagination from "@/components/HOCs/WithPagination";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/common/SearchInput";
import Box from "@/components/layouts/Box";
import { useGroups } from "@/features/groups/hooks/useGroups";
import { useGroupFilters } from "@/features/groups/hooks/useGroupFilters";
import { GroupsTable } from "@/features/groups/components/GroupsTable";
import { CreateGroupModal } from "@/features/groups/components/CreateGroupModal";

export default function GroupsPage() {
  const { t } = useTranslation("groups");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const {
    localSearch,
    setLocalSearch,
    debouncedSearch,
    onlyArchived,
    setOnlyArchived,
    pageNumber,
  } = useGroupFilters();

  const { data, isLoading, isError, refetch } = useGroups({
    pageNumber,
    pageSize: 15,
    search: debouncedSearch,
    onlyArchived,
  });

  const groupsResponse = data?.data;
  const groups = groupsResponse?.items ?? [];
  const totalCount = groupsResponse?.totalCount ?? 0;
  const totalPages = groupsResponse?.totalPages ?? 1;

  return (
    <PageWrapper>
      {/* Page Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10">
              <MdGroup className="size-5 text-primary" />
            </div>
            <h1
              className="text-2xl font-bold tracking-tight text-foreground"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {t("groups:page.title")}
            </h1>
            <Badge
              variant="secondary"
              className="rounded-full px-2.5 py-0.5 text-xs font-semibold text-primary bg-primary/10 border-primary/20"
            >
              {t(
                totalCount === 1
                  ? "groups:page.groupCount"
                  : "groups:page.groupCount_plural",
                { count: totalCount },
              )}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground ms-12">
            {t("groups:page.description")}
          </p>
        </div>
      </div>

      <Box>
        {/* Controls Row */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            <SearchInput
              value={localSearch}
              onChange={setLocalSearch}
              placeholder={t("groups:search.placeholder")}
            />

            {/* Archive filter toggle */}
            <button
              type="button"
              onClick={() => setOnlyArchived(!onlyArchived)}
              className={`flex h-9 items-center gap-1.5 rounded-lg border px-3 text-sm font-medium transition-colors ${
                onlyArchived
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <MdFilterList className="size-4" />
              {t("groups:filter.archived")}
            </button>
          </div>

          <Button
            size="sm"
            className="h-9 rounded-lg gap-1.5 self-start lg:self-auto cursor-pointer"
            onClick={() => setIsCreateOpen(true)}
          >
            <MdAdd className="size-4" />
            {t("groups:page.createButton")}
          </Button>
        </div>

        {/* Table */}
        <WithPagination pageCount={totalPages}>
          <GroupsTable
            groups={groups}
            isLoading={isLoading}
            isError={isError}
            onRetry={refetch}
          />
        </WithPagination>
      </Box>

      <CreateGroupModal open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </PageWrapper>
  );
}
