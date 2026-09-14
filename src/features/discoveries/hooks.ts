import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createDiscovery,
  getDiscovery,
  listDiscoveries,
  withdrawDiscovery,
} from '../../api/discoveries';
import { listOpportunities } from '../../api/opportunities';
import { listAvailableSources } from '../../api/sources';
import type { CreateDiscoveryInput, DiscoveryStatus } from '../../api/types';

export const DISCOVERIES_QUERY_KEY = ['discoveries'] as const;
export const OPPORTUNITIES_QUERY_KEY = ['opportunities'] as const;
export const OPPORTUNITY_SOURCES_QUERY_KEY = ['opportunity-sources'] as const;

export function useDiscoveries(
  filters: {
    status: DiscoveryStatus;
    limit: number;
    offset: number;
  },
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: [...DISCOVERIES_QUERY_KEY, 'list', filters],
    queryFn: () => listDiscoveries(filters),
    enabled: options?.enabled ?? true,
    staleTime: 10_000,
    retry: 1,
    refetchOnWindowFocus: true,
  });
}

export function useDiscovery(discoveryId: string | null) {
  return useQuery({
    queryKey: [...DISCOVERIES_QUERY_KEY, 'detail', discoveryId],
    queryFn: () => {
      if (!discoveryId) {
        throw new Error('Missing discovery id');
      }

      return getDiscovery(discoveryId);
    },
    enabled: Boolean(discoveryId),
    staleTime: 10_000,
    retry: 1,
    refetchOnWindowFocus: true,
  });
}

export function useCreateDiscovery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateDiscoveryInput) => createDiscovery(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: DISCOVERIES_QUERY_KEY });
    },
  });
}

export function useWithdrawDiscovery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (discoveryId: string) => withdrawDiscovery(discoveryId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: DISCOVERIES_QUERY_KEY });
    },
  });
}

export function useOpportunities() {
  return useQuery({
    queryKey: [...OPPORTUNITIES_QUERY_KEY, 'list'],
    queryFn: listOpportunities,
    staleTime: 10_000,
    retry: 1,
    refetchOnWindowFocus: true,
  });
}

export function useSourcePickerItems() {
  return useQuery({
    queryKey: [...OPPORTUNITY_SOURCES_QUERY_KEY, 'picker'],
    queryFn: listAvailableSources,
    staleTime: 10_000,
    retry: 1,
    refetchOnWindowFocus: true,
  });
}
