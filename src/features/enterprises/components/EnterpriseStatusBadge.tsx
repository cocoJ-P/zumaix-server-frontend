import type { ParkEnterpriseStatus } from '../types';
import { formatParkEnterpriseStatus } from '../utils';

interface EnterpriseStatusBadgeProps {
  status: ParkEnterpriseStatus;
}

export function EnterpriseStatusBadge({ status }: EnterpriseStatusBadgeProps) {
  return (
    <span className={`status-badge enterprise-status enterprise-status--${status}`}>
      {formatParkEnterpriseStatus(status)}
    </span>
  );
}
