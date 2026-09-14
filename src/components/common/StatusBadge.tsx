import type { FeatureStatus } from '../../app/navigation';

export type StatusBadgeTone =
  | FeatureStatus
  | 'pending'
  | 'progress'
  | 'success'
  | 'danger';

const STATUS_LABEL: Record<FeatureStatus, string> = {
  available: '可用',
  development: '开发中',
  'coming-soon': 'Coming Soon',
};

interface StatusBadgeProps {
  status: StatusBadgeTone;
  label?: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const text =
    label ??
    (status in STATUS_LABEL ? STATUS_LABEL[status as FeatureStatus] : status);

  return <span className={`status-badge status-badge--${status}`}>{text}</span>;
}
