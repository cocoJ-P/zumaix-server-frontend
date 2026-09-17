import { useState } from 'react';
import { useCurrentIdentity } from '../../hooks/useCurrentIdentity';
import { LeadDetailPanel } from './components/LeadDetail';
import { LeadList } from './components/LeadList';
import type { LeadSignalFilter } from './types';
import {
  SIGNAL_FILTERS,
  countEnterpriseLeads,
  filterEnterpriseLeads,
} from './utils';

export function LeadWorkspace() {
  const identity = useCurrentIdentity();
  const [signalFilter, setSignalFilter] = useState<LeadSignalFilter>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileShowDetail, setMobileShowDetail] = useState(false);

  const items = filterEnterpriseLeads(signalFilter);
  const resolvedSelectedId =
    selectedId && items.some((item) => item.id === selectedId)
      ? selectedId
      : (items[0]?.id ?? null);
  const selectedItem =
    items.find((item) => item.id === resolvedSelectedId) ?? null;
  const operatorName = identity.data?.enterprise.name ?? '筑脉科技';

  return (
    <div className="lead-workspace">
      <div className="discovery-scope">
        <p className="discovery-scope__enterprise">当前企业：{operatorName}</p>
        <p className="muted-copy">
          根据在园企业的查看、保存、提交和继续办理等行为，归纳可服务信号。
        </p>
      </div>

      <div className="submission-filters" role="tablist" aria-label="行为信号">
        {SIGNAL_FILTERS.map((filter) => (
          <button
            key={filter.id}
            type="button"
            role="tab"
            className="intelligence-tab"
            aria-selected={signalFilter === filter.id}
            onClick={() => {
              setSignalFilter(filter.id);
              setSelectedId(null);
              setMobileShowDetail(false);
            }}
          >
            {filter.label}
            <span className="opportunity-filter-count">
              {countEnterpriseLeads(filter.id)}
            </span>
          </button>
        ))}
      </div>

      <div
        className={`submission-split${mobileShowDetail ? ' submission-split--detail' : ''}`}
      >
        <aside className="submission-pane submission-pane--list">
          <LeadList
            items={items}
            selectedId={resolvedSelectedId}
            onSelect={(id) => {
              setSelectedId(id);
              setMobileShowDetail(true);
            }}
          />
        </aside>
        <div className="submission-pane submission-pane--detail">
          <LeadDetailPanel item={selectedItem} />
        </div>
      </div>
    </div>
  );
}
