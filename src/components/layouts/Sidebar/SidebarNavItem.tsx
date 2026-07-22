import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarNavItemProps {
  item: NavItem;
  collapsed: boolean;
}

export function SidebarNavItem({ item, collapsed }: SidebarNavItemProps) {
  const { t } = useTranslation();
  const Icon = item.icon;

  const linkContent = (
    <NavLink
      to={item.path}
      end={item.path === "/"}
      className={({ isActive }) =>
        cn(
          "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
          "text-muted-foreground hover:text-foreground hover:bg-accent",
          isActive && [
            "text-primary bg-primary/8 hover:bg-primary/10 hover:text-primary",
            "before:absolute before:inset-s-0 before:top-1/2 before:-translate-y-1/2",
            "before:h-5 before:w-0.75 before:rounded-full before:bg-primary before:content-['']",
          ],
          collapsed && "justify-center px-2",
        )
      }
    >
      <Icon
        className={cn(
          "size-[18px] shrink-0 transition-colors duration-150",
          "group-hover:text-foreground",
        )}
      />
      {!collapsed && (
        <span className="flex-1 truncate ">{t(item.labelKey)}</span>
      )}
      {!collapsed && item.badge !== undefined && item.badge > 0 && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/15 px-1.5 text-[10px] font-semibold text-primary">
          {item.badge > 99 ? "99+" : item.badge}
        </span>
      )}
    </NavLink>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger>{linkContent}</TooltipTrigger>
        <TooltipContent side="right" className="flex items-center gap-2">
          {t(item.labelKey)}
          {item.badge !== undefined && item.badge > 0 && (
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
              {item.badge}
            </span>
          )}
        </TooltipContent>
      </Tooltip>
    );
  }

  return linkContent;
}
