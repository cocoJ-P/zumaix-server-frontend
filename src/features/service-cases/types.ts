import type { ServiceCaseStatus } from '../../api/types';

export type ServiceCaseStatusFilter = 'all' | ServiceCaseStatus;

export const SERVICE_CASE_PAGE_SIZE = 20;

export function toServiceCaseApiStatus(
  filter: ServiceCaseStatusFilter,
): ServiceCaseStatus | undefined {
  return filter === 'all' ? undefined : filter;
}
