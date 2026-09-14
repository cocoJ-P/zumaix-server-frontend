import { StatusBadge } from '../../../components/common/StatusBadge';
import type { StatusBadgeTone } from '../../../components/common/StatusBadge';

interface FeedbackStatusBadgeProps {
  tone: StatusBadgeTone;
  label: string;
}

export function FeedbackStatusBadge({ tone, label }: FeedbackStatusBadgeProps) {
  return <StatusBadge status={tone} label={label} />;
}
