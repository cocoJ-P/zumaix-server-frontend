import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getBackendHealth } from '../api/health';

export const BACKEND_HEALTH_QUERY_KEY = ['backend-health'] as const;

export type BackendConnectionStatus = 'loading' | 'connected' | 'unavailable';

export function useBackendHealth() {
  const hasWarned = useRef(false);

  const query = useQuery({
    queryKey: BACKEND_HEALTH_QUERY_KEY,
    queryFn: getBackendHealth,
    staleTime: 10_000,
    refetchInterval: 30_000,
    retry: 1,
  });

  useEffect(() => {
    if (!import.meta.env.DEV) {
      return;
    }

    if (query.isError && !hasWarned.current) {
      hasWarned.current = true;
      console.warn('无法连接筑脉企服 Backend');
    }

    if (query.isSuccess) {
      hasWarned.current = false;
    }
  }, [query.isError, query.isSuccess]);

  const connectionStatus: BackendConnectionStatus = query.isPending
    ? 'loading'
    : query.isSuccess
      ? 'connected'
      : 'unavailable';

  return {
    ...query,
    connectionStatus,
  };
}
