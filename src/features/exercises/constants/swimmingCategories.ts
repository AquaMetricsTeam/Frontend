import { Waves, RefreshCw, Fish, Feather, Rocket, RotateCcw, Eye, Footprints, GitMerge, Layers, Settings, Wind, Clock, Zap, Target, Activity, Flame, Shuffle, Globe, Moon } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SwimmingExerciseCategory } from "../types/index";

export interface SwimmingCategoryMeta {
  label: string;
  Icon: LucideIcon;
  colorVar: string;
}

export const SWIMMING_CATEGORY_META: Record<SwimmingExerciseCategory, SwimmingCategoryMeta> = {
  [SwimmingExerciseCategory.Freestyle]: { label: "Freestyle", Icon: Waves, colorVar: "var(--primary-400)" },
  [SwimmingExerciseCategory.Backstroke]: { label: "Backstroke", Icon: RefreshCw, colorVar: "var(--secondary-400)" },
  [SwimmingExerciseCategory.Breaststroke]: { label: "Breaststroke", Icon: Fish, colorVar: "var(--primary-300)" },
  [SwimmingExerciseCategory.Butterfly]: { label: "Butterfly", Icon: Feather, colorVar: "var(--secondary-300)" },
  [SwimmingExerciseCategory.Starts]: { label: "Starts", Icon: Rocket, colorVar: "var(--primary-500)" },
  [SwimmingExerciseCategory.Turns]: { label: "Turns", Icon: RotateCcw, colorVar: "var(--secondary-500)" },
  [SwimmingExerciseCategory.Underwater]: { label: "Underwater", Icon: Eye, colorVar: "var(--primary-400)" },
  [SwimmingExerciseCategory.Kicking]: { label: "Kicking", Icon: Footprints, colorVar: "var(--secondary-400)" },
  [SwimmingExerciseCategory.Pulling]: { label: "Pulling", Icon: GitMerge, colorVar: "var(--primary-300)" },
  [SwimmingExerciseCategory.Drills]: { label: "Drills", Icon: Layers, colorVar: "var(--secondary-300)" },
  [SwimmingExerciseCategory.Technique]: { label: "Technique", Icon: Settings, colorVar: "var(--primary-500)" },
  [SwimmingExerciseCategory.Breathing]: { label: "Breathing", Icon: Wind, colorVar: "var(--secondary-500)" },
  [SwimmingExerciseCategory.Endurance]: { label: "Endurance", Icon: Clock, colorVar: "var(--primary-400)" },
  [SwimmingExerciseCategory.Sprint]: { label: "Sprint", Icon: Zap, colorVar: "var(--secondary-400)" },
  [SwimmingExerciseCategory.RacePace]: { label: "Race Pace", Icon: Target, colorVar: "var(--primary-300)" },
  [SwimmingExerciseCategory.Aerobic]: { label: "Aerobic", Icon: Activity, colorVar: "var(--secondary-300)" },
  [SwimmingExerciseCategory.Anaerobic]: { label: "Anaerobic", Icon: Flame, colorVar: "var(--primary-500)" },
  [SwimmingExerciseCategory.IndividualMedley]: { label: "Indiv. Medley", Icon: Shuffle, colorVar: "var(--secondary-500)" },
  [SwimmingExerciseCategory.OpenWater]: { label: "Open Water", Icon: Globe, colorVar: "var(--primary-400)" },
  [SwimmingExerciseCategory.Recovery]: { label: "Recovery", Icon: Moon, colorVar: "var(--secondary-400)" },
};

export const SWIMMING_CATEGORY_OPTIONS = Object.entries(SWIMMING_CATEGORY_META).map(
  ([value, meta]) => ({ value, label: meta.label }),
);
