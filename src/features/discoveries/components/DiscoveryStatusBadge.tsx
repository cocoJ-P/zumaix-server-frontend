import type { DiscoveryStatus } from '../../../api/types';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { formatDiscoveryStatus } from '../utils';

interface DiscoveryStatusBadgeProps {
  status: DiscoveryStatus;
}

export function DiscoveryStatusBadge({ status }: DiscoveryStatusBadgeProps) {
  return (
    <StatusBadge
      status={status === 'active' ? 'success' : 'pending'}
      label={formatDiscoveryStatus(status)}
    />
  );
}
