import type { OpportunityShelfStatus } from '../types';
import { formatOpportunityShelfStatus } from '../utils';

interface OpportunityShelfStatusBadgeProps {
  status: OpportunityShelfStatus;
}

export function OpportunityShelfStatusBadge({
  status,
}: OpportunityShelfStatusBadgeProps) {
  return (
    <span
      className={`status-badge opportunity-shelf-status opportunity-shelf-status--${status}`}
    >
      {formatOpportunityShelfStatus(status)}
    </span>
  );
}
