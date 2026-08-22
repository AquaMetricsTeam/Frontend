import { Waves, RefreshCw, Fish, Feather, Rocket, RotateCcw, Eye, Footprints, GitMerge, Layers, Settings, Wind, Clock, Zap, Target, Activity, Flame, Shuffle, Globe, Moon } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SwimmingExerciseCategory } from "../types/index";

export type SwimmingCategoryGroup = "strokes" | "skills" | "energy";

export interface SwimmingCategoryMeta {
  label: string;
  labelKey: string;
  group: SwimmingCategoryGroup;
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

export const SWIMMING_CATEGORY_META: Record<SwimmingExerciseCategory, SwimmingCategoryMeta> = {
  [SwimmingExerciseCategory.Freestyle]: {
    label: "Freestyle",
    labelKey: "exercises:swimmingCategories.freestyle",
    group: "strokes",
    tag: "Stroke",
    tagKey: "exercises:categoryTags.stroke",
    sublabel: "Front Crawl & Sprint",
    sublabelKey: "exercises:swimmingSublabels.freestyle",
    Icon: Waves,
    colorVar: "var(--primary-400)",
    accentClass: "text-cyan-400",
    iconBgClass: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    glowColor: "rgba(6, 182, 212, 0.35)",
  },
  [SwimmingExerciseCategory.Backstroke]: {
    label: "Backstroke",
    labelKey: "exercises:swimmingCategories.backstroke",
    group: "strokes",
    tag: "Stroke",
    tagKey: "exercises:categoryTags.stroke",
    sublabel: "Supine Stroke & Kick",
    sublabelKey: "exercises:swimmingSublabels.backstroke",
    Icon: RefreshCw,
    colorVar: "var(--secondary-400)",
    accentClass: "text-sky-400",
    iconBgClass: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    glowColor: "rgba(56, 189, 248, 0.35)",
  },
  [SwimmingExerciseCategory.Breaststroke]: {
    label: "Breaststroke",
    labelKey: "exercises:swimmingCategories.breaststroke",
    group: "strokes",
    tag: "Stroke",
    tagKey: "exercises:categoryTags.stroke",
    sublabel: "Whip Kick & Glide",
    sublabelKey: "exercises:swimmingSublabels.breaststroke",
    Icon: Fish,
    colorVar: "var(--primary-300)",
    accentClass: "text-teal-400",
    iconBgClass: "bg-teal-500/10 text-teal-400 border-teal-500/20",
    glowColor: "rgba(45, 212, 191, 0.35)",
  },
  [SwimmingExerciseCategory.Butterfly]: {
    label: "Butterfly",
    labelKey: "exercises:swimmingCategories.butterfly",
    group: "strokes",
    tag: "Stroke",
    tagKey: "exercises:categoryTags.stroke",
    sublabel: "Dolphin & Undulation",
    sublabelKey: "exercises:swimmingSublabels.butterfly",
    Icon: Feather,
    colorVar: "var(--secondary-300)",
    accentClass: "text-blue-400",
    iconBgClass: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    glowColor: "rgba(96, 165, 250, 0.35)",
  },
  [SwimmingExerciseCategory.IndividualMedley]: {
    label: "Indiv. Medley",
    labelKey: "exercises:swimmingCategories.individualMedley",
    group: "strokes",
    tag: "Stroke",
    tagKey: "exercises:categoryTags.stroke",
    sublabel: "Fly / Back / Breast / Free",
    sublabelKey: "exercises:swimmingSublabels.individualMedley",
    Icon: Shuffle,
    colorVar: "var(--secondary-500)",
    accentClass: "text-indigo-400",
    iconBgClass: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    glowColor: "rgba(129, 140, 248, 0.35)",
  },
  [SwimmingExerciseCategory.Starts]: {
    label: "Starts",
    labelKey: "exercises:swimmingCategories.starts",
    group: "skills",
    tag: "Skill",
    tagKey: "exercises:categoryTags.skill",
    sublabel: "Block Takeoff & Reaction",
    sublabelKey: "exercises:swimmingSublabels.starts",
    Icon: Rocket,
    colorVar: "var(--primary-500)",
    accentClass: "text-amber-400",
    iconBgClass: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    glowColor: "rgba(251, 191, 36, 0.35)",
  },
  [SwimmingExerciseCategory.Turns]: {
    label: "Turns",
    labelKey: "exercises:swimmingCategories.turns",
    group: "skills",
    tag: "Skill",
    tagKey: "exercises:categoryTags.skill",
    sublabel: "Flip & Open Turns",
    sublabelKey: "exercises:swimmingSublabels.turns",
    Icon: RotateCcw,
    colorVar: "var(--secondary-500)",
    accentClass: "text-orange-400",
    iconBgClass: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    glowColor: "rgba(251, 146, 60, 0.35)",
  },
  [SwimmingExerciseCategory.Underwater]: {
    label: "Underwater",
    labelKey: "exercises:swimmingCategories.underwater",
    group: "skills",
    tag: "Skill",
    tagKey: "exercises:categoryTags.skill",
    sublabel: "Streamline & Dolphin",
    sublabelKey: "exercises:swimmingSublabels.underwater",
    Icon: Eye,
    colorVar: "var(--primary-400)",
    accentClass: "text-cyan-400",
    iconBgClass: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    glowColor: "rgba(6, 182, 212, 0.35)",
  },
  [SwimmingExerciseCategory.Kicking]: {
    label: "Kicking",
    labelKey: "exercises:swimmingCategories.kicking",
    group: "skills",
    tag: "Skill",
    tagKey: "exercises:categoryTags.skill",
    sublabel: "Flutter & Dolphin Power",
    sublabelKey: "exercises:swimmingSublabels.kicking",
    Icon: Footprints,
    colorVar: "var(--secondary-400)",
    accentClass: "text-emerald-400",
    iconBgClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    glowColor: "rgba(52, 211, 153, 0.35)",
  },
  [SwimmingExerciseCategory.Pulling]: {
    label: "Pulling",
    labelKey: "exercises:swimmingCategories.pulling",
    group: "skills",
    tag: "Skill",
    tagKey: "exercises:categoryTags.skill",
    sublabel: "Catch, Pull & Finish",
    sublabelKey: "exercises:swimmingSublabels.pulling",
    Icon: GitMerge,
    colorVar: "var(--primary-300)",
    accentClass: "text-teal-400",
    iconBgClass: "bg-teal-500/10 text-teal-400 border-teal-500/20",
    glowColor: "rgba(45, 212, 191, 0.35)",
  },
  [SwimmingExerciseCategory.Drills]: {
    label: "Drills",
    labelKey: "exercises:swimmingCategories.drills",
    group: "skills",
    tag: "Skill",
    tagKey: "exercises:categoryTags.skill",
    sublabel: "Form Isolation & Drills",
    sublabelKey: "exercises:swimmingSublabels.drills",
    Icon: Layers,
    colorVar: "var(--secondary-300)",
    accentClass: "text-violet-400",
    iconBgClass: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    glowColor: "rgba(167, 139, 250, 0.35)",
  },
  [SwimmingExerciseCategory.Technique]: {
    label: "Technique",
    labelKey: "exercises:swimmingCategories.technique",
    group: "skills",
    tag: "Skill",
    tagKey: "exercises:categoryTags.skill",
    sublabel: "Form & Body Alignment",
    sublabelKey: "exercises:swimmingSublabels.technique",
    Icon: Settings,
    colorVar: "var(--primary-500)",
    accentClass: "text-purple-400",
    iconBgClass: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    glowColor: "rgba(192, 132, 252, 0.35)",
  },
  [SwimmingExerciseCategory.Breathing]: {
    label: "Breathing",
    labelKey: "exercises:swimmingCategories.breathing",
    group: "skills",
    tag: "Skill",
    tagKey: "exercises:categoryTags.skill",
    sublabel: "Hypoxic & Breathing Pattern",
    sublabelKey: "exercises:swimmingSublabels.breathing",
    Icon: Wind,
    colorVar: "var(--secondary-500)",
    accentClass: "text-teal-300",
    iconBgClass: "bg-teal-400/10 text-teal-300 border-teal-400/20",
    glowColor: "rgba(94, 234, 212, 0.35)",
  },
  [SwimmingExerciseCategory.Endurance]: {
    label: "Endurance",
    labelKey: "exercises:swimmingCategories.endurance",
    group: "energy",
    tag: "Energy",
    tagKey: "exercises:categoryTags.energy",
    sublabel: "Aerobic Capacity & Stamina",
    sublabelKey: "exercises:swimmingSublabels.endurance",
    Icon: Clock,
    colorVar: "var(--primary-400)",
    accentClass: "text-emerald-400",
    iconBgClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    glowColor: "rgba(52, 211, 153, 0.35)",
  },
  [SwimmingExerciseCategory.Sprint]: {
    label: "Sprint",
    labelKey: "exercises:swimmingCategories.sprint",
    group: "energy",
    tag: "Energy",
    tagKey: "exercises:categoryTags.energy",
    sublabel: "Max Speed & Fast Twitch",
    sublabelKey: "exercises:swimmingSublabels.sprint",
    Icon: Zap,
    colorVar: "var(--secondary-400)",
    accentClass: "text-rose-400",
    iconBgClass: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    glowColor: "rgba(251, 113, 133, 0.35)",
  },
  [SwimmingExerciseCategory.RacePace]: {
    label: "Race Pace",
    labelKey: "exercises:swimmingCategories.racePace",
    group: "energy",
    tag: "Energy",
    tagKey: "exercises:categoryTags.energy",
    sublabel: "Goal Pace Conditioning",
    sublabelKey: "exercises:swimmingSublabels.racePace",
    Icon: Target,
    colorVar: "var(--primary-300)",
    accentClass: "text-red-400",
    iconBgClass: "bg-red-500/10 text-red-400 border-red-500/20",
    glowColor: "rgba(248, 113, 113, 0.35)",
  },
  [SwimmingExerciseCategory.Aerobic]: {
    label: "Aerobic",
    labelKey: "exercises:swimmingCategories.aerobic",
    group: "energy",
    tag: "Energy",
    tagKey: "exercises:categoryTags.energy",
    sublabel: "Base Conditioning & Aerobic",
    sublabelKey: "exercises:swimmingSublabels.aerobic",
    Icon: Activity,
    colorVar: "var(--secondary-300)",
    accentClass: "text-green-400",
    iconBgClass: "bg-green-500/10 text-green-400 border-green-500/20",
    glowColor: "rgba(74, 222, 128, 0.35)",
  },
  [SwimmingExerciseCategory.Anaerobic]: {
    label: "Anaerobic",
    labelKey: "exercises:swimmingCategories.anaerobic",
    group: "energy",
    tag: "Energy",
    tagKey: "exercises:categoryTags.energy",
    sublabel: "Lactate & High Intensity",
    sublabelKey: "exercises:swimmingSublabels.anaerobic",
    Icon: Flame,
    colorVar: "var(--primary-500)",
    accentClass: "text-orange-500",
    iconBgClass: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    glowColor: "rgba(249, 115, 22, 0.35)",
  },
  [SwimmingExerciseCategory.OpenWater]: {
    label: "Open Water",
    labelKey: "exercises:swimmingCategories.openWater",
    group: "energy",
    tag: "Energy",
    tagKey: "exercises:categoryTags.energy",
    sublabel: "Sighting, Pack & Distance",
    sublabelKey: "exercises:swimmingSublabels.openWater",
    Icon: Globe,
    colorVar: "var(--primary-400)",
    accentClass: "text-sky-400",
    iconBgClass: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    glowColor: "rgba(56, 189, 248, 0.35)",
  },
  [SwimmingExerciseCategory.Recovery]: {
    label: "Recovery",
    labelKey: "exercises:swimmingCategories.recovery",
    group: "energy",
    tag: "Energy",
    tagKey: "exercises:categoryTags.energy",
    sublabel: "Active Recovery & Flush",
    sublabelKey: "exercises:swimmingSublabels.recovery",
    Icon: Moon,
    colorVar: "var(--secondary-400)",
    accentClass: "text-indigo-300",
    iconBgClass: "bg-indigo-400/10 text-indigo-300 border-indigo-400/20",
    glowColor: "rgba(165, 180, 252, 0.35)",
  },
};

export function getSwimmingCategoryLabel(
  category: SwimmingExerciseCategory | number | null | undefined,
  t?: (key: string, options?: any) => string,
): string {
  if (category == null) return "";
  const meta = SWIMMING_CATEGORY_META[category as SwimmingExerciseCategory];
  if (!meta) return String(category);
  return t ? t(meta.labelKey, { defaultValue: meta.label }) : meta.label;
}

export function getSwimmingCategoryTag(
  category: SwimmingExerciseCategory | number | null | undefined,
  t?: (key: string, options?: any) => string,
): string {
  if (category == null) return "";
  const meta = SWIMMING_CATEGORY_META[category as SwimmingExerciseCategory];
  if (!meta) return "";
  return t ? t(meta.tagKey, { defaultValue: meta.tag }) : meta.tag;
}

export function getSwimmingCategorySublabel(
  category: SwimmingExerciseCategory | number | null | undefined,
  t?: (key: string, options?: any) => string,
): string {
  if (category == null) return "";
  const meta = SWIMMING_CATEGORY_META[category as SwimmingExerciseCategory];
  if (!meta) return "";
  return t ? t(meta.sublabelKey, { defaultValue: meta.sublabel }) : meta.sublabel;
}

export function getSwimmingCategoryOptions(t?: (key: string, options?: any) => string) {
  return Object.entries(SWIMMING_CATEGORY_META).map(([value, meta]) => ({
    value,
    label: t ? t(meta.labelKey, { defaultValue: meta.label }) : meta.label,
  }));
}

export const SWIMMING_CATEGORY_OPTIONS = Object.entries(SWIMMING_CATEGORY_META).map(
  ([value, meta]) => ({ value, label: meta.label }),
);
