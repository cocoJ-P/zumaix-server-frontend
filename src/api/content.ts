import { apiClient } from './client';
import { rethrowAsApiError, unwrapApiData } from './http';
import type { IngestRequest, IngestResponse } from './types';

const INGEST_TIMEOUT_MS = 30_000;

export async function ingestContent(
  input: IngestRequest,
): Promise<IngestResponse> {
  try {
    const result = await apiClient.POST('/api/content/ingest', {
      body: input,
      signal: AbortSignal.timeout(INGEST_TIMEOUT_MS),
    });

    return unwrapApiData(result);
  } catch (error) {
    rethrowAsApiError(error);
  }
}
