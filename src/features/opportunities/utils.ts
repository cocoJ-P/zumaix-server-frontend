import type {
  OpportunityKind,
  OpportunityKindFilter,
  OpportunityOrigin,
  OpportunityShelfStatus,
  OpportunityWarehouseItem,
} from './types';

const KIND_LABEL: Record<OpportunityKind, string> = {
  own_service: '自有服务',
  policy: '政策',
  vendor_service: '服务商',
  event: '活动',
};

const ORIGIN_LABEL: Record<OpportunityOrigin, string> = {
  curated: '人工录入',
  capture: '轻采集',
};

const STATUS_LABEL: Record<OpportunityShelfStatus, string> = {
  ready: '可投放',
  draft: '草稿',
  needs_review: '待整理',
};

export const KIND_FILTERS: { id: OpportunityKindFilter; label: string }[] = [
  { id: 'all', label: '全部' },
  { id: 'own_service', label: '自有服务' },
  { id: 'policy', label: '政策' },
  { id: 'vendor_service', label: '服务商' },
  { id: 'event', label: '活动' },
];

export function formatOpportunityKind(kind: OpportunityKind): string {
  return KIND_LABEL[kind];
}

export function formatOpportunityOrigin(origin: OpportunityOrigin): string {
  return ORIGIN_LABEL[origin];
}

export function formatOpportunityShelfStatus(
  status: OpportunityShelfStatus,
): string {
  return STATUS_LABEL[status];
}

export function filterWarehouseItems(
  items: OpportunityWarehouseItem[],
  filter: OpportunityKindFilter,
): OpportunityWarehouseItem[] {
  if (filter === 'all') {
    return items;
  }

  return items.filter((item) => item.kind === filter);
}

export function countWarehouseByKind(
  items: OpportunityWarehouseItem[],
  kind: OpportunityKindFilter,
): number {
  return filterWarehouseItems(items, kind).length;
}
