import type { EnterpriseLead } from '../types';
import { EmptyState } from '../../../components/common/EmptyState';
import { LeadListItem } from './LeadListItem';

interface LeadListProps {
  items: EnterpriseLead[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function LeadList({ items, selectedId, onSelect }: LeadListProps) {
  if (items.length === 0) {
    return (
      <EmptyState
        title="这一类还没有行为信号"
        description="企业查看发现、提交内容或继续办理后，线索会出现在这里。"
      />
    );
  }

  return (
    <div className="submission-list" role="list">
      {items.map((item) => (
        <LeadListItem
          key={item.id}
          item={item}
          selected={item.id === selectedId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
