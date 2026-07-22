import { MdLightMode, MdDarkMode } from "react-icons/md";
import { useTheme } from "@/components/Providers/ThemeProvider";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <button
      onClick={toggleTheme}
      aria-label={t("common:theme.toggle")}
      className={cn(
        "flex size-9 items-center justify-center rounded-lg",
        "text-muted-foreground transition-colors duration-150",
        "hover:bg-accent hover:text-foreground",
        className
      )}
    >
      {theme === "dark" ? (
        <MdLightMode className="size-[18px]" />
      ) : (
        <MdDarkMode className="size-[18px]" />
      )}
    </button>
  );
}
