import type { ServiceCaseListItem } from '../../../api/types';
import { toServiceCaseListItemView } from '../utils';
import { ServiceCaseStatusBadge } from './ServiceCaseStatusBadge';

interface ServiceCaseListItemProps {
  item: ServiceCaseListItem;
  selected: boolean;
  onSelect: (id: string) => void;
}

export function ServiceCaseListItemCard({
  item,
  selected,
  onSelect,
}: ServiceCaseListItemProps) {
  const view = toServiceCaseListItemView(item);

  return (
    <button
      type="button"
      className={`submission-item${selected ? ' submission-item--selected' : ''}`}
      aria-current={selected ? 'true' : undefined}
      onClick={() => onSelect(item.id)}
    >
      <div className="submission-item__meta">{view.userName}</div>
      <div className="submission-item__title">{view.title}</div>
      <div className="submission-item__footer">
        <ServiceCaseStatusBadge status={item.status} />
        <span>
          {view.originLabel} · {view.createdAtLabel}
        </span>
      </div>
    </button>
  );
}
