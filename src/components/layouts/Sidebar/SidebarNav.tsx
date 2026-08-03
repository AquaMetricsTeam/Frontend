import { useTranslation } from "react-i18next";
import { SidebarNavItem } from "./SidebarNavItem";
import { NAV_GROUPS } from "@/constants/sidebar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/Providers/AuthProvider";

interface SidebarNavProps {
  collapsed: boolean;
}

export function SidebarNav({ collapsed }: SidebarNavProps) {
  const { t } = useTranslation();
  const { hasAnyRole } = useAuth();

  const filteredGroups = NAV_GROUPS.map((group) => {
    const visibleItems = group.items.filter(
      (item) => !item.allowedRoles || hasAnyRole(item.allowedRoles),
    );
    return { ...group, items: visibleItems };
  }).filter((group) => group.items.length > 0);

  return (
    <nav className="flex flex-col gap-0.5 px-3">
      {filteredGroups.map((group, index) => (
        <div key={group.groupKey} className={cn(index > 0 && "mt-4")}>
          {!collapsed && (
            <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/70 select-none">
              {t(group.labelKey)}
            </p>
          )}
          {collapsed && index > 0 && (
            <div className="my-2 mx-auto h-px w-8 bg-border" />
          )}
          <div className="flex flex-col gap-0.5">
            {group.items.map((item) => (
              <SidebarNavItem
                key={item.key}
                item={item}
                collapsed={collapsed}
              />
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}
