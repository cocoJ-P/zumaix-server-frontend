import type { LeadSignal } from '../types';
import { formatLeadSignal } from '../utils';

interface LeadSignalBadgeProps {
  signal: LeadSignal;
}

export function LeadSignalBadge({ signal }: LeadSignalBadgeProps) {
  return (
    <span className={`status-badge lead-signal lead-signal--${signal}`}>
      {formatLeadSignal(signal)}
    </span>
  );
}
