import { PARKS, PARK_ENTERPRISES } from './data';
import type {
  Park,
  ParkEnterprise,
  ParkEnterpriseStatus,
  ParkFilter,
  ParkId,
} from './types';

const STATUS_LABEL: Record<ParkEnterpriseStatus, string> = {
  in_park: '在园',
  in_service: '服务中',
  pending: '待对接',
};

export const PARK_FILTERS: { id: ParkFilter; label: string }[] = [
  { id: 'all', label: '全部园区' },
  ...PARKS.map((park) => ({ id: park.id, label: park.name })),
];

export function formatParkEnterpriseStatus(
  status: ParkEnterpriseStatus,
): string {
  return STATUS_LABEL[status];
}

export function getPark(parkId: ParkId): Park | undefined {
  return PARKS.find((park) => park.id === parkId);
}

export function formatParkName(parkId: ParkId): string {
  return getPark(parkId)?.name ?? '未知园区';
}

export function filterParkEnterprises(
  filter: ParkFilter,
): ParkEnterprise[] {
  if (filter === 'all') {
    return PARK_ENTERPRISES;
  }

  return PARK_ENTERPRISES.filter((item) => item.parkId === filter);
}

export function countParkEnterprises(filter: ParkFilter): number {
  return filterParkEnterprises(filter).length;
}

export function groupEnterprisesByPark(
  items: ParkEnterprise[],
): { park: Park; items: ParkEnterprise[] }[] {
  return PARKS.map((park) => ({
    park,
    items: items.filter((item) => item.parkId === park.id),
  })).filter((group) => group.items.length > 0);
}
