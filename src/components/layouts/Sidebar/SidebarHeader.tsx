import { MdPool, MdChevronLeft, MdChevronRight } from "react-icons/md";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { LANG_DIR } from "@/constants/i18nConfig";

interface SidebarHeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function SidebarHeader({ collapsed, onToggle }: SidebarHeaderProps) {
  const { t, i18n } = useTranslation();
  const isRtl = LANG_DIR[i18n.language as Locale] === "rtl";

  const CollapseIcon = isRtl
    ? collapsed
      ? MdChevronLeft
      : MdChevronRight
    : collapsed
      ? MdChevronRight
      : MdChevronLeft;

  return (
    <div
      className={cn(
        "flex h-[60px]  relative shrink-0 items-center border-b border-sidebar-border",
        collapsed
          ? "flex-col justify-center gap-1 py-2 px-2"
          : "justify-between gap-2 px-4",
      )}
    >
      {/* Logo + name (expanded) */}
      {!collapsed && (
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/15">
            <MdPool className="size-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p
              className="truncate text-[13px] font-bold  text-foreground"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Aqua Metrics
            </p>
            <p className="mt-0.5 truncate text-[10px] uppercase tracking-widest text-muted-foreground">
              Swimming Academy
            </p>
          </div>
        </div>
      )}

      {/* Logo only (collapsed) */}
      {collapsed && (
        <div className="flex size-8  items-center justify-center rounded-lg bg-primary/15">
          <MdPool className="size-4 text-primary" />
        </div>
      )}

      {/* Toggle — always visible */}
      <button
        onClick={onToggle}
        aria-label={
          collapsed ? t("common:sidebar.expand") : t("common:sidebar.collapse")
        }
        className={cn(
          "flex shrink-0 items-center justify-center rounded-md",
          "text-muted-foreground transition-colors duration-150",
          "hover:bg-accent hover:text-foreground",
          collapsed
            ? "size-7 absolute  inset-e-0  -translate-x-full ltr:translate-x-full bg-bg-elevated z-10"
            : "size-6",
        )}
      >
        <CollapseIcon className="size-4" />
      </button>
    </div>
  );
}
