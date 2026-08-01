export const USER_KEYS = {
  all: ["users"] as const,
  list: (params: {
    pageNumber?: number;
    pageSize?: number;
    search?: string;
    role?: string;
    isActive?: boolean;
  }) => [...USER_KEYS.all, "list", params] as const,
} as const;
