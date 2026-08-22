export type UserRole =
  | "Admin"
  | "SwimmingCoach"
  | "FitnessCoach"
  | "NutritionSpecialist"
  | "Athlete";

export interface AuthUser {
  userId: string;
  fullName: string;
  email: string;
  roles: UserRole[];
  phoneNumber?: string | null;
  medicalNotes?: string | null;
  emergencyContact?: string | null;
  dateOfBirth?: string | null;
  gender?: number | null;
  profilePictureUrl?: string | null;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiration: string;
}

export type LoginResponse = AuthTokens & AuthUser;

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RefreshPayload {
  refreshToken: string;
}

export interface LogoutPayload {
  refreshToken: string;
}

export type { LoginFormValues } from "../constants/validations";
