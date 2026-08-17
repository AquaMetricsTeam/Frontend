import { useTranslation } from "react-i18next";
import {
  MdCheckCircle,
  MdClose,
  MdEmail,
  MdFingerprint,
  MdHourglassTop,
  MdPerson,
} from "react-icons/md";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EligibilityDocumentViewer } from "./EligibilityDocumentViewer";
import type { PendingAthlete } from "../types/index";

interface AthleteRegistrationDetailsSheetProps {
  athlete: PendingAthlete | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApproveClick: (athlete: PendingAthlete) => void;
  onRejectClick: (athlete: PendingAthlete) => void;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

export function AthleteRegistrationDetailsSheet({
  athlete,
  open,
  onOpenChange,
  onApproveClick,
  onRejectClick,
}: AthleteRegistrationDetailsSheetProps) {
  const { t } = useTranslation("athletes");

  if (!athlete) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl flex flex-col justify-between overflow-y-auto p-0 border-s border-border"
      >
        <div className="p-6">
          <SheetHeader className="pb-4 border-b border-border/60">
            <div className="flex items-center justify-between gap-3">
              <Badge
                variant="secondary"
                className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20 text-xs px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1 w-fit"
              >
                <MdHourglassTop className="size-3" />
                {athlete.registrationStatus || t("status.pending")}
              </Badge>
            </div>
            <SheetTitle className="text-xl font-bold tracking-tight text-foreground mt-2">
              {t("registration.sheet.title")}
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground">
              {t("registration.sheet.description")}
            </SheetDescription>
          </SheetHeader>

          {/* Athlete Profile Card */}
          <div className="mt-6 rounded-xl border border-border/70 bg-muted/20 p-4">
            <div className="flex items-center gap-4">
              {athlete.profilePictureUrl ? (
                <img
                  src={athlete.profilePictureUrl}
                  alt={athlete.fullName}
                  className="h-16 w-16 rounded-full object-cover border-2 border-border shadow-xs shrink-0"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg border border-primary/20 shrink-0">
                  {getInitials(athlete.fullName)}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-foreground text-base truncate">
                  {athlete.fullName}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 truncate">
                  <MdEmail className="size-3.5 shrink-0 text-muted-foreground" />
                  <span className="truncate">{athlete.email}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/70 mt-1 font-mono">
                  <MdFingerprint className="size-3.5 shrink-0" />
                  <span className="truncate">{athlete.athleteId}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-border/60 bg-card p-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MdPerson className="size-4 text-primary" />
                <span>{t("registration.sheet.accountType")}</span>
              </div>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {t("registration.sheet.athleteAccount")}
              </p>
            </div>
            <div className="rounded-lg border border-border/60 bg-card p-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MdHourglassTop className="size-4 text-amber-500" />
                <span>{t("registration.sheet.verificationStatus")}</span>
              </div>
              <p className="mt-1 text-sm font-semibold text-amber-600 dark:text-amber-400">
                {t("registration.sheet.awaitingApproval")}
              </p>
            </div>
          </div>

          {/* Eligibility Document Section */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("registration.sheet.eligibilityDocument")}
              </h4>
            </div>
            <EligibilityDocumentViewer
              documentUrl={athlete.eligibilityDocumentUrl}
              athleteName={athlete.fullName}
            />
          </div>
        </div>

        {/* Action Footer */}
        <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border p-4 flex items-center justify-end gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 px-4 text-xs font-medium border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive cursor-pointer gap-1.5"
            onClick={() => onRejectClick(athlete)}
          >
            <MdClose className="size-4" />
            {t("registration.actions.reject")}
          </Button>

          <Button
            type="button"
            size="sm"
            className="h-9 px-4 text-xs font-medium bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 cursor-pointer gap-1.5"
            onClick={() => onApproveClick(athlete)}
          >
            <MdCheckCircle className="size-4" />
            {t("registration.actions.approve")}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
