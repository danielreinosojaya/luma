export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  code?: string;
}

export function apiSuccess<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
  };
}

export function apiError(
  error: string,
  code: string = "INTERNAL_ERROR",
  message?: string
): ApiResponse {
  return {
    success: false,
    error,
    code,
    message,
  };
}

export function validationError(
  errors: Record<string, string[]>
): ApiResponse {
  return {
    success: false,
    error: "Validation failed",
    code: "VALIDATION_ERROR",
    data: errors,
  };
}

export class ApiException extends Error {
  constructor(
    public statusCode: number,
    public response: ApiResponse
  ) {
    super(response.error);
    this.name = "ApiException";
  }
}
