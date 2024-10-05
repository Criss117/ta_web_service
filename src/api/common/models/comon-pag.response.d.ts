export type CommonPagResponse<T = any> = {
  statusCode: number;
  message: string;
  data?: {
    nextPage: number;
    prevPage: number;
    totalItems: number;
    totalPages: number;
    items: T;
  };
  error?: string;
};
