import { PARK_ENTERPRISES } from '../enterprises/data';
import { formatParkName } from '../enterprises/utils';
import type { ParkEnterprise } from '../enterprises/types';
import { ENTERPRISE_LEADS } from './data';
import type {
  BehaviorKind,
  EnterpriseLead,
  LeadSignal,
  LeadSignalFilter,
} from './types';

const SIGNAL_LABEL: Record<LeadSignal, string> = {
  high_intent: '高意向',
  in_progress: '办理中',
  follow_up: '需回访',
  watching: '观察中',
};

const BEHAVIOR_LABEL: Record<BehaviorKind, string> = {
  view_discovery: '查看发现',
  save_discovery: '保存 / 接受',
  defer_discovery: '稍后',
  open_content: '打开内容',
  submit: '用户提交',
  continue_service: '继续办理',
  revisit: '再次访问',
};

export const SIGNAL_FILTERS: { id: LeadSignalFilter; label: string }[] = [
  { id: 'all', label: '全部信号' },
  { id: 'high_intent', label: '高意向' },
  { id: 'in_progress', label: '办理中' },
  { id: 'follow_up', label: '需回访' },
  { id: 'watching', label: '观察中' },
];

export function formatLeadSignal(signal: LeadSignal): string {
  return SIGNAL_LABEL[signal];
}

export function formatBehaviorKind(kind: BehaviorKind): string {
  return BEHAVIOR_LABEL[kind];
}

export function getLeadEnterprise(
  enterpriseId: string,
): ParkEnterprise | undefined {
  return PARK_ENTERPRISES.find((item) => item.id === enterpriseId);
}

export function getLeadEnterpriseName(enterpriseId: string): string {
  return getLeadEnterprise(enterpriseId)?.name ?? '未知企业';
}

export function getLeadParkName(enterpriseId: string): string {
  const enterprise = getLeadEnterprise(enterpriseId);
  return enterprise ? formatParkName(enterprise.parkId) : '未知园区';
}

export function filterEnterpriseLeads(
  filter: LeadSignalFilter,
): EnterpriseLead[] {
  if (filter === 'all') {
    return ENTERPRISE_LEADS;
  }

  return ENTERPRISE_LEADS.filter((item) => item.signal === filter);
}

export function countEnterpriseLeads(filter: LeadSignalFilter): number {
  return filterEnterpriseLeads(filter).length;
}
