import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useCurrentIdentity } from '../../hooks/useCurrentIdentity';
import { OPPORTUNITY_WAREHOUSE_ITEMS } from './data';
import { OpportunityDetailPanel } from './components/OpportunityDetail';
import { OpportunityList } from './components/OpportunityList';
import type { OpportunityKindFilter } from './types';
import {
  KIND_FILTERS,
  countWarehouseByKind,
  filterWarehouseItems,
} from './utils';

export function OpportunityWorkspace() {
  const identity = useCurrentIdentity();
  const [kindFilter, setKindFilter] = useState<OpportunityKindFilter>('all');
  const [selectedId, setSelectedId] = useState<string | null>(
    OPPORTUNITY_WAREHOUSE_ITEMS[0]?.id ?? null,
  );
  const [mobileShowDetail, setMobileShowDetail] = useState(false);

  const items = filterWarehouseItems(OPPORTUNITY_WAREHOUSE_ITEMS, kindFilter);
  const resolvedSelectedId =
    selectedId && items.some((item) => item.id === selectedId)
      ? selectedId
      : (items[0]?.id ?? null);
  const selectedItem =
    items.find((item) => item.id === resolvedSelectedId) ?? null;
  const enterpriseName = identity.data?.enterprise.name ?? '筑脉科技';

  function changeFilter(next: OpportunityKindFilter) {
    setKindFilter(next);
    setSelectedId(null);
    setMobileShowDetail(false);
  }

  return (
    <div className="opportunity-workspace">
      <div className="discovery-scope">
        <p className="discovery-scope__enterprise">当前企业：{enterpriseName}</p>
        <p className="muted-copy">
          这里整理已经进入仓库的内容。公开页采集请到「爬取」，投放请到「发现投放」。
        </p>
      </div>

      <div className="opportunity-toolbar">
        <div className="submission-filters" role="tablist" aria-label="内容类型">
          {KIND_FILTERS.map((filter) => (
            <button
              key={filter.id}
              type="button"
              role="tab"
              className="intelligence-tab"
              aria-selected={kindFilter === filter.id}
              onClick={() => changeFilter(filter.id)}
            >
              {filter.label}
              <span className="opportunity-filter-count">
                {countWarehouseByKind(OPPORTUNITY_WAREHOUSE_ITEMS, filter.id)}
              </span>
            </button>
          ))}
        </div>
        <Link to="/crawls" className="btn btn--secondary">
          去爬取
        </Link>
      </div>

      <div
        className={`submission-split${mobileShowDetail ? ' submission-split--detail' : ''}`}
      >
        <aside className="submission-pane submission-pane--list">
          <OpportunityList
            items={items}
            selectedId={resolvedSelectedId}
            onSelect={(id) => {
              setSelectedId(id);
              setMobileShowDetail(true);
            }}
          />
        </aside>
        <div className="submission-pane submission-pane--detail">
          <OpportunityDetailPanel
            item={selectedItem}
            onBack={() => setMobileShowDetail(false)}
          />
        </div>
      </div>
    </div>
  );
}
