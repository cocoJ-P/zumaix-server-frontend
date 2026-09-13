import { ApiError, normalizeApiError } from './errors';

export function readResponseStatus(result: {
  response?: { status?: number };
}): number | null {
  return typeof result.response?.status === 'number'
    ? result.response.status
    : null;
}

export function unwrapApiData<T>(result: {
  data?: T;
  error?: unknown;
  response?: { status?: number };
}): T {
  if (!result.data) {
    throw normalizeApiError(
      result.error ?? new Error('Empty API response'),
      readResponseStatus(result),
    );
  }

  return result.data;
}

export function rethrowAsApiError(error: unknown): never {
  if (error instanceof ApiError) {
    throw error;
  }

  throw normalizeApiError(error);
}
