import { useTranslation } from "react-i18next";
import { MdHourglassTop, MdVerifiedUser } from "react-icons/md";

interface PendingRegistrationStatsBannerProps {
  pendingCount: number;
}

export function PendingRegistrationStatsBanner({
  pendingCount,
}: PendingRegistrationStatsBannerProps) {
  const { t } = useTranslation("athletes");

  return (
    <div className="relative  rounded-xl border border-primary/20 bg-linear-to-r from-primary/5 via-primary/10 to-primary/5 p-4 sm:p-5 mb-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary border border-primary/25">
            <MdHourglassTop className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-foreground">
                {t("registration.banner.title")}
              </h2>
              <span className="inline-flex items-center rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-bold text-amber-700 dark:text-amber-400 border border-amber-500/30">
                {pendingCount} {t("registration.banner.pendingBadge")}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 max-w-xl">
              {t("registration.banner.description")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto text-xs text-muted-foreground bg-background/60 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-border/60">
          <MdVerifiedUser className="size-4 text-primary shrink-0" />
          <span>{t("registration.banner.verificationNotice")}</span>
        </div>
      </div>
    </div>
  );
}
