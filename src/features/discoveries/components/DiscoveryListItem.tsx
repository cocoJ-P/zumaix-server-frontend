import type { DiscoveryItemSummary } from '../../../api/types';
import { formatDateTime } from '../../intelligence/utils';
import {
  formatDiscoveryDeadline,
  formatDiscoveryOpportunityType,
  formatDiscoveryPriority,
  formatDiscoveryReferenceType,
} from '../utils';
import { DiscoveryStatusBadge } from './DiscoveryStatusBadge';

interface DiscoveryListItemProps {
  item: DiscoveryItemSummary;
  selected: boolean;
  onSelect: (id: string) => void;
}

export function DiscoveryListItem({
  item,
  selected,
  onSelect,
}: DiscoveryListItemProps) {
  const deadline = formatDiscoveryDeadline(item.deadline);
  const opportunityType = formatDiscoveryOpportunityType(item.opportunity_type);
  const reason = item.reason?.trim();
  const summary = item.summary?.trim();

  return (
    <button
      type="button"
      className={`submission-item${selected ? ' submission-item--selected' : ''}`}
      aria-current={selected ? 'true' : undefined}
      onClick={() => onSelect(item.id)}
    >
      <div className="submission-item__title">{item.title}</div>
      <div className="submission-item__meta">
        {formatDiscoveryReferenceType(item.reference_type)}
        {opportunityType ? ` · ${opportunityType}` : ''}
        {' · '}
        <span
          className={`discovery-priority-label discovery-priority-label--${item.priority}`}
        >
          {formatDiscoveryPriority(item.priority)}优先级
        </span>
      </div>
      {reason ? (
        <div className="submission-item__preview discovery-reason-preview">
          {reason}
        </div>
      ) : summary ? (
        <div className="submission-item__preview discovery-summary-preview">
          {summary}
        </div>
      ) : null}
      <div className="submission-item__footer">
        <DiscoveryStatusBadge status={item.status} />
        <span>
          {deadline ? `${deadline} · ` : ''}
          {formatDateTime(item.created_at)}
        </span>
      </div>
    </button>
  );
}
