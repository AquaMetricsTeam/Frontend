export interface Exercise {
  id: number;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
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
}

export interface CreateExercisePayload {
  title: string;
  description?: string;
}

export interface UpdateExercisePayload {
  title: string;
  description?: string;
}
