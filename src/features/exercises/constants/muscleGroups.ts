import { Dumbbell, Heart, ChevronUp, Zap, Flame, Hand, Footprints, GitMerge, Circle, TrendingUp, Shield, Triangle, ArrowDown, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { MuscleGroup } from "../types/index";

export interface MuscleGroupMeta {
  label: string;
  Icon: LucideIcon;
  colorVar: string;
}

export const MUSCLE_GROUP_META: Record<MuscleGroup, MuscleGroupMeta> = {
  [MuscleGroup.Chest]: { label: "Chest", Icon: Heart, colorVar: "var(--primary-400)" },
  [MuscleGroup.Back]: { label: "Back", Icon: Shield, colorVar: "var(--secondary-400)" },
  [MuscleGroup.Shoulders]: { label: "Shoulders", Icon: ChevronUp, colorVar: "var(--primary-300)" },
  [MuscleGroup.Biceps]: { label: "Biceps", Icon: Zap, colorVar: "var(--secondary-300)" },
  [MuscleGroup.Triceps]: { label: "Triceps", Icon: Flame, colorVar: "var(--primary-500)" },
  [MuscleGroup.Forearms]: { label: "Forearms", Icon: Hand, colorVar: "var(--secondary-500)" },
  [MuscleGroup.Quadriceps]: { label: "Quads", Icon: TrendingUp, colorVar: "var(--primary-400)" },
  [MuscleGroup.Hamstrings]: { label: "Hamstrings", Icon: GitMerge, colorVar: "var(--secondary-400)" },
  [MuscleGroup.Glutes]: { label: "Glutes", Icon: Circle, colorVar: "var(--primary-300)" },
  [MuscleGroup.Calves]: { label: "Calves", Icon: Footprints, colorVar: "var(--secondary-300)" },
  [MuscleGroup.Core]: { label: "Core", Icon: Dumbbell, colorVar: "var(--primary-500)" },
  [MuscleGroup.Traps]: { label: "Traps", Icon: Triangle, colorVar: "var(--secondary-500)" },
  [MuscleGroup.LowerBack]: { label: "Lower Back", Icon: ArrowDown, colorVar: "var(--primary-400)" },
  [MuscleGroup.FullBody]: { label: "Full Body", Icon: Star, colorVar: "var(--secondary-400)" },
};

export const MUSCLE_GROUP_OPTIONS = Object.entries(MUSCLE_GROUP_META).map(
  ([value, meta]) => ({ value, label: meta.label }),
);
