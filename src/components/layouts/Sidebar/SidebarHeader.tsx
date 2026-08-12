import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import logoHorizontal from "@/assets/logo-horizontal.png";
import logoVertical from "@/assets/logo-vertical.png";
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
        "flex h-[60px] z-50  relative shrink-0 items-center border-b border-sidebar-border",
        collapsed
          ? "flex-col justify-center gap-1 py-2 px-2"
          : "justify-between gap-2 px-4",
      )}
    >
      {/* Logo (expanded) */}
      {!collapsed && (
        <div className="flex items-center min-w-0">
          <img
            src={logoHorizontal}
            alt="Aqua Metrics"
            className="h-12 w-auto object-contain"
          />
        </div>
      )}

      {/* Logo mark (collapsed) */}
      {collapsed && (
        <div className="flex size-10 shrink-0 items-center justify-center">
          <img
            src={logoVertical}
            alt="Aqua Metrics"
            className="h-10 w-auto object-contain"
          />
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
            ? "size-7 absolute -translate-y-1/2 -bottom-1/2  inset-e-0  -translate-x-1/2 ltr:translate-x-1/2 bg-bg-elevated z-10"
            : "size-6",
        )}
      >
        <CollapseIcon className="size-4" />
      </button>
    </div>
  );
}
