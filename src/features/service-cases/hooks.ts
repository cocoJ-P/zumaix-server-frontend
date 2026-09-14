import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getServiceCase, listServiceCases } from '../../api/serviceCases';
import type { ServiceCaseStatus } from '../../api/types';

export const SERVICE_CASES_QUERY_KEY = ['service-cases'] as const;

export function useServiceCases(
  filters: {
    status?: ServiceCaseStatus;
    limit: number;
    offset: number;
  },
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: [...SERVICE_CASES_QUERY_KEY, 'list', filters],
    queryFn: () => listServiceCases(filters),
    enabled: options?.enabled ?? true,
    staleTime: 15_000,
    retry: 1,
    refetchOnWindowFocus: true,
  });
}

export function useServiceCase(serviceCaseId: string | null) {
  return useQuery({
    queryKey: [...SERVICE_CASES_QUERY_KEY, 'detail', serviceCaseId],
    queryFn: () => {
      if (!serviceCaseId) {
        throw new Error('Missing service case id');
      }

      return getServiceCase(serviceCaseId);
    },
    enabled: Boolean(serviceCaseId),
    staleTime: 15_000,
    retry: 1,
    refetchOnWindowFocus: true,
  });
}

export function useRefreshServiceCases() {
  const queryClient = useQueryClient();

  return () =>
    queryClient.invalidateQueries({ queryKey: SERVICE_CASES_QUERY_KEY });
}
