import { apiClient } from './client';
import { rethrowAsApiError, unwrapApiData } from './http';
import type { AnalyzeRequest, IntelligenceAnalyzeResponse } from './types';

const ANALYZE_TIMEOUT_MS = 90_000;

export async function analyzeOpportunitySource(
  sourceId: string,
  input: AnalyzeRequest,
): Promise<IntelligenceAnalyzeResponse> {
  try {
    const result = await apiClient.POST(
      '/api/opportunity-sources/{source_id}/analyze',
      {
        params: { path: { source_id: sourceId } },
        body: input,
        signal: AbortSignal.timeout(ANALYZE_TIMEOUT_MS),
      },
    );

    return unwrapApiData(result);
  } catch (error) {
    rethrowAsApiError(error);
  }
}
