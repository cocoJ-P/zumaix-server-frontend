import { ApiError } from '../../api/errors';
import type {
  SubmissionFailureStage,
  SubmissionInputType,
  SubmissionStatus,
} from '../../api/types';
import { mapBackendErrorCode } from '../intelligence/utils';
import type { SubmissionStatusFilter } from './types';

const EMPTY_VALUE = '—';

const STATUS_LABEL: Record<SubmissionStatus, string> = {
  pending: '待处理',
  ingesting: '正在读取',
  analyzing: '正在分析',
  succeeded: '已完成',
  failed: '失败',
};

const FAILURE_STAGE_LABEL: Record<SubmissionFailureStage, string> = {
  ingest: '内容读取',
  analyze: '智能分析',
};

const INPUT_TYPE_LABEL: Record<SubmissionInputType, string> = {
  url: '网页链接',
  text: '正文提交',
};

const FETCH_STATUS_LABEL: Record<string, string> = {
  not_required: '无需抓取',
  success: '读取成功',
  failed: '读取失败',
  blocked: '无法访问',
  timeout: '读取超时',
  invalid_url: '链接无效',
  unsupported_content_type: '内容格式不支持',
};

const EXTRACTION_STATUS_LABEL: Record<string, string> = {
  success: '提取成功',
  partial: '部分提取',
  failed: '提取失败',
  not_required: '无需提取',
  insufficient_content: '有效正文不足',
  unsupported: '暂不支持提取',
};

export function formatSubmissionStatus(
  status: SubmissionStatus | null | undefined,
): string {
  return status ? STATUS_LABEL[status] : EMPTY_VALUE;
}

export function formatSubmissionFailureStage(
  stage: SubmissionFailureStage | null | undefined,
): string {
  return stage ? FAILURE_STAGE_LABEL[stage] : EMPTY_VALUE;
}

export function formatSubmissionInputType(
  inputType: SubmissionInputType | null | undefined,
): string {
  return inputType ? INPUT_TYPE_LABEL[inputType] : EMPTY_VALUE;
}

export function formatFetchStatus(value: string | null | undefined): string {
  if (!value) {
    return EMPTY_VALUE;
  }

  return FETCH_STATUS_LABEL[value] ?? value;
}

export function formatExtractionStatus(
  value: string | null | undefined,
): string {
  if (!value) {
    return EMPTY_VALUE;
  }

  return EXTRACTION_STATUS_LABEL[value] ?? value;
}

export function formatSubmissionDate(value: string | null | undefined): string {
  if (!value) {
    return EMPTY_VALUE;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  const time = new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(parsed);

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfThat = new Date(
    parsed.getFullYear(),
    parsed.getMonth(),
    parsed.getDate(),
  );
  const dayDiff = Math.round(
    (startOfToday.getTime() - startOfThat.getTime()) / 86_400_000,
  );

  if (dayDiff === 0) {
    return `今天 ${time}`;
  }

  if (dayDiff === 1) {
    return `昨天 ${time}`;
  }

  const date = new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .format(parsed)
    .replace(/\//g, '-');

  return `${date} ${time}`;
}

export function mapSubmissionError(code: string | null | undefined): string {
  return mapBackendErrorCode(code) ?? '处理未完成';
}

export function getSubmissionListErrorMessage(error: ApiError): string {
  if (
    error.code === 'DEV_IDENTITY_REQUIRED' ||
    error.code === 'AUTHENTICATION_REQUIRED'
  ) {
    return '当前身份不可用，暂时无法查看用户提交。';
  }

  if (error.code === 'ENTERPRISE_CONTEXT_REQUIRED') {
    return '当前用户关联多个企业，需要先确定企业上下文。';
  }

  if (error.code === 'NETWORK_ERROR' || error.code === 'BACKEND_UNAVAILABLE') {
    return '暂时无法加载用户提交';
  }

  return '暂时无法加载用户提交';
}

export function isIdentityScopeError(error: ApiError): boolean {
  return (
    error.code === 'DEV_IDENTITY_REQUIRED' ||
    error.code === 'AUTHENTICATION_REQUIRED' ||
    error.code === 'ENTERPRISE_CONTEXT_REQUIRED'
  );
}

export function toApiStatus(
  filter: SubmissionStatusFilter,
): SubmissionStatus | undefined {
  return filter === 'all' ? undefined : filter;
}
