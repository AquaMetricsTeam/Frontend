import { Dumbbell, Heart, ChevronUp, Zap, Flame, Hand, Footprints, GitMerge, Circle, TrendingUp, Shield, Triangle, ArrowDown, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { MuscleGroup } from "../types/index";

export type MuscleGroupCategory = "upperBody" | "lowerBody" | "coreFull";

export interface MuscleGroupMeta {
  label: string;
  labelKey: string;
  group: MuscleGroupCategory;
  tag: string;
  tagKey: string;
  sublabel: string;
  sublabelKey: string;
  Icon: LucideIcon;
  colorVar: string;
  accentClass: string;
  iconBgClass: string;
  glowColor: string;
}

export const MUSCLE_GROUP_META: Record<MuscleGroup, MuscleGroupMeta> = {
  [MuscleGroup.Chest]: {
    label: "Chest",
    labelKey: "exercises:muscleGroups.chest",
    group: "upperBody",
    tag: "Upper",
    tagKey: "exercises:categoryTags.upper",
    sublabel: "Pectorals & Push Power",
    sublabelKey: "exercises:muscleSublabels.chest",
    Icon: Heart,
    colorVar: "var(--primary-400)",
    accentClass: "text-cyan-400",
    iconBgClass: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    glowColor: "rgba(6, 182, 212, 0.35)",
  },
  [MuscleGroup.Back]: {
    label: "Back",
    labelKey: "exercises:muscleGroups.back",
    group: "upperBody",
    tag: "Upper",
    tagKey: "exercises:categoryTags.upper",
    sublabel: "Lats, Rhomboids & Pull",
    sublabelKey: "exercises:muscleSublabels.back",
    Icon: Shield,
    colorVar: "var(--secondary-400)",
    accentClass: "text-sky-400",
    iconBgClass: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    glowColor: "rgba(56, 189, 248, 0.35)",
  },
  [MuscleGroup.Shoulders]: {
    label: "Shoulders",
    labelKey: "exercises:muscleGroups.shoulders",
    group: "upperBody",
    tag: "Upper",
    tagKey: "exercises:categoryTags.upper",
    sublabel: "Deltoids & Overhead Stability",
    sublabelKey: "exercises:muscleSublabels.shoulders",
    Icon: ChevronUp,
    colorVar: "var(--primary-300)",
    accentClass: "text-teal-400",
    iconBgClass: "bg-teal-500/10 text-teal-400 border-teal-500/20",
    glowColor: "rgba(45, 212, 191, 0.35)",
  },
  [MuscleGroup.Biceps]: {
    label: "Biceps",
    labelKey: "exercises:muscleGroups.biceps",
    group: "upperBody",
    tag: "Upper",
    tagKey: "exercises:categoryTags.upper",
    sublabel: "Arm Flexors & Pulling Strength",
    sublabelKey: "exercises:muscleSublabels.biceps",
    Icon: Zap,
    colorVar: "var(--secondary-300)",
    accentClass: "text-blue-400",
    iconBgClass: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    glowColor: "rgba(96, 165, 250, 0.35)",
  },
  [MuscleGroup.Triceps]: {
    label: "Triceps",
    labelKey: "exercises:muscleGroups.triceps",
    group: "upperBody",
    tag: "Upper",
    tagKey: "exercises:categoryTags.upper",
    sublabel: "Arm Extensors & Lockout",
    sublabelKey: "exercises:muscleSublabels.triceps",
    Icon: Flame,
    colorVar: "var(--primary-500)",
    accentClass: "text-orange-500",
    iconBgClass: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    glowColor: "rgba(249, 115, 22, 0.35)",
  },
  [MuscleGroup.Forearms]: {
    label: "Forearms",
    labelKey: "exercises:muscleGroups.forearms",
    group: "upperBody",
    tag: "Upper",
    tagKey: "exercises:categoryTags.upper",
    sublabel: "Grip Strength & Wrist Control",
    sublabelKey: "exercises:muscleSublabels.forearms",
    Icon: Hand,
    colorVar: "var(--secondary-500)",
    accentClass: "text-indigo-400",
    iconBgClass: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    glowColor: "rgba(129, 140, 248, 0.35)",
  },
  [MuscleGroup.Traps]: {
    label: "Traps",
    labelKey: "exercises:muscleGroups.traps",
    group: "upperBody",
    tag: "Upper",
    tagKey: "exercises:categoryTags.upper",
    sublabel: "Upper Back & Shrug Stability",
    sublabelKey: "exercises:muscleSublabels.traps",
    Icon: Triangle,
    colorVar: "var(--secondary-500)",
    accentClass: "text-purple-400",
    iconBgClass: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    glowColor: "rgba(192, 132, 252, 0.35)",
  },
  [MuscleGroup.Quadriceps]: {
    label: "Quads",
    labelKey: "exercises:muscleGroups.quadriceps",
    group: "lowerBody",
    tag: "Lower",
    tagKey: "exercises:categoryTags.lower",
    sublabel: "Knee Extensors & Leg Drive",
    sublabelKey: "exercises:muscleSublabels.quadriceps",
    Icon: TrendingUp,
    colorVar: "var(--primary-400)",
    accentClass: "text-emerald-400",
    iconBgClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    glowColor: "rgba(52, 211, 153, 0.35)",
  },
  [MuscleGroup.Hamstrings]: {
    label: "Hamstrings",
    labelKey: "exercises:muscleGroups.hamstrings",
    group: "lowerBody",
    tag: "Lower",
    tagKey: "exercises:categoryTags.lower",
    sublabel: "Knee Flexors & Posterior Chain",
    sublabelKey: "exercises:muscleSublabels.hamstrings",
    Icon: GitMerge,
    colorVar: "var(--secondary-400)",
    accentClass: "text-teal-400",
    iconBgClass: "bg-teal-500/10 text-teal-400 border-teal-500/20",
    glowColor: "rgba(45, 212, 191, 0.35)",
  },
  [MuscleGroup.Glutes]: {
    label: "Glutes",
    labelKey: "exercises:muscleGroups.glutes",
    group: "lowerBody",
    tag: "Lower",
    tagKey: "exercises:categoryTags.lower",
    sublabel: "Hip Extension & Power",
    sublabelKey: "exercises:muscleSublabels.glutes",
    Icon: Circle,
    colorVar: "var(--primary-300)",
    accentClass: "text-cyan-400",
    iconBgClass: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    glowColor: "rgba(6, 182, 212, 0.35)",
  },
  [MuscleGroup.Calves]: {
    label: "Calves",
    labelKey: "exercises:muscleGroups.calves",
    group: "lowerBody",
    tag: "Lower",
    tagKey: "exercises:categoryTags.lower",
    sublabel: "Ankle Plantarflexion & Push",
    sublabelKey: "exercises:muscleSublabels.calves",
    Icon: Footprints,
    colorVar: "var(--secondary-300)",
    accentClass: "text-amber-400",
    iconBgClass: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    glowColor: "rgba(251, 191, 36, 0.35)",
  },
  [MuscleGroup.Core]: {
    label: "Core",
    labelKey: "exercises:muscleGroups.core",
    group: "coreFull",
    tag: "Core",
    tagKey: "exercises:categoryTags.core",
    sublabel: "Abdominals & Core Stability",
    sublabelKey: "exercises:muscleSublabels.core",
    Icon: Dumbbell,
    colorVar: "var(--primary-500)",
    accentClass: "text-rose-400",
    iconBgClass: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    glowColor: "rgba(251, 113, 133, 0.35)",
  },
  [MuscleGroup.LowerBack]: {
    label: "Lower Back",
    labelKey: "exercises:muscleGroups.lowerBack",
    group: "coreFull",
    tag: "Core",
    tagKey: "exercises:categoryTags.core",
    sublabel: "Erector Spinae & Posterior",
    sublabelKey: "exercises:muscleSublabels.lowerBack",
    Icon: ArrowDown,
    colorVar: "var(--primary-400)",
    accentClass: "text-indigo-400",
    iconBgClass: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    glowColor: "rgba(129, 140, 248, 0.35)",
  },
  [MuscleGroup.FullBody]: {
    label: "Full Body",
    labelKey: "exercises:muscleGroups.fullBody",
    group: "coreFull",
    tag: "Core",
    tagKey: "exercises:categoryTags.core",
    sublabel: "Compound Kinetic Chain",
    sublabelKey: "exercises:muscleSublabels.fullBody",
    Icon: Star,
    colorVar: "var(--secondary-400)",
    accentClass: "text-amber-400",
    iconBgClass: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    glowColor: "rgba(251, 191, 36, 0.35)",
  },
};

export function getMuscleGroupLabel(
  group: MuscleGroup | number | null | undefined,
  t?: (key: string, options?: any) => string,
): string {
  if (group == null) return "";
  const meta = MUSCLE_GROUP_META[group as MuscleGroup];
  if (!meta) return String(group);
  return t ? t(meta.labelKey, { defaultValue: meta.label }) : meta.label;
}

export function getMuscleGroupTag(
  group: MuscleGroup | number | null | undefined,
  t?: (key: string, options?: any) => string,
): string {
  if (group == null) return "";
  const meta = MUSCLE_GROUP_META[group as MuscleGroup];
  if (!meta) return "";
  return t ? t(meta.tagKey, { defaultValue: meta.tag }) : meta.tag;
}

export function getMuscleGroupSublabel(
  group: MuscleGroup | number | null | undefined,
  t?: (key: string, options?: any) => string,
): string {
  if (group == null) return "";
  const meta = MUSCLE_GROUP_META[group as MuscleGroup];
  if (!meta) return "";
  return t ? t(meta.sublabelKey, { defaultValue: meta.sublabel }) : meta.sublabel;
}

export function getMuscleGroupOptions(t?: (key: string, options?: any) => string) {
  return Object.entries(MUSCLE_GROUP_META).map(([value, meta]) => ({
    value,
    label: t ? t(meta.labelKey, { defaultValue: meta.label }) : meta.label,
  }));
}

export const MUSCLE_GROUP_OPTIONS = Object.entries(MUSCLE_GROUP_META).map(
  ([value, meta]) => ({ value, label: meta.label }),
);
