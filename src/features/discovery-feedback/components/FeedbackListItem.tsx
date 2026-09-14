import type { DiscoveryUserStateListItem } from '../../../api/types';
import { formatSubmissionDate } from '../../submissions/utils';
import { deriveDiscoveryFeedbackDisplayState } from '../utils';
import { FeedbackStatusBadge } from './FeedbackStatusBadge';

interface FeedbackListItemProps {
  item: DiscoveryUserStateListItem;
  selected: boolean;
  onSelect: (id: string) => void;
}

export function FeedbackListItem({
  item,
  selected,
  onSelect,
}: FeedbackListItemProps) {
  const display = deriveDiscoveryFeedbackDisplayState(item);
  const withdrawn = item.discovery.status === 'withdrawn';

  return (
    <button
      type="button"
      className={`submission-item${selected ? ' submission-item--selected' : ''}`}
      aria-current={selected ? 'true' : undefined}
      onClick={() => onSelect(item.id)}
    >
      <div className="submission-item__meta">{item.user.display_name}</div>
      <div className="submission-item__title">{item.discovery.title}</div>
      <div className="submission-item__footer">
        <FeedbackStatusBadge
          tone={display.badgeTone}
          label={display.listStatusText}
        />
        <span>{formatSubmissionDate(item.updated_at)}</span>
      </div>
      {withdrawn ? (
        <div className="feedback-withdrawn">发现已撤回</div>
      ) : null}
    </button>
  );
}
