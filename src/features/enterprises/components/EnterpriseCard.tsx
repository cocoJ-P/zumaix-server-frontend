import type { ParkEnterprise } from '../types';
import { formatParkName } from '../utils';
import { EnterpriseStatusBadge } from './EnterpriseStatusBadge';

interface EnterpriseCardProps {
  item: ParkEnterprise;
  selected: boolean;
  onSelect: (id: string) => void;
}

export function EnterpriseCard({ item, selected, onSelect }: EnterpriseCardProps) {
  return (
    <button
      type="button"
      className={`enterprise-card${selected ? ' enterprise-card--selected' : ''}`}
      aria-current={selected ? 'true' : undefined}
      onClick={() => onSelect(item.id)}
    >
      <div className="enterprise-card__top">
        <EnterpriseStatusBadge status={item.status} />
        <span className="muted-copy">{formatParkName(item.parkId)}</span>
      </div>
      <h3 className="enterprise-card__name">{item.name}</h3>
      <p className="enterprise-card__industry">{item.industry}</p>
      <p className="enterprise-card__meta">
        {item.stage} · {item.peopleLabel}
      </p>
      <p className="enterprise-card__summary">{item.summary}</p>
    </button>
  );
}
