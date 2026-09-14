import type { DiscoveryItemSummary } from '../../../api/types';
import { EmptyState } from '../../../components/common/EmptyState';
import type { DiscoveryStatusFilter } from '../types';
import { DiscoveryListItem } from './DiscoveryListItem';

interface DiscoveryListProps {
  items: DiscoveryItemSummary[];
  filter: DiscoveryStatusFilter;
  selectedId: string | null;
  loading: boolean;
  onSelect: (id: string) => void;
}

export function DiscoveryList({
  items,
  filter,
  selectedId,
  loading,
  onSelect,
}: DiscoveryListProps) {
  if (loading && items.length === 0) {
    return <p className="muted-copy">正在加载发现…</p>;
  }

  if (items.length === 0) {
    return filter === 'active' ? (
      <EmptyState
        title="暂无有效发现"
        description="从左侧选择机会、内容源，或手工创建一条发现。"
      />
    ) : (
      <EmptyState title="暂无已撤回发现" description="撤回后的发现会保留在这里。" />
    );
  }

  return (
    <div className="submission-list" role="list">
      {items.map((item) => (
        <DiscoveryListItem
          key={item.id}
          item={item}
          selected={item.id === selectedId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
