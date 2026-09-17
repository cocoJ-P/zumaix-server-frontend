import type { Park, ParkEnterprise } from '../types';
import { EmptyState } from '../../../components/common/EmptyState';
import { EnterpriseCard } from './EnterpriseCard';

interface EnterpriseCardGridProps {
  groups: { park: Park; items: ParkEnterprise[] }[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function EnterpriseCardGrid({
  groups,
  selectedId,
  onSelect,
}: EnterpriseCardGridProps) {
  if (groups.length === 0) {
    return (
      <EmptyState
        title="这一园区还没有企业"
        description="把在园企业整理进来后，会按园区显示在这里。"
      />
    );
  }

  return (
    <div className="enterprise-groups">
      {groups.map((group) => (
        <section
          key={group.park.id}
          className="enterprise-group"
          aria-labelledby={`park-${group.park.id}`}
        >
          <header className="enterprise-group__header">
            <div>
              <h2 id={`park-${group.park.id}`} className="enterprise-group__title">
                {group.park.name}
              </h2>
              <p className="muted-copy">{group.park.focus}</p>
            </div>
            <span className="enterprise-group__count">{group.items.length} 家</span>
          </header>
          <div className="enterprise-grid">
            {group.items.map((item) => (
              <EnterpriseCard
                key={item.id}
                item={item}
                selected={item.id === selectedId}
                onSelect={onSelect}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
