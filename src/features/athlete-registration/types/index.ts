export interface PendingAthlete {
  athleteId: string;
  fullName: string;
  email: string;
  registrationStatus: string;
  profilePictureUrl: string | null;
  eligibilityDocumentUrl: string | null;
}

export interface ApproveAthleteResponse {
  athleteId: string;
  fullName: string;
  email: string;
  registrationStatus: string;
}

export interface RejectAthleteResponse {
  athleteId: string;
  fullName: string;
  email: string;
  registrationStatus: string;
}

export interface PendingAthletesFilterParams {
  search?: string;
  page?: number;
  pageSize?: number;
}
