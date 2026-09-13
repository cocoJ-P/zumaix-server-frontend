import type { BackendConnectionStatus } from '../../hooks/useBackendHealth';

const STATUS_LABEL: Record<BackendConnectionStatus, string> = {
  loading: '检查中',
  connected: '已连接',
  unavailable: '不可用',
};

interface BackendStatusProps {
  status: BackendConnectionStatus;
}

export function BackendStatus({ status }: BackendStatusProps) {
  return (
    <div className="backend-status" aria-live="polite">
      <span className="backend-status__label">Backend</span>
      <span className={`backend-status__value backend-status__value--${status}`}>
        <span className="backend-status__dot" aria-hidden="true" />
        {STATUS_LABEL[status]}
      </span>
    </div>
  );
}
