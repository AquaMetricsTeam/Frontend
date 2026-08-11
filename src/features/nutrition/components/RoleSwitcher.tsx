import { useTranslation } from "react-i18next";

import { MdLock } from "react-icons/md";

interface RoleSwitcherProps {
  currentRole: "NutritionSpecialist" | "Administrator";
  onRoleChange: (role: "NutritionSpecialist" | "Administrator") => void;
}

export function RoleSwitcher({ currentRole, onRoleChange }: RoleSwitcherProps) {
  const { t } = useTranslation("nutrition");

  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] font-medium tracking-wide uppercase text-slate-400">
        {t("roleSwitcher.viewingAs")}
      </span>
      <div className="flex rounded-md border border-border bg-muted/50 p-0.5">
        <button
          onClick={() => onRoleChange("NutritionSpecialist")}
          className={`
            px-2.5 py-1 text-xs font-medium rounded transition-all
            ${currentRole === "NutritionSpecialist"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
            }
          `}
        >
          {t("roleSwitcher.nutritionSpecialist")}
        </button>
        <button
          onClick={() => onRoleChange("Administrator")}
          className={`
            px-2.5 py-1 text-xs font-medium rounded transition-all flex items-center gap-1
            ${currentRole === "Administrator"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
            }
          `}
        >
          <MdLock className="size-3" />
          {t("roleSwitcher.administrator")}
        </button>
      </div>
    </div>
  );
}

interface AdminBannerProps {
  className?: string;
}

export function AdminBanner({ className = "" }: AdminBannerProps) {
  const { t } = useTranslation("nutrition");

  return (
    <div className={`
      p-4 rounded-lg border border-amber-200 dark:border-amber-800 
      bg-amber-50 dark:bg-amber-900/20 ${className}
    `}>
      <div className="flex items-center gap-2">
        <MdLock className="size-4 text-amber-600 dark:text-amber-400 shrink-0" />
        <p className="text-sm text-amber-800 dark:text-amber-200">
          {t("adminBanner.message")}
        </p>
      </div>
    </div>
  );
}