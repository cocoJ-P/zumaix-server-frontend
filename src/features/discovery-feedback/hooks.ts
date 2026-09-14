import { useQuery, useQueryClient } from '@tanstack/react-query';
import { listDiscoveryUserStates } from '../../api/discoveryFeedback';
import type { DiscoveryDisposition } from '../../api/types';

export const DISCOVERY_FEEDBACK_QUERY_KEY = ['discovery-feedback'] as const;

export function useDiscoveryFeedback(
  filters: {
    disposition?: DiscoveryDisposition;
    seen?: boolean;
    limit: number;
    offset: number;
  },
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: [...DISCOVERY_FEEDBACK_QUERY_KEY, 'list', filters],
    queryFn: () => listDiscoveryUserStates(filters),
    enabled: options?.enabled ?? true,
    staleTime: 15_000,
    retry: 1,
    refetchOnWindowFocus: true,
  });
}

export function useRefreshDiscoveryFeedback() {
  const queryClient = useQueryClient();

  return () =>
    queryClient.invalidateQueries({ queryKey: DISCOVERY_FEEDBACK_QUERY_KEY });
}
