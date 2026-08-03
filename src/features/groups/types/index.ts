export interface Group {
  id: number;
  domainId: number;
  name: string;
  description: string | null;
  isArchived: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  athleteCount: number;
}

export interface GroupMember {
  athleteId: string;
  fullName: string;
  email: string;
  profilePictureUrl: string | null;
  registrationStatus: number;
  joinedAt: string;
}

export interface AvailableAthlete {
  athleteId: string;
  fullName: string;
}

export interface GroupsPaginatedResponse {
  items: Group[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface FetchGroupsParams {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  includeArchived?: boolean;
  onlyArchived?: boolean;
}

export interface CreateGroupPayload {
  name: string;
  description?: string;
}

export interface UpdateGroupPayload {
  name: string;
  description?: string;
}

export interface AssignAthletesPayload {
  athleteIds: string[];
}
