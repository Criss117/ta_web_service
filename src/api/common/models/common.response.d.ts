export type CommonResponse<T = any> = {
  statusCode: number;
  message: string;
  data?: T;
  error?: string;
};
