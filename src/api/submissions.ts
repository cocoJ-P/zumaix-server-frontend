import { apiClient } from './client';
import { rethrowAsApiError, unwrapApiData } from './http';
import type {
  SubmissionStatus,
  UserSubmissionDetail,
  UserSubmissionListResponse,
} from './types';

const SUBMISSION_TIMEOUT_MS = 15_000;

export async function listUserSubmissions(params: {
  status?: SubmissionStatus;
  limit?: number;
  offset?: number;
}): Promise<UserSubmissionListResponse> {
  try {
    const result = await apiClient.GET('/api/user-submissions', {
      params: {
        query: {
          status: params.status,
          limit: params.limit ?? 20,
          offset: params.offset ?? 0,
        },
      },
      signal: AbortSignal.timeout(SUBMISSION_TIMEOUT_MS),
    });

    return unwrapApiData(result);
  } catch (error) {
    rethrowAsApiError(error);
  }
}

export async function getUserSubmission(
  submissionId: string,
): Promise<UserSubmissionDetail> {
  try {
    const result = await apiClient.GET('/api/user-submissions/{submission_id}', {
      params: { path: { submission_id: submissionId } },
      signal: AbortSignal.timeout(SUBMISSION_TIMEOUT_MS),
    });

    return unwrapApiData(result);
  } catch (error) {
    rethrowAsApiError(error);
  }
}
