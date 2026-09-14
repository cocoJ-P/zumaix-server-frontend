import type { UserSubmissionSummary } from '../../../api/types';
import { SubmissionStatusBadge } from './SubmissionStatusBadge';
import {
  formatSubmissionDate,
  formatSubmissionInputType,
} from '../utils';

interface SubmissionListItemProps {
  item: UserSubmissionSummary;
  selected: boolean;
  onSelect: (id: string) => void;
}

export function SubmissionListItem({
  item,
  selected,
  onSelect,
}: SubmissionListItemProps) {
  return (
    <button
      type="button"
      className={`submission-item${selected ? ' submission-item--selected' : ''}`}
      aria-current={selected ? 'true' : undefined}
      onClick={() => onSelect(item.id)}
    >
      <div className="submission-item__title">{item.display_title}</div>
      <div className="submission-item__meta">
        {item.submitted_by.display_name} ·{' '}
        {formatSubmissionInputType(item.input_type)}
      </div>
      {item.input_preview ? (
        <div className="submission-item__preview">{item.input_preview}</div>
      ) : null}
      <div className="submission-item__footer">
        <SubmissionStatusBadge status={item.status} />
        <span>{formatSubmissionDate(item.created_at)}</span>
      </div>
    </button>
  );
}
