declare global {
  /**
   * Generic API Response wrapper matching backend response structure
   */
  type ApiResponse<TData = unknown> = {
    data: TData;
    message?: string;
    status?: number;
    success?: boolean;
    meta?: {
      page?: number;
      limit?: number;
      total?: number;
      pageCount?: number;
    };
  };

  /**
   * Paginated data envelope helper
   */
  type ApiPaginatedData<TItem = unknown> = {
    items: TItem[];
    total: number;
    page: number;
    limit: number;
    pageCount: number;
  };
}

export {};
