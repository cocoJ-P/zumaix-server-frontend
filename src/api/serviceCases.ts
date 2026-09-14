import { apiClient } from './client';
import { rethrowAsApiError, unwrapApiData } from './http';
import type {
  ServiceCaseDetail,
  ServiceCaseListResponse,
  ServiceCaseStatus,
} from './types';

const SERVICE_CASE_TIMEOUT_MS = 15_000;

export async function listServiceCases(params: {
  status?: ServiceCaseStatus;
  user_id?: string;
  limit?: number;
  offset?: number;
}): Promise<ServiceCaseListResponse> {
  try {
    const result = await apiClient.GET('/api/service-cases', {
      params: {
        query: {
          status: params.status,
          user_id: params.user_id,
          limit: params.limit ?? 20,
          offset: params.offset ?? 0,
        },
      },
      signal: AbortSignal.timeout(SERVICE_CASE_TIMEOUT_MS),
    });

    return unwrapApiData(result);
  } catch (error) {
    rethrowAsApiError(error);
  }
}

export async function getServiceCase(
  serviceCaseId: string,
): Promise<ServiceCaseDetail> {
  try {
    const result = await apiClient.GET('/api/service-cases/{service_case_id}', {
      params: { path: { service_case_id: serviceCaseId } },
      signal: AbortSignal.timeout(SERVICE_CASE_TIMEOUT_MS),
    });

    return unwrapApiData(result);
  } catch (error) {
    rethrowAsApiError(error);
  }
}
