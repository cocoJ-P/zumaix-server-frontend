import { useLocation } from 'react-router-dom';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useBackendHealth } from '../../hooks/useBackendHealth';
import { getBreadcrumb } from '../navigation';
import { BackendStatus } from './BackendStatus';

export function Topbar() {
  const location = useLocation();
  const breadcrumb = getBreadcrumb(location.pathname);
  const { connectionStatus } = useBackendHealth();

  return (
    <header className="topbar">
      <div className="topbar__breadcrumb">{breadcrumb}</div>
      <div className="topbar__env">
        <StatusBadge status="development" label="Development" />
        <span className="topbar__env-text">本地开发环境</span>
        <BackendStatus status={connectionStatus} />
      </div>
    </header>
  );
}
