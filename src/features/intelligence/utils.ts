import type { ApiError } from '../../api/errors';
import type { InputMode } from './types';

const EMPTY_VALUE = '—';

const CONTENT_NATURE_LABEL = {
  opportunity_announcement: '机会发布',
  opportunity_interpretation: '机会解读',
  news_report: '新闻报道',
  marketing_content: '营销内容',
  service_content: '服务内容',
  general_information: '一般资讯',
  mixed: '混合内容',
  unknown: '暂无法判断',
} as const;

const OPPORTUNITY_RELEVANCE_LABEL = {
  high: '高',
  medium: '中',
  low: '低',
  none: '未发现明确机会',
  unknown: '暂无法判断',
} as const;

const APPARENT_SOURCE_LABEL = {
  official_like: '类官方来源',
  media_like: '类媒体来源',
  service_provider_like: '类服务机构来源',
  individual_like: '类个人来源',
  unknown: '暂无法判断',
} as const;

const MARKETING_LEVEL_LABEL = {
  none: '无明显营销',
  low: '较低',
  medium: '中等',
  high: '较高',
  unknown: '暂无法判断',
} as const;

const INTERMEDIARY_LEVEL_LABEL = {
  none: '未发现明显中介特征',
  possible: '可能存在',
  likely: '较明显',
  unknown: '暂无法判断',
} as const;

const ORIGINALITY_CLAIM_LABEL = {
  claims_original: '内容声称为原始发布',
  appears_repost: '看起来像转载',
  appears_interpretation: '看起来像解读',
  unclear: '暂无法判断',
} as const;

const OPPORTUNITY_TYPE_LABEL = {
  policy: '政策',
  competition: '创赛',
  financial_service: '金融服务',
  equity_funding: '股权融资',
  park_service: '园区服务',
  scenario: '场景机会',
  other: '其他',
} as const;

const CLAIMED_STATUS_LABEL = {
  active: '进行中',
  upcoming: '即将开始',
  expired: '已过期',
  closed: '已结束',
  unknown: '暂无法判断',
} as const;

const EVIDENCE_KIND_LABEL = {
  direct_quote: '正文依据',
  metadata: '页面元数据',
  derived_signal: '规则信号',
} as const;

const ERROR_MESSAGE: Record<string, string> = {
  NETWORK_ERROR: '无法连接筑脉企服 Backend',
  VALIDATION_ERROR: '链接格式不正确',
  INVALID_URL: '链接格式不正确',
  UNSAFE_URL: '当前链接不能被系统访问',
  FETCH_TIMEOUT: '网页读取超时，请稍后重试或直接粘贴正文',
  FETCH_FAILED: '无法读取该网页',
  CONTENT_TOO_LARGE: '网页内容过大',
  UNSUPPORTED_CONTENT_TYPE: '当前内容格式暂不支持',
  EXTRACTION_FAILED: '已获取网页，但未能提取有效正文',
  CONTENT_NOT_ANALYZABLE: '当前内容不足以进行智能分析',
  LLM_NOT_CONFIGURED: '智能分析服务尚未配置',
  LLM_TIMEOUT: '智能分析超时，请重试',
  LLM_RATE_LIMITED: '智能分析服务繁忙，请稍后重试',
  LLM_PROVIDER_ERROR: '智能分析服务暂时不可用',
  LLM_STRUCTURED_OUTPUT_ERROR: '智能分析结果异常，请重试',
  LLM_SCHEMA_VALIDATION_ERROR: '智能分析结果未通过结构校验，请重试',
};

function lookup(
  table: Record<string, string>,
  value: string | null | undefined,
): string {
  if (!value) {
    return EMPTY_VALUE;
  }

  return table[value] ?? value;
}

export function formatContentNature(value: string | null | undefined): string {
  return lookup(CONTENT_NATURE_LABEL, value);
}

export function formatOpportunityRelevance(
  value: string | null | undefined,
): string {
  return lookup(OPPORTUNITY_RELEVANCE_LABEL, value);
}

export function formatApparentSourceType(
  value: string | null | undefined,
): string {
  return lookup(APPARENT_SOURCE_LABEL, value);
}

export function formatMarketingLevel(value: string | null | undefined): string {
  return lookup(MARKETING_LEVEL_LABEL, value);
}

export function formatIntermediaryLevel(
  value: string | null | undefined,
): string {
  return lookup(INTERMEDIARY_LEVEL_LABEL, value);
}

export function formatOriginalityClaim(
  value: string | null | undefined,
): string {
  return lookup(ORIGINALITY_CLAIM_LABEL, value);
}

export function formatOpportunityType(value: string | null | undefined): string {
  return lookup(OPPORTUNITY_TYPE_LABEL, value);
}

export function formatClaimedStatus(value: string | null | undefined): string {
  return lookup(CLAIMED_STATUS_LABEL, value);
}

export function formatEvidenceKind(value: string | null | undefined): string {
  return lookup(EVIDENCE_KIND_LABEL, value);
}

export function formatDisplayValue(value: string | null | undefined): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : EMPTY_VALUE;
}

export function formatConfidence(value: number | null | undefined): string {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return EMPTY_VALUE;
  }

  return `${Math.round(value * 100)}%`;
}

export function formatDate(value: string | null | undefined): string {
  if (!value) {
    return EMPTY_VALUE;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  const date = new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(parsed);

  return date.replace(/\//g, '-');
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) {
    return EMPTY_VALUE;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  const date = new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(parsed);

  return date.replace(/\//g, '-');
}

export function formatFundingAmount(
  amount: number | null | undefined,
  description?: string | null,
): string {
  if (typeof amount !== 'number' || Number.isNaN(amount)) {
    return formatDisplayValue(description);
  }

  const abs = Math.abs(amount);

  if (abs >= 100_000_000 && abs % 100_000_000 === 0) {
    return `${amount / 100_000_000} 亿元`;
  }

  if (abs >= 10_000 && abs % 10_000 === 0) {
    return `${amount / 10_000} 万元`;
  }

  return `¥${amount.toLocaleString('zh-CN')}`;
}

export function formatExpectedValue(value: unknown): string | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return String(value);
  }

  if (typeof value === 'boolean') {
    return value ? '是' : '否';
  }

  if (Array.isArray(value)) {
    return value.map((item) => String(item)).join('、');
  }

  try {
    return JSON.stringify(value);
  } catch {
    return null;
  }
}

export function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function getConsoleErrorMessage(
  error: ApiError,
  phase: 'ingest' | 'analyze',
  inputMode: InputMode,
): string {
  if (error.code === 'NETWORK_ERROR') {
    return '无法连接筑脉企服 Backend';
  }

  const mapped = ERROR_MESSAGE[error.code];
  if (mapped) {
    if (error.code === 'VALIDATION_ERROR' && inputMode === 'text') {
      return error.message || '输入内容不正确';
    }

    return mapped;
  }

  if (phase === 'ingest' && inputMode === 'url') {
    return '无法读取该网页';
  }

  return error.message || '筑脉企服 Backend 请求失败';
}
