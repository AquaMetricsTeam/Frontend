import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MdAdd } from "react-icons/md";
import PageWrapper from "@/components/layouts/PageWrapper";
import WithPagination from "@/components/HOCs/WithPagination";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/common/SearchInput";
import { useUsers } from "@/features/users/hooks/useUsers";
import { useUserFilters } from "@/features/users/hooks/useUserFilters";
import { UsersTable } from "@/features/users/components/UsersTable";
import { RoleFilterTabs } from "@/features/users/components/RoleFilterTabs";
import { CreateUserModal } from "@/features/users/components/CreateUserModal";
import Box from "@/components/layouts/Box";

export default function UsersPage() {
  const { t } = useTranslation("users");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { localSearch, setLocalSearch, debouncedSearch, role, page, setRole } =
    useUserFilters();

  const { data, isLoading, isError, refetch } = useUsers({
    pageNumber: page,
    pageSize: 15,
    search: debouncedSearch,
    role,
  });

  const usersResponse = data?.data;
  const users = usersResponse?.items || [];
  const totalCount = usersResponse?.totalCount || 0;
  const totalPages = usersResponse?.totalPages || 1;

  return (
    <PageWrapper>
      {/* Page Header */}

      {/* Main Content Card */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2.5">
            <h1
              className="text-2xl font-bold tracking-tight text-foreground"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {t("common:nav.items.usersStaff")}
            </h1>
            <Badge
              variant="secondary"
              className="rounded-full px-2.5 py-0.5 text-xs font-semibold text-primary bg-primary/10 border-primary/20"
            >
              {t(
                totalCount === 1
                  ? "users:page.memberCount"
                  : "users:page.memberCount_plural",
                { count: totalCount },
              )}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("users:page.description")}
          </p>
        </div>
      </div>
      <Box>
        {/* Controls Row: Search, Filters, and Create Action */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
            <SearchInput
              value={localSearch}
              onChange={setLocalSearch}
              placeholder={t("users:search.placeholder")}
            />

            <RoleFilterTabs currentRole={role} onRoleChange={setRole} />
          </div>

          <Button
            size="sm"
            className="h-9 rounded-lg gap-1.5 self-start lg:self-auto cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            <MdAdd className="size-4" />
            {t("users:page.createButton")}
          </Button>
        </div>

        {/* Paginated Users Table */}
        <WithPagination pageCount={totalPages}>
          <UsersTable
            users={users}
            isLoading={isLoading}
            isError={isError}
            onRetry={refetch}
          />
        </WithPagination>
      </Box>

      <CreateUserModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </PageWrapper>
  );
}
