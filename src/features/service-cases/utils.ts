import { ApiError } from '../../api/errors';
import type {
  ServiceCaseListItem,
  ServiceCaseStatus,
  SubmissionInputType,
  SubmissionOriginType,
  SubmissionStatus,
} from '../../api/types';
import { formatSubmissionDate } from '../submissions/utils';

const STATUS_LABEL: Record<ServiceCaseStatus, string> = {
  open: '待服务',
  in_progress: '处理中',
  completed: '已完成',
  closed: '已关闭',
};

const ORIGIN_LABEL: Record<SubmissionOriginType, string> = {
  user_input: '用户提交',
  discovery: '来自发现',
};

const INPUT_TYPE_LABEL: Record<SubmissionInputType, string> = {
  url: '链接',
  text: '文本',
};

const SOURCE_STATUS_LABEL: Record<SubmissionStatus, string> = {
  pending: '待处理',
  ingesting: '读取中',
  analyzing: '分析中',
  succeeded: '已解析',
  failed: '解析失败',
};

export interface ServiceCaseListItemViewModel {
  title: string;
  userName: string;
  statusLabel: string;
  originLabel: string;
  createdAtLabel: string;
}

export function formatServiceCaseStatus(
  status: ServiceCaseStatus | null | undefined,
): string {
  return status ? STATUS_LABEL[status] : '—';
}

export function formatServiceCaseOrigin(
  originType: SubmissionOriginType | null | undefined,
): string {
  return originType ? ORIGIN_LABEL[originType] : '—';
}

export function formatServiceCaseInputType(
  inputType: SubmissionInputType | null | undefined,
): string {
  return inputType ? INPUT_TYPE_LABEL[inputType] : '—';
}

export function formatServiceCaseSourceStatus(
  status: SubmissionStatus | null | undefined,
): string {
  return status ? SOURCE_STATUS_LABEL[status] : '—';
}

export function toServiceCaseListItemView(
  item: ServiceCaseListItem,
): ServiceCaseListItemViewModel {
  return {
    title: item.title,
    userName: item.created_by_user.display_name,
    statusLabel: formatServiceCaseStatus(item.status),
    originLabel: formatServiceCaseOrigin(item.submission.origin_type),
    createdAtLabel: formatSubmissionDate(item.created_at),
  };
}

export function getServiceCaseListErrorMessage(error: ApiError): string {
  if (isIdentityScopeError(error)) {
    return '当前身份不可用，暂时无法查看服务事项。';
  }

  return '暂时无法加载服务事项';
}

export function getServiceCaseDetailErrorMessage(error: ApiError): string {
  if (isIdentityScopeError(error)) {
    return '当前身份不可用，暂时无法查看事项详情。';
  }

  return '暂时无法加载事项详情';
}

export function isIdentityScopeError(error: ApiError): boolean {
  return (
    error.code === 'DEV_IDENTITY_REQUIRED' ||
    error.code === 'AUTHENTICATION_REQUIRED' ||
    error.code === 'ENTERPRISE_CONTEXT_REQUIRED'
  );
}
