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

export interface CoachAthleteCoach {
  assignmentId?: number;
  coachId?: string;
  coachName?: string;
  name?: string;
  role?: string;
}

export interface CoachAthlete {
  id?: string;
  athleteId?: string;
  fullName: string;
  email: string;
  gender: Gender;
  age: number;
  registrationStatus: RegistrationStatus;
  groupNames: string[];
  coachNames?: string[];
  coaches?: CoachAthleteCoach[] | string[];
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

// ─── Athlete Overview API Shapes: GET /athletes/{athleteId}/... ───────────────

export interface AthleteOverviewGroupResponse {
  id: number;
  name: string;
  domainId: number;
  domainName: string;
}

export interface AthleteOverviewCoachResponse {
  coachId: string;
  coachName: string;
  profilePictureUrl?: string | null;
  domainId: number;
  domainName: string;
}

export interface AthleteOverviewSwimmingSessionResponse {
  id: number;
  title: string;
  description?: string | null;
  sessionDate: string;
  startTime: string;
  endTime: string;
  location?: string | null;
  notes?: string | null;
  trainingPlanId: number;
  trainingPlanTitle: string;
  coachId: string;
  coachName: string;
  attended: boolean;
}

export interface AthleteOverviewFitnessSessionResponse {
  id: number;
  title: string;
  description?: string | null;
  sessionDate: string;
  startTime: string;
  endTime: string;
  location?: string | null;
  notes?: string | null;
  trainingPlanId: number;
  trainingPlanTitle: string;
  coachId: string;
  coachName: string;
  attended: boolean;
}

export interface AthleteOverviewResponse {
  id: string;
  fullName: string;
  email: string;
  profilePictureUrl?: string | null;
  gender: string | number;
  dateOfBirth: string;
  age: number;
  registrationStatus: string | number;
  emergencyContact?: string | null;
  medicalNotes?: string | null;
  groups: AthleteOverviewGroupResponse[];
  coaches: AthleteOverviewCoachResponse[];
  swimmingSessions: number;
  fitnessSessions: number;
}

export interface AthleteOverviewNutritionPlanResponse {
  id: number;
  title: string;
  dailyCalories: number;
  proteinGrams: number;
  carbGrams: number;
  fatGrams: number;
}

export interface AthleteOverviewTrainingPlanResponse {
  id: number;
  title: string;
  objectives?: string | null;
  description?: string | null;
  estimatedDurationMinutes?: number | null;
  source?: number | string | null;
  planSource?: string | null;
  approvalStatus?: number | string | null;
  domainId?: number;
  domainName?: string;
  createdById?: string;
  createdByName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AthleteOverviewTrainingPlansResponse {
  trainingPlans: AthleteOverviewTrainingPlanResponse[];
  nutritionPlan?: AthleteOverviewNutritionPlanResponse | null;
}

export interface AthleteOverviewPerformancePointResponse {
  trainingRecordId: number;
  trainingSessionId: number;
  sessionDate: string;
  sessionTitle: string;
  domainId: number;
  value: number;
}

export interface AthleteOverviewPerformanceResponse {
  performanceTrend: AthleteOverviewPerformancePointResponse[];
  fatigueTrend: AthleteOverviewPerformancePointResponse[];
  totalSessions: number;
  completedSessions: number;
  injuredSessions: number;
  averagePerformanceRating: number;
  averageFatigueLevel: number;
}

