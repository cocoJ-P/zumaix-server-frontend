import type { OpportunityWarehouseItem } from '../types';
import { formatOpportunityOrigin } from '../utils';
import { OpportunityKindBadge } from './OpportunityKindBadge';
import { OpportunityShelfStatusBadge } from './OpportunityShelfStatusBadge';

interface OpportunityListItemProps {
  item: OpportunityWarehouseItem;
  selected: boolean;
  onSelect: (id: string) => void;
}

export function OpportunityListItemCard({
  item,
  selected,
  onSelect,
}: OpportunityListItemProps) {
  return (
    <button
      type="button"
      className={`submission-item${selected ? ' submission-item--selected' : ''}`}
      aria-current={selected ? 'true' : undefined}
      onClick={() => onSelect(item.id)}
    >
      <div className="opportunity-item__top">
        <OpportunityKindBadge kind={item.kind} />
        <OpportunityShelfStatusBadge status={item.status} />
      </div>
      <div className="submission-item__title">{item.title}</div>
      <div className="submission-item__meta">{item.publisher}</div>
      <div className="submission-item__footer">
        <span>
          {formatOpportunityOrigin(item.origin)} · {item.updatedAtLabel}
        </span>
      </div>
    </button>
  );
}
