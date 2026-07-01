export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

export interface ApiError {
  success: false;
  message: string;
  data: null;
}
