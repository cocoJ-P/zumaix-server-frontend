import type { ServiceCaseListItem } from '../../../api/types';
import { EmptyState } from '../../../components/common/EmptyState';
import { ServiceCaseListItemCard } from './ServiceCaseListItem';

interface ServiceCaseListProps {
  items: ServiceCaseListItem[];
  selectedId: string | null;
  loading: boolean;
  onSelect: (id: string) => void;
}

export function ServiceCaseList({
  items,
  selectedId,
  loading,
  onSelect,
}: ServiceCaseListProps) {
  if (loading && items.length === 0) {
    return <p className="muted-copy">正在加载服务事项…</p>;
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="暂无服务事项"
        description="企业用户在解析结果中选择「继续办理」后，服务事项会出现在这里。"
      />
    );
  }

  return (
    <div className="submission-list" role="list">
      {items.map((item) => (
        <ServiceCaseListItemCard
          key={item.id}
          item={item}
          selected={item.id === selectedId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
