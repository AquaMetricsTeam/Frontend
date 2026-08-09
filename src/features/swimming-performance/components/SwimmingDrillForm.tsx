import { useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { TextareaField } from "@/components/fields/TextareaField";
import { InputField } from "@/components/fields/InputField";
import { MdWarning } from "react-icons/md";
import { TimeInput, parseTimeSpanToSeconds } from "./MmSsInput";
import { SegmentedRatingControl } from "./SegmentedRatingControl";
import { PerformanceStatus } from "../types";
import { STROKE_METADATA, STATUS_METADATA } from "../constants/enums";
import { cn } from "@/lib/utils";

interface SwimmingDrillFormProps {
  prefix?: string; // e.g. "swimmingPerformances.0" or ""
  showSkippedNotice?: boolean;
}

export function SwimmingDrillForm({
  prefix = "",
  showSkippedNotice,
}: SwimmingDrillFormProps) {
  const { t } = useTranslation("swimming");
  const { control, setValue } = useFormContext();

  const getFieldName = (field: string) =>
    prefix ? `${prefix}.${field}` : field;

  const setFieldValue = (field: string, val: any) =>
    setValue(getFieldName(field), val, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });

  // Explicit useWatch hooks for reactive UI re-renders on field changes
  const currentStroke = useWatch({ control, name: getFieldName("stroke") });
  const currentStatus = useWatch({ control, name: getFieldName("status") });
  const bestTime = useWatch({ control, name: getFieldName("bestRepTime") }) || "00:01:08";
  const avgTime = useWatch({ control, name: getFieldName("averageRepTime") }) || "00:01:10";
  const worstTime = useWatch({ control, name: getFieldName("worstRepTime") }) || "00:01:13";
  const rpeVal = useWatch({ control, name: getFieldName("rpe") });

  const techniqueVal = useWatch({ control, name: getFieldName("technique") });
  const startVal = useWatch({ control, name: getFieldName("start") });
  const turnsVal = useWatch({ control, name: getFieldName("turns") });
  const finishVal = useWatch({ control, name: getFieldName("finish") });
  const paceVal = useWatch({ control, name: getFieldName("paceConsistency") });

  const gradeValuesMap: Record<string, any> = {
    technique: techniqueVal,
    start: startVal,
    turns: turnsVal,
    finish: finishVal,
    paceConsistency: paceVal,
  };

  const bestSec = parseTimeSpanToSeconds(bestTime);
  const avgSec = parseTimeSpanToSeconds(avgTime);
  const worstSec = parseTimeSpanToSeconds(worstTime);

  const hasTimeWarning =
    (bestSec > 0 && avgSec > 0 && bestSec > avgSec) ||
    (avgSec > 0 && worstSec > 0 && avgSec > worstSec);

  const isSkipped =
    showSkippedNotice ?? currentStatus === PerformanceStatus.Skipped;

  return (
    <div className="space-y-5">
      {/* 1. Stroke */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-foreground">
          {t("builder.stroke")} <span className="text-destructive">*</span>
        </Label>
        <div className="flex flex-wrap gap-1.5">
          {Object.values(STROKE_METADATA).map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setFieldValue("stroke", s.value)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer",
                currentStroke === s.value
                  ? s.badgeClass + " shadow-xs"
                  : "border-border bg-muted/30 text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {t(s.labelKey)}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Numeric fields */}
      <div className="grid grid-cols-3 gap-3">
        <InputField
          name={getFieldName("distanceMeters") as any}
          label={t("builder.distance")}
          type="number"
          inputClassName="h-9 text-xs font-semibold"
          required
        />
        <InputField
          name={getFieldName("repetitions") as any}
          label={t("builder.repetitions")}
          type="number"
          inputClassName="h-9 text-xs font-semibold"
          required
        />
        <InputField
          name={getFieldName("restIntervalSeconds") as any}
          label={t("builder.restInterval")}
          type="number"
          inputClassName="h-9 text-xs font-semibold"
          required
        />
      </div>

      {/* 3. Status */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-foreground">
          {t("builder.status")} <span className="text-destructive">*</span>
        </Label>
        <div className="flex flex-wrap gap-1.5">
          {Object.values(STATUS_METADATA).map((st) => (
            <button
              key={st.value}
              type="button"
              onClick={() => setFieldValue("status", st.value)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer",
                currentStatus === st.value
                  ? st.badgeClass + " shadow-xs"
                  : "border-border bg-muted/30 text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {t(st.labelKey)}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Timing / Grades / RPE */}
      {isSkipped ? (
        <div className="p-3 rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs italic">
          {t("builder.skippedNotice")}
        </div>
      ) : (
        <>
          {/* Split lap times */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-foreground">
              {t("builder.splitLapTiming")}{" "}
              <span className="text-destructive">*</span>
            </Label>
            <div className="grid grid-cols-3 gap-3">
              <TimeInput
                label={t("builder.bestRepTime")}
                value={bestTime}
                onChange={(v) => setFieldValue("bestRepTime", v)}
                accentClass="text-emerald-500"
              />
              <TimeInput
                label={t("builder.avgRepTime")}
                value={avgTime}
                onChange={(v) => setFieldValue("averageRepTime", v)}
                accentClass="text-foreground"
              />
              <TimeInput
                label={t("builder.worstRepTime")}
                value={worstTime}
                onChange={(v) => setFieldValue("worstRepTime", v)}
                accentClass="text-rose-400"
              />
            </div>
            {hasTimeWarning && (
              <p className="flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                <MdWarning className="size-3.5 shrink-0" />
                {t("builder.timingWarning")}
              </p>
            )}
          </div>

          {/* Grades */}
          <div className="space-y-3 border-t border-border pt-3">
            <Label className="text-xs font-bold text-foreground uppercase tracking-wider">
              {t("builder.gradesTitle")}
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                "technique",
                "start",
                "turns",
                "finish",
              ].map((field) => (
                <SegmentedRatingControl
                  key={field}
                  label={t(`builder.${field}`)}
                  value={gradeValuesMap[field]}
                  onChange={(v) => setFieldValue(field, v)}
                />
              ))}
              <div className="md:col-span-2">
                <SegmentedRatingControl
                  label={t("builder.paceConsistency")}
                  value={gradeValuesMap["paceConsistency"]}
                  onChange={(v) => setFieldValue("paceConsistency", v)}
                />
              </div>
            </div>
          </div>

          {/* RPE Slider */}
          <div className="space-y-2 border-t border-border pt-3">
            <div className="flex items-center justify-between text-xs">
              <Label className="font-semibold text-foreground">
                {t("builder.rpe")}
              </Label>
              <Badge
                variant="secondary"
                className="font-bold text-xs bg-primary/10 text-primary border-primary/20"
              >
                {rpeVal ? `${rpeVal} / 10` : t("builder.rpeNotRated")}
              </Badge>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={rpeVal ?? 5}
              onChange={(e) => setFieldValue("rpe", Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-primary bg-muted"
            />
            <p className="text-[11px] text-muted-foreground">
              {t("builder.rpeHelper")}
            </p>
          </div>
        </>
      )}

      {/* Coach comment */}
      <div className="border-t border-border pt-3">
        <TextareaField
          name={getFieldName("coachComment") as any}
          label={t("builder.coachComment")}
          placeholder={t("builder.coachCommentPlaceholder")}
          rows={2}
          textareaClassName="text-xs resize-none"
        />
      </div>
    </div>
  );
}
