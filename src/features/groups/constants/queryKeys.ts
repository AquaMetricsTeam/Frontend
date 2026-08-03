export const GROUP_KEYS = {
  all: ["groups"] as const,
  list: (params: {
    pageNumber?: number;
    pageSize?: number;
    search?: string;
    includeArchived?: boolean;
    onlyArchived?: boolean;
  }) => [...GROUP_KEYS.all, "list", params] as const,

  detail: (id: number) => [...GROUP_KEYS.all, "detail", id] as const,
  members: (groupId: number) =>
    [...GROUP_KEYS.all, "members", groupId] as const,
  availableAthletes: ["groups", "available-athletes"] as const,
} as const;
