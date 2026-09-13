import { apiClient } from './client';
import { rethrowAsApiError, unwrapApiData } from './http';
import type { CurrentIdentityResponse } from './types';

const IDENTITY_TIMEOUT_MS = 10_000;

export async function getCurrentIdentity(): Promise<CurrentIdentityResponse> {
  try {
    const result = await apiClient.GET('/api/me', {
      signal: AbortSignal.timeout(IDENTITY_TIMEOUT_MS),
    });

    return unwrapApiData(result);
  } catch (error) {
    rethrowAsApiError(error);
  }
}
