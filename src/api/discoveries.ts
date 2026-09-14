import { apiClient } from './client';
import { rethrowAsApiError, unwrapApiData } from './http';
import type {
  CreateDiscoveryInput,
  CreateManualDiscoveryRequest,
  CreateOpportunityDiscoveryRequest,
  CreateSourceDiscoveryRequest,
  DiscoveryItemDetail,
  DiscoveryItemListResponse,
  DiscoveryStatus,
} from './types';

const DISCOVERY_TIMEOUT_MS = 15_000;

function emptyToNull(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export async function listDiscoveries(params: {
  status?: DiscoveryStatus;
  limit?: number;
  offset?: number;
}): Promise<DiscoveryItemListResponse> {
  try {
    const result = await apiClient.GET('/api/discoveries', {
      params: {
        query: {
          status: params.status,
          limit: params.limit ?? 20,
          offset: params.offset ?? 0,
        },
      },
      signal: AbortSignal.timeout(DISCOVERY_TIMEOUT_MS),
    });

    return unwrapApiData(result);
  } catch (error) {
    rethrowAsApiError(error);
  }
}

export async function getDiscovery(
  discoveryId: string,
): Promise<DiscoveryItemDetail> {
  try {
    const result = await apiClient.GET('/api/discoveries/{discovery_id}', {
      params: { path: { discovery_id: discoveryId } },
      signal: AbortSignal.timeout(DISCOVERY_TIMEOUT_MS),
    });

    return unwrapApiData(result);
  } catch (error) {
    rethrowAsApiError(error);
  }
}

export async function createOpportunityDiscovery(
  input: Omit<CreateOpportunityDiscoveryRequest, 'reference_type'> & {
    reference_type?: 'opportunity';
  },
): Promise<DiscoveryItemDetail> {
  try {
    const result = await apiClient.POST('/api/discoveries', {
      body: {
        reference_type: 'opportunity',
        opportunity_id: input.opportunity_id,
        reason: emptyToNull(input.reason),
        priority: input.priority,
      },
      signal: AbortSignal.timeout(DISCOVERY_TIMEOUT_MS),
    });

    return unwrapApiData(result);
  } catch (error) {
    rethrowAsApiError(error);
  }
}

export async function createSourceDiscovery(
  input: Omit<CreateSourceDiscoveryRequest, 'reference_type'> & {
    reference_type?: 'source';
  },
): Promise<DiscoveryItemDetail> {
  try {
    const result = await apiClient.POST('/api/discoveries', {
      body: {
        reference_type: 'source',
        source_id: input.source_id,
        reason: emptyToNull(input.reason),
        priority: input.priority,
      },
      signal: AbortSignal.timeout(DISCOVERY_TIMEOUT_MS),
    });

    return unwrapApiData(result);
  } catch (error) {
    rethrowAsApiError(error);
  }
}

export async function createManualDiscovery(
  input: Omit<CreateManualDiscoveryRequest, 'reference_type'> & {
    reference_type?: 'manual';
  },
): Promise<DiscoveryItemDetail> {
  try {
    const result = await apiClient.POST('/api/discoveries', {
      body: {
        reference_type: 'manual',
        title: input.title.trim(),
        summary: emptyToNull(input.summary),
        reason: emptyToNull(input.reason),
        priority: input.priority,
      },
      signal: AbortSignal.timeout(DISCOVERY_TIMEOUT_MS),
    });

    return unwrapApiData(result);
  } catch (error) {
    rethrowAsApiError(error);
  }
}

export async function createDiscovery(
  input: CreateDiscoveryInput,
): Promise<DiscoveryItemDetail> {
  if (input.reference_type === 'opportunity') {
    return createOpportunityDiscovery(input);
  }

  if (input.reference_type === 'source') {
    return createSourceDiscovery(input);
  }

  return createManualDiscovery(input);
}

export async function withdrawDiscovery(
  discoveryId: string,
): Promise<DiscoveryItemDetail> {
  try {
    const result = await apiClient.POST(
      '/api/discoveries/{discovery_id}/withdraw',
      {
        params: { path: { discovery_id: discoveryId } },
        signal: AbortSignal.timeout(DISCOVERY_TIMEOUT_MS),
      },
    );

    return unwrapApiData(result);
  } catch (error) {
    try {
      const current = await getDiscovery(discoveryId);
      if (current.status === 'withdrawn') {
        return current;
      }
    } catch {
      // Keep the original withdraw error.
    }

    rethrowAsApiError(error);
  }
}
