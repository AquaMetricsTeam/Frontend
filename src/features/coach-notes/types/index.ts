export interface CoachNote {
  id: number | string;
  athleteId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CoachNotesPaginatedResponse {
  items: CoachNote[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface FetchCoachNotesParams {
  athleteId?: string;
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  isMy?: boolean;
}

export interface CreateCoachNotePayload {
  athleteId: string;
  content: string;
}

export interface UpdateCoachNotePayload {
  noteId: number | string;
  content: string;
}
