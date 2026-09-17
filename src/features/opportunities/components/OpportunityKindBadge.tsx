import type { OpportunityKind } from '../types';
import { formatOpportunityKind } from '../utils';

interface OpportunityKindBadgeProps {
  kind: OpportunityKind;
}

export function OpportunityKindBadge({ kind }: OpportunityKindBadgeProps) {
  return (
    <span className={`status-badge opportunity-kind opportunity-kind--${kind}`}>
      {formatOpportunityKind(kind)}
    </span>
  );
}
