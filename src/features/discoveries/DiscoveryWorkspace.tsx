import { useState } from 'react';
import { ApiError } from '../../api/errors';
import { useCurrentIdentity } from '../../hooks/useCurrentIdentity';
import { DiscoveryComposer } from './components/DiscoveryComposer';
import { DiscoveryDetail } from './components/DiscoveryDetail';
import { DiscoveryList } from './components/DiscoveryList';
import { useDiscoveries, useDiscovery } from './hooks';
import { DISCOVERY_PAGE_SIZE, type DiscoveryStatusFilter } from './types';
import { getDiscoveryListErrorMessage, isIdentityScopeError } from './utils';

const FILTERS: { id: DiscoveryStatusFilter; label: string }[] = [
  { id: 'active', label: '有效' },
  { id: 'withdrawn', label: '已撤回' },
];

export function DiscoveryWorkspace() {
  const identity = useCurrentIdentity();
  const [statusFilter, setStatusFilter] = useState<DiscoveryStatusFilter>('active');
  const [offset, setOffset] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileShowDetail, setMobileShowDetail] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const listEnabled = identity.isSuccess;
  const listQuery = useDiscoveries(
    {
      status: statusFilter,
      limit: DISCOVERY_PAGE_SIZE,
      offset,
    },
    { enabled: listEnabled },
  );
  const items = listQuery.data?.items ?? [];
  const resolvedSelectedId =
    selectedId && items.some((item) => item.id === selectedId)
      ? selectedId
      : (items[0]?.id ?? null);
  const selectedSummary =
    items.find((item) => item.id === resolvedSelectedId) ?? null;
  const detailQuery = useDiscovery(listEnabled ? resolvedSelectedId : null);

  const identityError =
    identity.error instanceof ApiError ? identity.error : null;
  const listError = listQuery.error instanceof ApiError ? listQuery.error : null;
  const detailError =
    detailQuery.error instanceof ApiError ? detailQuery.error : null;
  const scopeError =
    (identityError && isIdentityScopeError(identityError) && identityError) ||
    (listError && isIdentityScopeError(listError) && listError) ||
    null;

  function changeFilter(next: DiscoveryStatusFilter) {
    setStatusFilter(next);
    setOffset(0);
    setSelectedId(null);
    setMobileShowDetail(false);
  }

  function handleCreated(discoveryId: string) {
    setSuccessMessage('已加入「为你发现」');
    setStatusFilter('active');
    setOffset(0);
    setSelectedId(discoveryId);
    setMobileShowDetail(true);
  }

  const page = Math.floor(offset / DISCOVERY_PAGE_SIZE) + 1;
  const hasPrev = offset > 0;
  const hasNext = items.length === DISCOVERY_PAGE_SIZE;
  const enterpriseName = identity.data?.enterprise.name;

  if (scopeError || identity.isError) {
    return (
      <div className="discovery-workspace">
        <EnterpriseScope name={enterpriseName} />
        <div className="analysis-error" role="alert">
          <p className="analysis-error__message">
            {identityError
              ? getDiscoveryListErrorMessage(identityError)
              : '当前身份不可用，暂时无法管理发现。'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="discovery-workspace">
      <EnterpriseScope name={enterpriseName} />

      {successMessage ? (
        <p className="discovery-success" role="status">
          {successMessage}
        </p>
      ) : null}

      <div className="discovery-layout">
        {listEnabled ? (
          <DiscoveryComposer onCreated={handleCreated} />
        ) : (
          <section className="discovery-composer" aria-label="创建发现">
            <h2 className="discovery-pane__title">创建发现</h2>
            <p className="muted-copy">正在加载发现…</p>
          </section>
        )}

        <section className="discovery-results" aria-label="已创建的发现">
          <div className="discovery-pane__header">
            <h2 className="discovery-pane__title">已创建的发现</h2>
          </div>

          <div className="submission-filters" role="tablist" aria-label="发现状态">
            {FILTERS.map((filter) => (
              <button
                key={filter.id}
                type="button"
                role="tab"
                className="intelligence-tab"
                aria-selected={statusFilter === filter.id}
                onClick={() => changeFilter(filter.id)}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {!listEnabled ? (
            <p className="muted-copy">正在加载发现…</p>
          ) : listQuery.isError && listError && !isIdentityScopeError(listError) ? (
            <div className="analysis-error" role="alert">
              <p className="analysis-error__message">
                {getDiscoveryListErrorMessage(listError)}
              </p>
              <button
                type="button"
                className="btn"
                onClick={() => void listQuery.refetch()}
              >
                重新加载
              </button>
            </div>
          ) : (
            <div
              className={`submission-split${mobileShowDetail ? ' submission-split--detail' : ''}`}
            >
              <aside className="submission-pane submission-pane--list">
                <DiscoveryList
                  items={items}
                  filter={statusFilter}
                  selectedId={resolvedSelectedId}
                  loading={listQuery.isLoading}
                  onSelect={(id) => {
                    setSelectedId(id);
                    setMobileShowDetail(true);
                  }}
                />
                <div className="submission-pagination">
                  <button
                    type="button"
                    className="btn btn--secondary"
                    disabled={!hasPrev}
                    onClick={() => {
                      setOffset((value) => Math.max(0, value - DISCOVERY_PAGE_SIZE));
                      setSelectedId(null);
                    }}
                  >
                    上一页
                  </button>
                  <span className="muted-copy">第 {page} 页</span>
                  <button
                    type="button"
                    className="btn btn--secondary"
                    disabled={!hasNext}
                    onClick={() => {
                      setOffset((value) => value + DISCOVERY_PAGE_SIZE);
                      setSelectedId(null);
                    }}
                  >
                    下一页
                  </button>
                </div>
              </aside>
              <div className="submission-pane submission-pane--detail">
                <DiscoveryDetail
                  summary={selectedSummary}
                  detail={detailQuery.data}
                  loading={detailQuery.isLoading}
                  error={detailError}
                  onBack={() => setMobileShowDetail(false)}
                />
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function EnterpriseScope({ name }: { name?: string }) {
  return (
    <div className="discovery-scope">
      <p className="discovery-scope__enterprise">
        当前企业：{name ?? '—'}
      </p>
      <p className="muted-copy">当前发现内容仅面向当前企业。</p>
    </div>
  );
}
