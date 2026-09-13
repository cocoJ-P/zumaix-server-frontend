import type { FeatureStatus } from '../../app/navigation';

const STATUS_LABEL: Record<FeatureStatus, string> = {
  available: '可用',
  development: '开发中',
  'coming-soon': 'Coming Soon',
};

interface StatusBadgeProps {
  status: FeatureStatus;
  label?: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  return (
    <span className={`status-badge status-badge--${status}`}>
      {label ?? STATUS_LABEL[status]}
    </span>
  );
}
