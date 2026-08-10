import { StrokeType, PerformanceStatus, PerformanceGrade } from "../types";

export interface StrokeMeta {
  value: StrokeType;
  labelKey: string;
  shortLabel: string;
  badgeClass: string;
}

export const STROKE_METADATA: Record<StrokeType, StrokeMeta> = {
  [StrokeType.Freestyle]: {
    value: StrokeType.Freestyle,
    labelKey: "swimming:strokes.freestyle",
    shortLabel: "Free",
    badgeClass: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
  },
  [StrokeType.Backstroke]: {
    value: StrokeType.Backstroke,
    labelKey: "swimming:strokes.backstroke",
    shortLabel: "Back",
    badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  [StrokeType.Breaststroke]: {
    value: StrokeType.Breaststroke,
    labelKey: "swimming:strokes.breaststroke",
    shortLabel: "Breast",
    badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  [StrokeType.Butterfly]: {
    value: StrokeType.Butterfly,
    labelKey: "swimming:strokes.butterfly",
    shortLabel: "Fly",
    badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  [StrokeType.IndividualMedley]: {
    value: StrokeType.IndividualMedley,
    labelKey: "swimming:strokes.individualMedley",
    shortLabel: "IM",
    badgeClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  },
  [StrokeType.Kick]: {
    value: StrokeType.Kick,
    labelKey: "swimming:strokes.kick",
    shortLabel: "Kick",
    badgeClass: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
  },
  [StrokeType.Pull]: {
    value: StrokeType.Pull,
    labelKey: "swimming:strokes.pull",
    shortLabel: "Pull",
    badgeClass: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
  },
  [StrokeType.Drill]: {
    value: StrokeType.Drill,
    labelKey: "swimming:strokes.drill",
    shortLabel: "Drill",
    badgeClass: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
  },
  [StrokeType.Mixed]: {
    value: StrokeType.Mixed,
    labelKey: "swimming:strokes.mixed",
    shortLabel: "Mixed",
    badgeClass: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
  },
};

export interface StatusMeta {
  value: PerformanceStatus;
  labelKey: string;
  badgeClass: string;
}

export const STATUS_METADATA: Record<PerformanceStatus, StatusMeta> = {
  [PerformanceStatus.Completed]: {
    value: PerformanceStatus.Completed,
    labelKey: "swimming:statuses.completed",
    badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  [PerformanceStatus.PartiallyCompleted]: {
    value: PerformanceStatus.PartiallyCompleted,
    labelKey: "swimming:statuses.partiallyCompleted",
    badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  [PerformanceStatus.Skipped]: {
    value: PerformanceStatus.Skipped,
    labelKey: "swimming:statuses.skipped",
    badgeClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  },
  [PerformanceStatus.Modified]: {
    value: PerformanceStatus.Modified,
    labelKey: "swimming:statuses.modified",
    badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
};

export interface GradeMeta {
  value: PerformanceGrade;
  labelKey: string;
  colorClass: string;
}

export const GRADE_METADATA: Record<PerformanceGrade, GradeMeta> = {
  [PerformanceGrade.NeedsWork]: {
    value: PerformanceGrade.NeedsWork,
    labelKey: "swimming:grades.needsWork",
    colorClass: "text-rose-500 bg-rose-500/10 border-rose-500/30",
  },
  [PerformanceGrade.Fair]: {
    value: PerformanceGrade.Fair,
    labelKey: "swimming:grades.fair",
    colorClass: "text-amber-500 bg-amber-500/10 border-amber-500/30",
  },
  [PerformanceGrade.Good]: {
    value: PerformanceGrade.Good,
    labelKey: "swimming:grades.good",
    colorClass: "text-blue-500 bg-blue-500/10 border-blue-500/30",
  },
  [PerformanceGrade.Excellent]: {
    value: PerformanceGrade.Excellent,
    labelKey: "swimming:grades.excellent",
    colorClass: "text-cyan-500 bg-cyan-500/10 border-cyan-500/30",
  },
  [PerformanceGrade.Mastered]: {
    value: PerformanceGrade.Mastered,
    labelKey: "swimming:grades.mastered",
    colorClass: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30",
  },
};
