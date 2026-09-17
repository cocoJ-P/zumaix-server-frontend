import { useState } from 'react';
import { useCurrentIdentity } from '../../hooks/useCurrentIdentity';
import { EnterpriseCardGrid } from './components/EnterpriseCardGrid';
import { EnterpriseDetailPanel } from './components/EnterpriseDetail';
import type { ParkFilter } from './types';
import {
  PARK_FILTERS,
  countParkEnterprises,
  filterParkEnterprises,
  groupEnterprisesByPark,
} from './utils';

export function EnterpriseWorkspace() {
  const identity = useCurrentIdentity();
  const [parkFilter, setParkFilter] = useState<ParkFilter>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const items = filterParkEnterprises(parkFilter);
  const groups = groupEnterprisesByPark(items);
  const resolvedSelectedId =
    selectedId && items.some((item) => item.id === selectedId)
      ? selectedId
      : (items[0]?.id ?? null);
  const selectedItem =
    items.find((item) => item.id === resolvedSelectedId) ?? null;
  const enterpriseName = identity.data?.enterprise.name ?? '筑脉科技';

  return (
    <div className="enterprise-workspace">
      <div className="discovery-scope">
        <p className="discovery-scope__enterprise">当前企业：{enterpriseName}</p>
        <p className="muted-copy">
          按产业园查看在园企业。这是服务对象名录，不是跨企业切换。
        </p>
      </div>

      <div
        className="submission-filters"
        role="tablist"
        aria-label="产业园"
      >
        {PARK_FILTERS.map((filter) => (
          <button
            key={filter.id}
            type="button"
            role="tab"
            className="intelligence-tab"
            aria-selected={parkFilter === filter.id}
            onClick={() => {
              setParkFilter(filter.id);
              setSelectedId(null);
            }}
          >
            {filter.label}
            <span className="opportunity-filter-count">
              {countParkEnterprises(filter.id)}
            </span>
          </button>
        ))}
      </div>

      <div className="enterprise-split">
        <div className="enterprise-split__cards">
          <EnterpriseCardGrid
            groups={groups}
            selectedId={resolvedSelectedId}
            onSelect={setSelectedId}
          />
        </div>
        <div className="enterprise-split__detail">
          <EnterpriseDetailPanel item={selectedItem} />
        </div>
      </div>
    </div>
  );
}
