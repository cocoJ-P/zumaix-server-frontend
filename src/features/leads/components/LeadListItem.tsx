import type { EnterpriseLead } from '../types';
import {
  getLeadEnterpriseName,
  getLeadParkName,
} from '../utils';
import { LeadSignalBadge } from './LeadSignalBadge';

interface LeadListItemProps {
  item: EnterpriseLead;
  selected: boolean;
  onSelect: (id: string) => void;
}

export function LeadListItem({ item, selected, onSelect }: LeadListItemProps) {
  return (
    <button
      type="button"
      className={`submission-item${selected ? ' submission-item--selected' : ''}`}
      aria-current={selected ? 'true' : undefined}
      onClick={() => onSelect(item.id)}
    >
      <div className="opportunity-item__top">
        <LeadSignalBadge signal={item.signal} />
        <span className="muted-copy">{getLeadParkName(item.enterpriseId)}</span>
      </div>
      <div className="submission-item__title">
        {getLeadEnterpriseName(item.enterpriseId)}
      </div>
      <div className="submission-item__preview">{item.summary}</div>
      <div className="submission-item__footer">
        <span>
          {item.lastActionLabel} · {item.lastAtLabel}
        </span>
      </div>
    </button>
  );
}
