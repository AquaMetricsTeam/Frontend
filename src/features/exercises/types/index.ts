export const MuscleGroup = {
  Chest: 1,
  Back: 2,
  Shoulders: 3,
  Biceps: 4,
  Triceps: 5,
  Forearms: 6,
  Quadriceps: 7,
  Hamstrings: 8,
  Glutes: 9,
  Calves: 10,
  Core: 11,
  Traps: 12,
  LowerBack: 13,
  FullBody: 14,
} as const;

export type MuscleGroup = (typeof MuscleGroup)[keyof typeof MuscleGroup];

export const SwimmingExerciseCategory = {
  Freestyle: 1,
  Backstroke: 2,
  Breaststroke: 3,
  Butterfly: 4,
  Starts: 5,
  Turns: 6,
  Underwater: 7,
  Kicking: 8,
  Pulling: 9,
  Drills: 10,
  Technique: 11,
  Breathing: 12,
  Endurance: 13,
  Sprint: 14,
  RacePace: 15,
  Aerobic: 16,
  Anaerobic: 17,
  IndividualMedley: 18,
  OpenWater: 19,
  Recovery: 20,
} as const;

export type SwimmingExerciseCategory =
  (typeof SwimmingExerciseCategory)[keyof typeof SwimmingExerciseCategory];

export interface Exercise {
  id: number;
  title: string;
  description: string | null;
  muscleGroup: MuscleGroup | null;
  category: SwimmingExerciseCategory | null;
  isArchived: boolean;
}

export interface ExercisesPaginatedResponse {
  items: Exercise[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface FetchExercisesParams {
  page?: number;
  pageSize?: number;
  search?: string;
  muscleGroup?: MuscleGroup;
  category?: SwimmingExerciseCategory;
  includeArchived?: boolean;
  onlyArchived?: boolean;
}

export interface CreateExercisePayload {
  title: string;
  description?: string;
  muscleGroup?: MuscleGroup | null;
  category?: SwimmingExerciseCategory | null;
}

export interface UpdateExercisePayload {
  title: string;
  description?: string;
  muscleGroup?: MuscleGroup | null;
  category?: SwimmingExerciseCategory | null;
}
