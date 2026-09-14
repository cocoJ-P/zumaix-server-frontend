import type { DiscoveryUserStateListItem } from '../../../api/types';
import { EmptyState } from '../../../components/common/EmptyState';
import { FeedbackListItem } from './FeedbackListItem';

interface FeedbackListProps {
  items: DiscoveryUserStateListItem[];
  selectedId: string | null;
  loading: boolean;
  onSelect: (id: string) => void;
}

export function FeedbackList({
  items,
  selectedId,
  loading,
  onSelect,
}: FeedbackListProps) {
  if (loading && items.length === 0) {
    return <p className="muted-copy">正在加载发现反馈…</p>;
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="暂无发现反馈"
        description="企业用户查看或处理「为你发现」后，反馈会出现在这里。"
      />
    );
  }

  return (
    <div className="submission-list" role="list">
      {items.map((item) => (
        <FeedbackListItem
          key={item.id}
          item={item}
          selected={item.id === selectedId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
