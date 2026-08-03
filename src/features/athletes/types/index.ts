// ─── Admin API shape: GET /users/athletes ────────────────────────────────────

export interface AdminAthleteCoach {
  assignmentId: number;
  coachId: string;
  coachName: string;
  role: string;
}

export interface AdminAthlete {
  id: string;
  athleteId: string;
  fullName: string;
  profilePictureUrl: string | null;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  assignedCoaches: AdminAthleteCoach[];
}

export interface AdminAthletesPaginatedResponse {
  items: AdminAthlete[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

// ─── Coach API shape: GET /athletes ──────────────────────────────────────────

export type Gender = 1 | 2 | 3; // 1=Male, 2=Female, 3=Unknown
export type RegistrationStatus = 1 | 2 | 3; // 1=Active, 2=Pending, 3=Inactive

export interface CoachAthlete {
  fullName: string;
  email: string;
  gender: Gender;
  age: number;
  registrationStatus: RegistrationStatus;
  groupNames: string[];
  coachNames: string[];
}

export interface CoachAthletesPaginatedResponse {
  items: CoachAthlete[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

// ─── Shared params ────────────────────────────────────────────────────────────

export interface FetchAthletesParams {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
}

// ─── Mutation payloads ────────────────────────────────────────────────────────

export interface AssignCoachPayload {
  athleteId: string;
  coachId: string;
}

export interface RemoveCoachAssignmentPayload {
  athleteId: string;
  assignmentId: number;
}
