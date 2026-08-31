export class ApiError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class SessionExpiredError extends ApiError {
  constructor() {
    super('Session expired. Please sign in again.', 'SESSION_EXPIRED', 401);
    this.name = 'SessionExpiredError';
  }
}

export class NetworkError extends ApiError {
  constructor(message = 'Network unavailable') {
    super(message, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

export type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: ApiError };

export type PaginatedResponse<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
};
