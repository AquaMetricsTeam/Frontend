import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MdSearch, MdAdd } from "react-icons/md";
import PageWrapper from "@/components/layouts/PageWrapper";
import WithPagination from "@/components/HOCs/WithPagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUsers } from "@/features/users/hooks/useUsers";
import { UsersTable } from "@/features/users/components/UsersTable";
import { RoleFilterTabs } from "@/features/users/components/RoleFilterTabs";
import { CreateUserModal } from "@/features/users/components/CreateUserModal";

export default function UsersPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Read URL search params
  const page = Math.max(1, Number(searchParams.get("page") || "1"));
  const currentSearch = searchParams.get("search") || "";
  const currentRole = searchParams.get("role") || undefined;

  // Local state for debounced search input
  const [localSearch, setLocalSearch] = useState(currentSearch);
  const isMounted = useRef(false);

  // Sync local search state with URL parameter changes (e.g. back navigation)
  useEffect(() => {
    setLocalSearch(currentSearch);
  }, [currentSearch]);

  // Debounce: only push to URL after the user has typed (skip initial mount)
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    const handler = setTimeout(() => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (localSearch.trim()) {
          next.set("search", localSearch.trim());
        } else {
          next.delete("search");
        }
        next.delete("page");
        return next;
      });
    }, 350);

    return () => clearTimeout(handler);
  }, [localSearch, setSearchParams]);

  // Fetch users from API via TanStack query hook
  const { data, isLoading, isError, refetch } = useUsers({
    pageNumber: page,
    pageSize: 10,
    search: currentSearch || undefined,
    role: currentRole,
  });

  const usersResponse = data?.data;
  const users = usersResponse?.items || [];
  const totalCount = usersResponse?.totalCount || 0;
  const totalPages = usersResponse?.totalPages || 1;


  console.log(usersResponse?.items);

  return (
    <PageWrapper>
      {/* Page Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t("common:nav.items.usersStaff")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {totalCount} {totalCount === 1 ? "team member" : "team members"}
          </p>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-5 shadow-xs">
        {/* Controls Row: Search, Filters, and Create Action */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
            {/* Search Input with magnifying glass icon */}
            <div className="relative w-full sm:max-w-xs">
              <MdSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name or email..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="h-9 w-full rounded-lg pl-9 text-sm focus-visible:ring-primary/50"
              />
            </div>

            {/* Role Filter Pills */}
            <RoleFilterTabs />
          </div>

          {/* Create User Button */}
          <Button
            size="sm"
            className="h-9 rounded-lg gap-1.5 self-start lg:self-auto cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            <MdAdd className="size-4" />
            Create user
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
      </div>

      <CreateUserModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </PageWrapper>
  );
}
