import type { ReactNode } from 'react';
import type { FeatureStatus } from '../../app/navigation';
import { StatusBadge } from './StatusBadge';

interface PageHeaderProps {
  title: string;
  description?: string;
  status?: FeatureStatus;
  actions?: ReactNode;
}

export function PageHeader({
  title,
  description,
  status,
  actions,
}: PageHeaderProps) {
  return (
    <header className="page-header">
      <div className="page-header__title-row">
        <h1 className="page-header__title">{title}</h1>
        {status ? <StatusBadge status={status} /> : null}
        {actions}
      </div>
      {description ? (
        <p className="page-header__description">{description}</p>
      ) : null}
    </header>
  );
}
