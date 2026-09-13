import { apiClient } from './client';
import { ApiError, normalizeApiError } from './errors';
import type { HealthResponse } from './types';

const HEALTH_TIMEOUT_MS = 5_000;

function readResponseStatus(result: {
  response?: { status?: number };
}): number | null {
  return typeof result.response?.status === 'number'
    ? result.response.status
    : null;
}

export async function getBackendHealth(): Promise<HealthResponse> {
  try {
    const result = await apiClient.GET('/api/health', {
      signal: AbortSignal.timeout(HEALTH_TIMEOUT_MS),
    });

    if (!result.data) {
      throw normalizeApiError(
        result.error ?? new Error('Empty health response'),
        readResponseStatus(result),
      );
    }

    return result.data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw normalizeApiError(error);
  }
}
