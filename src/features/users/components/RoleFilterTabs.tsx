import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ROLE_FILTER_LABELS, type RoleFilter, staffRoleValues } from "../constants/validations";

export function RoleFilterTabs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentRole = (searchParams.get("role") as RoleFilter) || "all";

  const filters: RoleFilter[] = ["all", ...staffRoleValues];

  function handleFilterChange(role: RoleFilter) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (role === "all") {
        next.delete("role");
      } else {
        next.set("role", role);
      }
      // Reset page when filter changes
      next.delete("page");
      return next;
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((role) => {
        const isActive = currentRole === role;
        return (
          <Button
            key={role}
            variant={isActive ? "secondary" : "ghost"}
            size="sm"
            onClick={() => handleFilterChange(role)}
            className="rounded-full text-xs px-4 cursor-pointer"
          >
            {ROLE_FILTER_LABELS[role]}
          </Button>
        );
      })}
    </div>
  );
}
