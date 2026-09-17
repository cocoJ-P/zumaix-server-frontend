import type { OpportunityWarehouseItem } from '../types';
import { EmptyState } from '../../../components/common/EmptyState';
import { OpportunityListItemCard } from './OpportunityListItem';

interface OpportunityListProps {
  items: OpportunityWarehouseItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function OpportunityList({
  items,
  selectedId,
  onSelect,
}: OpportunityListProps) {
  if (items.length === 0) {
    return (
      <EmptyState
        title="这一类还没有内容"
        description="把政策、服务或活动整理进机会库后，就可以从这里投放到小程序。"
      />
    );
  }

  return (
    <div className="submission-list" role="list">
      {items.map((item) => (
        <OpportunityListItemCard
          key={item.id}
          item={item}
          selected={item.id === selectedId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
