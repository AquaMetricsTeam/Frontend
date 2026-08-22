import { useState } from "react";
import { cn } from "@/lib/utils";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarNav } from "./SidebarNav";
import { Drawer, DrawerContent } from "@/components/ui/drawer";

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const COLLAPSED_KEY = "aqua-sidebar-collapsed";

function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(COLLAPSED_KEY) === "true";
    } catch {
      return false;
    }
  });

  function toggleCollapse() {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(COLLAPSED_KEY, String(next));
      } catch {}
      return next;
    });
  }

  return (
    <>
      {/* ── Desktop sidebar ─────────────────────────────────── */}
      <aside
        className={cn(
          "hidden lg:flex h-full flex-col bg-sidebar",
          "border-e border-sidebar-border shrink-0",
          "transition-[width] duration-250 ease-in-out",
          collapsed ? "w-[72px]" : "w-[260px]",
        )}
      >
        <SidebarHeader collapsed={collapsed} onToggle={toggleCollapse} />
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-3">
          <SidebarNav collapsed={collapsed} />
        </div>
      </aside>

      {/* ── Mobile drawer (shadcn) ───────────────────────────── */}
      <Drawer
        open={mobileOpen}
        onOpenChange={(open) => {
          if (!open) onMobileClose();
        }}
        direction="start"
      >
        <DrawerContent className="flex h-full w-[260px] flex-col rounded-none border-e border-sidebar-border bg-sidebar p-0 outline-none">
          <SidebarHeader collapsed={false} onToggle={onMobileClose} />
          <div className="flex-1 overflow-y-auto py-3">
            <SidebarNav collapsed={false} />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default Sidebar;
