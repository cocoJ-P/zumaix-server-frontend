import { apiClient } from './client';
import { rethrowAsApiError, unwrapApiData } from './http';
import type {
  DiscoveryDisposition,
  DiscoveryUserStateListResponse,
} from './types';

const FEEDBACK_TIMEOUT_MS = 15_000;

export async function listDiscoveryUserStates(params: {
  disposition?: DiscoveryDisposition;
  seen?: boolean;
  limit?: number;
  offset?: number;
}): Promise<DiscoveryUserStateListResponse> {
  try {
    const result = await apiClient.GET('/api/discovery-user-states', {
      params: {
        query: {
          disposition: params.disposition,
          seen: params.seen,
          limit: params.limit ?? 20,
          offset: params.offset ?? 0,
        },
      },
      signal: AbortSignal.timeout(FEEDBACK_TIMEOUT_MS),
    });

    return unwrapApiData(result);
  } catch (error) {
    rethrowAsApiError(error);
  }
}
