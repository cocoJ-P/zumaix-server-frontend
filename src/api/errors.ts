export class ApiError extends Error {
  readonly status: number | null;
  readonly code: string;
  readonly details: unknown;

  constructor({
    status,
    code,
    message,
    details,
  }: {
    status?: number | null;
    code: string;
    message: string;
    details?: unknown;
  }) {
    super(message);
    this.name = 'ApiError';
    this.status = status ?? null;
    this.code = code;
    this.details = details ?? null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isAbortError(error: unknown): boolean {
  return (
    (error instanceof DOMException && error.name === 'AbortError') ||
    (error instanceof Error && error.name === 'AbortError')
  );
}

function isNetworkError(error: unknown): boolean {
  if (!(error instanceof TypeError)) {
    return false;
  }

  return /fetch|network|failed/i.test(error.message);
}

function readBackendError(value: unknown): {
  code: string;
  message: string;
  details: unknown;
} | null {
  if (!isRecord(value)) {
    return null;
  }

  const envelope = isRecord(value.error) ? value.error : value;
  const { code, message, details } = envelope;

  if (typeof code === 'string' && typeof message === 'string') {
    return {
      code,
      message,
      details: details ?? null,
    };
  }

  if (Array.isArray(value.detail)) {
    return {
      code: 'VALIDATION_ERROR',
      message: '请求参数不正确',
      details: value.detail,
    };
  }

  return null;
}

export function normalizeApiError(
  error: unknown,
  status?: number | null,
): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (isNetworkError(error) || isAbortError(error)) {
    return new ApiError({
      status: status ?? null,
      code: 'NETWORK_ERROR',
      message: '无法连接筑脉企服 Backend',
    });
  }

  const backendError = readBackendError(error);
  if (backendError) {
    return new ApiError({
      status: status ?? null,
      code: backendError.code,
      message: backendError.message,
      details: backendError.details,
    });
  }

  if (typeof status === 'number' && status >= 500) {
    return new ApiError({
      status,
      code: 'BACKEND_UNAVAILABLE',
      message: '无法连接筑脉企服 Backend',
      details: error,
    });
  }

  return new ApiError({
    status: status ?? null,
    code: 'UNKNOWN_ERROR',
    message: '筑脉企服 Backend 请求失败',
    details: error,
  });
}
