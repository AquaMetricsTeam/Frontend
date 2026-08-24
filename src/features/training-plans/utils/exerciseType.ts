import type { PlanExercise } from "../types/index";

export function isSwimmingExercise(
  ex?: {
    exerciseId?: number;
    exerciseName?: string | null;
    title?: string | null;
    category?: number | null;
    muscleGroup?: number | null;
  } | null,
  lookup?: {
    category?: number | null;
    muscleGroup?: number | null;
    title?: string | null;
  } | null,
  isSwimmingCoachDefault?: boolean,
): boolean {
  if (!ex && !lookup) return Boolean(isSwimmingCoachDefault);

  // 1. Explicit muscleGroup (> 0) => ALWAYS Fitness (Reps)
  const muscleGroup = ex?.muscleGroup ?? lookup?.muscleGroup;
  if (muscleGroup != null && Number(muscleGroup) > 0) {
    return false;
  }

  // 2. Explicit swimming category (> 0) => ALWAYS Swimming (Meters)
  const category = ex?.category ?? lookup?.category;
  if (category != null && Number(category) > 0) {
    return true;
  }

  // 3. Match known keywords in title
  const title = (
    ex?.exerciseName ||
    ex?.title ||
    lookup?.title ||
    ""
  ).toLowerCase();

  const swimKeywords = [
    "swim",
    "freestyle",
    "backstroke",
    "breaststroke",
    "butterfly",
    "kicking",
    "pulling",
    "drill",
    "underwater",
    "im",
    "medley",
    "stroke",
    "open water",
    "turn",
    "start",
    "recovery",
  ];

  const fitnessKeywords = [
    "barbell",
    "dumbbell",
    "pulldown",
    "press",
    "row",
    "squat",
    "deadlift",
    "curl",
    "pushup",
    "push up",
    "pullup",
    "pull up",
    "lunge",
    "plank",
    "bench",
    "chest",
    "bicep",
    "tricep",
    "quad",
    "hamstring",
    "glute",
    "crunch",
    "lat",
    "overhead",
    "extension",
    "cable",
    "machine",
  ];

  if (swimKeywords.some((k) => title.includes(k))) return true;
  if (fitnessKeywords.some((k) => title.includes(k))) return false;

  // 4. Default to coach role or false
  return Boolean(isSwimmingCoachDefault);
}

export function isSwimmingPlan(
  exercises: (PlanExercise | {
    exerciseId?: number;
    exerciseName?: string | null;
    title?: string | null;
    category?: number | null;
    muscleGroup?: number | null;
  })[],
  lookupMap?: Map<number, { category?: number | null; muscleGroup?: number | null; title?: string | null }>,
  isSwimmingCoachDefault?: boolean,
): boolean {
  if (!exercises || exercises.length === 0) {
    return Boolean(isSwimmingCoachDefault);
  }

  const swimCount = exercises.filter((ex) =>
    isSwimmingExercise(ex, ex.exerciseId ? lookupMap?.get(ex.exerciseId) : null, isSwimmingCoachDefault),
  ).length;

  return swimCount > exercises.length / 2;
}
