import { useTranslation } from "react-i18next";
import { PerformanceGrade } from "../types";
import { GRADE_METADATA } from "../constants/enums";
import { cn } from "@/lib/utils";

interface SegmentedRatingControlProps {
  value: PerformanceGrade;
  onChange: (value: PerformanceGrade) => void;
  label?: string;
  disabled?: boolean;
}

export function SegmentedRatingControl({
  value,
  onChange,
  label,
  disabled = false,
}: SegmentedRatingControlProps) {
  const { t } = useTranslation("swimming");

  const options: PerformanceGrade[] = [
    PerformanceGrade.NeedsWork,
    PerformanceGrade.Fair,
    PerformanceGrade.Good,
    PerformanceGrade.Excellent,
    PerformanceGrade.Mastered,
  ];

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-foreground">{label}</span>
          <span className="text-[11px] font-semibold text-muted-foreground">
            {t(GRADE_METADATA[value]?.labelKey || "swimming:grades.good")}
          </span>
        </div>
      )}
      <div
        className={cn(
          "inline-flex items-center rounded-lg border border-border bg-muted/40 p-1 gap-1",
          disabled && "opacity-50 pointer-events-none",
        )}
      >
        {options.map((gradeVal) => {
          const isSelected = value === gradeVal;
          const meta = GRADE_METADATA[gradeVal];

          return (
            <button
              key={gradeVal}
              type="button"
              disabled={disabled}
              onClick={() => onChange(gradeVal)}
              className={cn(
                "flex-1 py-1 px-2 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1",
                isSelected
                  ? meta.colorClass + " shadow-xs font-extrabold border"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
              title={t(meta.labelKey)}
            >
              <span>{gradeVal}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function MiniRatingBar({ rating }: { rating: number }) {
  const rounded = Math.round(rating);
  return (
    <div className="flex items-center gap-0.5" title={`Rating: ${rating}/5`}>
      {[1, 2, 3, 4, 5].map((step) => (
        <span
          key={step}
          className={cn(
            "h-1.5 w-3 rounded-full transition-colors",
            step <= rounded
              ? "bg-primary"
              : "bg-muted-foreground/20 dark:bg-muted-foreground/10",
          )}
        />
      ))}
    </div>
  );
}
