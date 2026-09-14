import { ApiError } from '../../api/errors';
import type {
  DiscoveryPriority,
  DiscoveryReferenceType,
  DiscoveryStatus,
  OpportunitySourceResponse,
} from '../../api/types';
import {
  formatDate,
  formatOpportunityType,
  mapBackendErrorCode,
} from '../intelligence/utils';

const EMPTY_VALUE = '—';

const REFERENCE_TYPE_LABEL: Record<DiscoveryReferenceType, string> = {
  opportunity: '机会',
  source: '内容源',
  manual: '手工创建',
};

const PRIORITY_LABEL: Record<DiscoveryPriority, string> = {
  high: '高',
  normal: '普通',
  low: '低',
};

const STATUS_LABEL: Record<DiscoveryStatus, string> = {
  active: '有效',
  withdrawn: '已撤回',
};

const CREATE_ERROR_MESSAGE: Record<string, string> = {
  OPPORTUNITY_NOT_FOUND: '该机会已不存在，请重新选择',
  SOURCE_NOT_FOUND: '该内容源已不存在，请重新选择',
  INVALID_DISCOVERY_REFERENCE: '发现引用关系无效',
  INVALID_DISCOVERY_INPUT: '发现内容不完整，请检查后重试',
  DEV_IDENTITY_REQUIRED: '未配置开发身份',
  AUTHENTICATION_REQUIRED: '当前环境需要身份认证',
};

const WITHDRAW_ERROR_MESSAGE: Record<string, string> = {
  DISCOVERY_NOT_FOUND: '该发现已不存在或当前不可访问',
};

export function formatDiscoveryReferenceType(
  value: DiscoveryReferenceType | null | undefined,
): string {
  return value ? REFERENCE_TYPE_LABEL[value] : EMPTY_VALUE;
}

export function formatDiscoveryPriority(
  value: DiscoveryPriority | null | undefined,
): string {
  return value ? PRIORITY_LABEL[value] : EMPTY_VALUE;
}

export function formatDiscoveryStatus(
  value: DiscoveryStatus | null | undefined,
): string {
  return value ? STATUS_LABEL[value] : EMPTY_VALUE;
}

export function formatDiscoveryDeadline(
  value: string | null | undefined,
): string | null {
  if (!value) {
    return null;
  }

  const date = formatDate(value);
  return date === EMPTY_VALUE ? null : `截止 ${date}`;
}

export function formatDiscoveryOpportunityType(
  value: string | null | undefined,
): string | null {
  if (!value) {
    return null;
  }

  const label = formatOpportunityType(value);
  return label === EMPTY_VALUE ? null : label;
}

export function getDiscoveryListErrorMessage(error: ApiError): string {
  if (isIdentityScopeError(error)) {
    return '当前身份不可用，暂时无法管理发现。';
  }

  return '暂时无法加载发现内容';
}

export function getDiscoveryCreateErrorMessage(error: ApiError): string {
  return (
    CREATE_ERROR_MESSAGE[error.code] ??
    mapBackendErrorCode(error.code) ??
    error.message ??
    '发现创建失败，请稍后重试'
  );
}

export function getDiscoveryWithdrawErrorMessage(error: ApiError): string {
  return (
    WITHDRAW_ERROR_MESSAGE[error.code] ??
    mapBackendErrorCode(error.code) ??
    error.message ??
    '撤回失败，请稍后重试'
  );
}

export function getDiscoveryDetailErrorMessage(error: ApiError): string {
  if (error.code === 'DISCOVERY_NOT_FOUND' || error.status === 404) {
    return '该发现已不存在或当前不可访问';
  }

  return getDiscoveryListErrorMessage(error);
}

export function isIdentityScopeError(error: ApiError): boolean {
  return (
    error.code === 'DEV_IDENTITY_REQUIRED' ||
    error.code === 'AUTHENTICATION_REQUIRED' ||
    error.code === 'ENTERPRISE_CONTEXT_REQUIRED'
  );
}

export function sourcePickerTitle(source: OpportunitySourceResponse): string {
  const title = source.title?.trim();
  if (title) {
    return title;
  }

  const publisher = source.publisher?.trim();
  if (publisher) {
    return publisher;
  }

  const hostname = sourceHostname(source.url);
  if (hostname) {
    return hostname;
  }

  return '内容源';
}

export function sourceHostname(url: string | null | undefined): string | null {
  if (!url) {
    return null;
  }

  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

export function filterOpportunities<
  T extends { title: string; issuer: string | null },
>(items: T[], query: string): T[] {
  const keyword = query.trim().toLowerCase();
  if (!keyword) {
    return items;
  }

  return items.filter((item) => {
    const title = item.title.toLowerCase();
    const issuer = item.issuer?.toLowerCase() ?? '';
    return title.includes(keyword) || issuer.includes(keyword);
  });
}

export function filterSources(
  items: OpportunitySourceResponse[],
  query: string,
): OpportunitySourceResponse[] {
  const keyword = query.trim().toLowerCase();
  if (!keyword) {
    return items;
  }

  return items.filter((item) => {
    const title = sourcePickerTitle(item).toLowerCase();
    const publisher = item.publisher?.toLowerCase() ?? '';
    const url = item.url?.toLowerCase() ?? '';
    return (
      title.includes(keyword) ||
      publisher.includes(keyword) ||
      url.includes(keyword)
    );
  });
}
