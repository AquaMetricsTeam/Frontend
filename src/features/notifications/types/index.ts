export const NotificationType = {
  AccountCreated: 1,
  TrainingAssigned: 2,
  NutritionAssigned: 3,
  AssessmentRecorded: 4,
  AttendanceRecorded: 5,
  AIRecommendationReady: 6,
  SystemAnnouncement: 7,
  GroupAssigned: 8,
  InjuryOccured: 9,
  TrainingSessionAssigned: 10,
  CoachAssigned: 11,
  CoachRemoved: 12,
} as const;

export type NotificationType = typeof NotificationType[keyof typeof NotificationType];

export interface NotificationResponse {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface GetNotificationsParams {
  page?: number;
  pageSize?: number;
}

export interface NotificationsPaginatedResponse {
  items: NotificationResponse[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPrevious?: boolean;
  hasNext?: boolean;
}
