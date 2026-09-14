import type { UserSubmissionSummary } from '../../../api/types';
import { EmptyState } from '../../../components/common/EmptyState';
import { SubmissionListItem } from './SubmissionListItem';

interface SubmissionListProps {
  items: UserSubmissionSummary[];
  selectedId: string | null;
  loading: boolean;
  onSelect: (id: string) => void;
}

export function SubmissionList({
  items,
  selectedId,
  loading,
  onSelect,
}: SubmissionListProps) {
  if (loading && items.length === 0) {
    return <p className="muted-copy">加载提交记录…</p>;
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="暂无用户提交"
        description="企业用户通过筑脉查查发起分析后，会显示在这里。"
      />
    );
  }

  return (
    <div className="submission-list" role="list">
      {items.map((item) => (
        <SubmissionListItem
          key={item.id}
          item={item}
          selected={item.id === selectedId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
