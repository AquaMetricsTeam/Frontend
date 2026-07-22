// TMeta can be null if the API not get all
interface ApiResponse<TData = undefined, TMeta = Meta> {
  success: boolean;
  message: string;
  meta: TMeta;
  data: TData;
}

interface Meta {
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}
