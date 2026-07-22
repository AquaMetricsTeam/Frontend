import { useTranslation } from "react-i18next";
import { SUPPORTED_LOCALES } from "@/constants/i18nConfig";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MdLanguage, MdCheck } from "react-icons/md";
import { cn } from "@/lib/utils";

const LANG_DETAILS = {
  en: { label: "English", short: "EN", native: "English" },
  ar: { label: "العربية", short: "AR", native: "العربية" },
} as const;

export function LangToggle({ className }: { className?: string }) {
  const { i18n, t } = useTranslation();
  const currentLang = (i18n.language || "en") as Locale;

  function switchLang(locale: Locale) {
    i18n.changeLanguage(locale);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("common:lang.toggle")}
        className={cn(
          "flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold uppercase tracking-wider",
          "text-muted-foreground transition-all duration-150",
          "hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
          className
        )}
      >
        <MdLanguage className="size-4 text-primary" />
        <span>{LANG_DETAILS[currentLang]?.short ?? currentLang.toUpperCase()}</span>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-[140px] p-1">
        {SUPPORTED_LOCALES.map((locale) => {
          const isActive = currentLang === locale;
          const info = LANG_DETAILS[locale];

          return (
            <DropdownMenuItem
              key={locale}
              onClick={() => switchLang(locale)}
              className={cn(
                "flex items-center justify-between rounded-md px-2.5 py-2 text-xs font-medium cursor-pointer transition-colors",
                isActive
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-foreground hover:bg-accent"
              )}
            >
              <div className="flex items-center gap-2">
                <span className="flex size-5 items-center justify-center rounded bg-muted text-[10px] font-bold text-muted-foreground">
                  {info?.short}
                </span>
                <span>{info?.label}</span>
              </div>
              {isActive && <MdCheck className="size-4 text-primary" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
