import { listOpportunities } from './opportunities';
import { apiClient } from './client';
import { rethrowAsApiError, unwrapApiData } from './http';
import type { OpportunitySourceResponse } from './types';

const SOURCE_TIMEOUT_MS = 15_000;

export async function listOpportunitySources(
  opportunityId: string,
): Promise<OpportunitySourceResponse[]> {
  try {
    const result = await apiClient.GET(
      '/api/opportunities/{opportunity_id}/sources',
      {
        params: { path: { opportunity_id: opportunityId } },
        signal: AbortSignal.timeout(SOURCE_TIMEOUT_MS),
      },
    );

    return unwrapApiData(result);
  } catch (error) {
    rethrowAsApiError(error);
  }
}

export async function listAvailableSources(): Promise<
  OpportunitySourceResponse[]
> {
  const opportunities = await listOpportunities();
  const results = await Promise.allSettled(
    opportunities.map((item) => listOpportunitySources(item.id)),
  );

  const sources: OpportunitySourceResponse[] = [];
  const seen = new Set<string>();
  let firstRejection: unknown = null;
  let fulfilledCount = 0;

  for (const result of results) {
    if (result.status === 'fulfilled') {
      fulfilledCount += 1;
      for (const source of result.value) {
        if (seen.has(source.id)) {
          continue;
        }
        seen.add(source.id);
        sources.push(source);
      }
      continue;
    }

    firstRejection ??= result.reason;
  }

  if (
    opportunities.length > 0 &&
    fulfilledCount === 0 &&
    firstRejection != null
  ) {
    rethrowAsApiError(firstRejection);
  }

  return sources;
}
