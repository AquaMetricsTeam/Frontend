export interface StaffUser {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: StaffRole;
  isActive: boolean;
  emailConfirmed: boolean;
  createdAt: string;
}

export type StaffRole =
  | "Admin"
  | "SwimmingCoach"
  | "FitnessCoach"
  | "NutritionSpecialist"
  | "Athlete";


export interface UsersPaginatedResponse {
  items: StaffUser[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface UpdateUserStatusPayload {
  isActive: boolean;
}

export interface FetchUsersParams {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  role?: string;
  isActive?: boolean;
  sortBy?: string;
  sortDirection?: string;
}

export interface CreateUserPayload {
  fullName: string;
  email: string;
  password: string;
  role: StaffRole;
}

export type { CreateUserFormValues } from "../constants/validations";

