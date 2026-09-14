import { apiClient } from './client';
import { rethrowAsApiError, unwrapApiData } from './http';
import type { OpportunityListItem } from './types';

const OPPORTUNITY_TIMEOUT_MS = 15_000;

export async function listOpportunities(): Promise<OpportunityListItem[]> {
  try {
    const result = await apiClient.GET('/api/opportunities', {
      signal: AbortSignal.timeout(OPPORTUNITY_TIMEOUT_MS),
    });

    return unwrapApiData(result);
  } catch (error) {
    rethrowAsApiError(error);
  }
}
