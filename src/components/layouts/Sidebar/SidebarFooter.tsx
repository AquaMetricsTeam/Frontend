import { cn } from "@/lib/utils";

interface SidebarFooterProps {
  collapsed: boolean;
  user?: {
    name: string;
    role: string;
    initials: string;
  };
}

const DEFAULT_USER = {
  name: "Rania Amari",
  role: "Administrator",
  initials: "RA",
};

export function SidebarFooter({
  collapsed,
  user = DEFAULT_USER,
}: SidebarFooterProps) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center border-t border-sidebar-border px-3 py-3",
        collapsed ? "justify-center" : "gap-3 px-4"
      )}
    >
      {/* Avatar */}
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/20 ring-2 ring-primary/30">
        <span className="text-[11px] font-semibold text-primary">
          {user.initials}
        </span>
      </div>

      {!collapsed && (
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold leading-none text-foreground">
            {user.name}
          </p>
          <span className="mt-1 inline-flex items-center rounded-full border border-primary/25 bg-primary/8 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-primary">
            {user.role}
          </span>
        </div>
      )}
    </div>
  );
}
