export interface CoachLookupItem {
  id: string;
  fullName: string;
  profilePictureUrl: string | null;
  role: string;
}

export interface AthleteLookupItem {
  athleteId: string;
  fullName: string;
  profilePictureUrl: string | null;
}

export interface GroupLookupItem {
  id: number;
  name: string;
  athleteCount?: number;
}

export interface ExerciseLookupItem {
  id: number;
  title: string;
}

export interface TrainingPlanLookupItem {
  id: number;
  title: string;
}

export interface FetchExercisesLookupParams {
  search?: string;
  muscleGroup?: number | null;
  category?: number | null;
}
