import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserSubmission, listUserSubmissions } from '../../api/submissions';
import type { SubmissionStatus } from '../../api/types';

export const USER_SUBMISSIONS_QUERY_KEY = ['user-submissions'] as const;

export function useUserSubmissions(filters: {
  status?: SubmissionStatus;
  limit: number;
  offset: number;
}) {
  return useQuery({
    queryKey: [...USER_SUBMISSIONS_QUERY_KEY, 'list', filters],
    queryFn: () => listUserSubmissions(filters),
    staleTime: 15_000,
    retry: 1,
    refetchOnWindowFocus: true,
  });
}

export function useUserSubmission(submissionId: string | null) {
  return useQuery({
    queryKey: [...USER_SUBMISSIONS_QUERY_KEY, 'detail', submissionId],
    queryFn: () => {
      if (!submissionId) {
        throw new Error('Missing submission id');
      }

      return getUserSubmission(submissionId);
    },
    enabled: Boolean(submissionId),
    staleTime: 15_000,
    retry: 1,
    refetchOnWindowFocus: true,
  });
}

export function useRefreshUserSubmissions() {
  const queryClient = useQueryClient();

  return () =>
    queryClient.invalidateQueries({ queryKey: USER_SUBMISSIONS_QUERY_KEY });
}
