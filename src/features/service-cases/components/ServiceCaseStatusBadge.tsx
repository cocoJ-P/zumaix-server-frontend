import type { ServiceCaseStatus } from '../../../api/types';
import { formatServiceCaseStatus } from '../utils';

interface ServiceCaseStatusBadgeProps {
  status: ServiceCaseStatus;
}

export function ServiceCaseStatusBadge({ status }: ServiceCaseStatusBadgeProps) {
  return (
    <span className={`status-badge service-case-status service-case-status--${status}`}>
      {formatServiceCaseStatus(status)}
    </span>
  );
}
