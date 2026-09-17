import { StatusBadge } from '../../components/common/StatusBadge';
import { useBackendHealth } from '../../hooks/useBackendHealth';
import heroLogo from '../../assets/herologo.png';
import { BackendStatus } from './BackendStatus';
import { IdentityStatus } from './IdentityStatus';

export function Topbar() {
  const { connectionStatus } = useBackendHealth();

  return (
    <header className="topbar">
      <div className="topbar__brand">
        <img
          className="topbar__logo"
          src={heroLogo}
          alt="北辰云空间 · 查查"
        />
      </div>
      <div className="topbar__meta">
        <IdentityStatus />
        <div className="topbar__env">
          <StatusBadge status="development" label="Development" />
          <span className="topbar__env-text">本地开发环境</span>
          <BackendStatus status={connectionStatus} />
        </div>
      </div>
    </header>
  );
}
