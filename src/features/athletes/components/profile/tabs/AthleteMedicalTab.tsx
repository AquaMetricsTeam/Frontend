import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  MdMedicalServices,
  MdPhone,
  MdContentCopy,
  MdCheck,
  MdWarningAmber,
  MdCake,
  MdPerson,
  MdVerifiedUser,
} from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { AthleteOverviewResponse } from "../../../types/index";

interface AthleteMedicalTabProps {
  athlete: AthleteOverviewResponse;
}

function formatGender(
  gender: string | number | undefined | null,
  t: (key: string) => string,
): string {
  const g = Number(gender);
  if (g === 1 || String(gender).toLowerCase() === "male")
    return t("gender.male");
  if (g === 2 || String(gender).toLowerCase() === "female")
    return t("gender.female");
  return t("gender.unknown");
}

export function AthleteMedicalTab({ athlete }: AthleteMedicalTabProps) {
  const { t } = useTranslation("athletes");
  const [copied, setCopied] = useState(false);

  function handleCopyPhone(phone: string) {
    navigator.clipboard.writeText(phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const medicalNotesStr = String(athlete.medicalNotes || "").trim();
  const hasMedicalNotes =
    medicalNotesStr !== "" &&
    !medicalNotesStr.toLowerCase().includes("no known");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="flex size-9 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500">
          <MdMedicalServices className="size-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-foreground">
            {t("profile.medical.title")}
          </h3>
          <p className="text-xs text-muted-foreground">
            {t("profile.medical.subtitle")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Emergency Contact Card */}
        <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-xs">
          <div>
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {t("profile.medical.emergencyContact")}
              </span>
              <Badge
                variant="outline"
                className="border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-semibold"
              >
                {t("profile.medical.urgentPriority")}
              </Badge>
            </div>

            <div className="mt-5 space-y-2">
              {athlete.emergencyContact ? (
                <>
                  <div className="text-xl font-bold text-foreground tracking-wide font-mono">
                    {athlete.emergencyContact}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("profile.medical.emergencyContactDesc")}
                  </p>
                </>
              ) : (
                <p className="text-xs text-muted-foreground italic py-3">
                  {t("profile.medical.noEmergencyContact")}
                </p>
              )}
            </div>
          </div>

          {athlete.emergencyContact && (
            <div className="mt-6 flex items-center gap-2 pt-4 border-t border-border/60">
              <a
                href={`tel:${athlete.emergencyContact}`}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
              >
                <MdPhone className="size-4" />
                <span>{t("profile.medical.callEmergency")}</span>
              </a>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopyPhone(athlete.emergencyContact!)}
                className="h-10 rounded-xl px-3 border-border hover:border-primary/40 cursor-pointer"
                title={t("profile.medical.copyNumber")}
              >
                {copied ? (
                  <MdCheck className="size-4 text-emerald-500" />
                ) : (
                  <MdContentCopy className="size-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Medical Notes Card */}
        <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-xs">
          <div>
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {t("profile.medical.medicalNotes")}
              </span>
              {hasMedicalNotes ? (
                <Badge
                  variant="outline"
                  className="border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-semibold"
                >
                  <MdWarningAmber className="size-3 me-1" />
                  {t("profile.medical.hasNotes")}
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold"
                >
                  <MdVerifiedUser className="size-3 me-1" />
                  {t("profile.medical.clear")}
                </Badge>
              )}
            </div>

            <div className="mt-5">
              {athlete.medicalNotes ? (
                <div
                  className={`rounded-xl p-4 text-xs leading-relaxed border ${
                    hasMedicalNotes
                      ? "bg-amber-500/5 border-amber-500/20 text-foreground font-medium"
                      : "bg-muted/30 border-border/40 text-muted-foreground"
                  }`}
                >
                  {athlete.medicalNotes}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic py-3">
                  {t("profile.medical.noMedicalNotes")}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border/60 text-[11px] text-muted-foreground">
            {t("profile.medical.confidentialNotice")}
          </div>
        </div>
      </div>

      {/* Biometrics Information Grid */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border/60 pb-3">
          {t("profile.medical.biometricsTitle")}
        </h4>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          {/* Age */}
          <div className="space-y-1 rounded-xl bg-muted/30 p-3.5 border border-border/40">
            <span className="text-muted-foreground text-[11px]">
              {t("table.age")}
            </span>
            <div className="text-base font-bold text-foreground">
              {athlete.age} {t("profile.yearsOld")}
            </div>
          </div>

          {/* Date of Birth */}
          <div className="space-y-1 rounded-xl bg-muted/30 p-3.5 border border-border/40">
            <span className="text-muted-foreground text-[11px] flex items-center gap-1">
              <MdCake className="size-3 text-primary" />
              {t("profile.medical.dateOfBirth")}
            </span>
            <div className="text-sm font-bold text-foreground">
              {athlete.dateOfBirth
                ? new Date(athlete.dateOfBirth).toLocaleDateString()
                : "--"}
            </div>
          </div>

          {/* Gender */}
          <div className="space-y-1 rounded-xl bg-muted/30 p-3.5 border border-border/40">
            <span className="text-muted-foreground text-[11px] flex items-center gap-1">
              <MdPerson className="size-3 text-primary" />
              {t("table.gender")}
            </span>
            <div className="text-sm font-bold text-foreground">
              {formatGender(athlete.gender, t)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
