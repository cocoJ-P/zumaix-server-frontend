import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ApiError } from '../api/errors';
import { getCurrentIdentity } from '../api/identity';

export const CURRENT_IDENTITY_QUERY_KEY = ['current-identity'] as const;

const IDENTITY_ERROR_MESSAGE: Record<string, string> = {
  DEV_IDENTITY_REQUIRED: '未配置开发身份',
  INVALID_DEV_USER_ID: '开发身份配置无效',
  AUTHENTICATION_REQUIRED: '当前环境需要身份认证',
  USER_NOT_FOUND: '当前开发用户不存在',
  USER_DISABLED: '当前用户已停用',
  ENTERPRISE_MEMBERSHIP_NOT_FOUND: '当前用户尚未加入企业',
  ENTERPRISE_CONTEXT_REQUIRED: '当前用户关联多个企业，需要选择企业',
};

export function getIdentityErrorMessage(error: ApiError): string {
  return IDENTITY_ERROR_MESSAGE[error.code] ?? '企业上下文不可用';
}

export function useCurrentIdentity() {
  const lastWarnedCode = useRef<string | null>(null);

  const query = useQuery({
    queryKey: CURRENT_IDENTITY_QUERY_KEY,
    queryFn: getCurrentIdentity,
    staleTime: 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!import.meta.env.DEV || !query.isError) {
      return;
    }

    const error = query.error;
    if (!(error instanceof ApiError)) {
      return;
    }

    if (lastWarnedCode.current === error.code) {
      return;
    }

    lastWarnedCode.current = error.code;
    console.warn(`[identity] ${error.code}: ${error.message}`);
  }, [query.error, query.isError]);

  return query;
}
