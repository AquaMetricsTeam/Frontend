import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { staffRoleValues } from "../constants/validations";
import type { RoleFilter } from "../constants/validations";

interface RoleFilterTabsProps {
  currentRole: string | undefined;
  onRoleChange: (role: string | undefined) => void;
}

export function RoleFilterTabs({
  currentRole,
  onRoleChange,
}: RoleFilterTabsProps) {
  const { t } = useTranslation("users");
  const activeFilter = currentRole || "all";
  const filters: RoleFilter[] = ["all", ...staffRoleValues];

  function handleFilterChange(role: RoleFilter) {
    onRoleChange(role === "all" ? undefined : role);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((role) => {
        const isActive = activeFilter === role;
        return (
          <Button
            key={role}
            variant={isActive ? "secondary" : "ghost"}
            size="sm"
            onClick={() => handleFilterChange(role)}
            className="rounded-full text-xs px-4 cursor-pointer"
          >
            {t(`users:roles.${role}`)}
          </Button>
        );
      })}
    </div>
  );
}
