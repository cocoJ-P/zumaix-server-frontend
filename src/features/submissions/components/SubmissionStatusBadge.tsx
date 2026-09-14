import type { StatusBadgeTone } from '../../../components/common/StatusBadge';
import { StatusBadge } from '../../../components/common/StatusBadge';
import type { SubmissionStatus } from '../../../api/types';
import { formatSubmissionStatus } from '../utils';

const STATUS_TONE: Record<SubmissionStatus, StatusBadgeTone> = {
  pending: 'pending',
  ingesting: 'progress',
  analyzing: 'progress',
  succeeded: 'success',
  failed: 'danger',
};

interface SubmissionStatusBadgeProps {
  status: SubmissionStatus;
}

export function SubmissionStatusBadge({ status }: SubmissionStatusBadgeProps) {
  return (
    <StatusBadge
      status={STATUS_TONE[status]}
      label={formatSubmissionStatus(status)}
    />
  );
}
