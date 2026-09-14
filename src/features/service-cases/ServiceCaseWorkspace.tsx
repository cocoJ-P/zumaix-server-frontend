import { useState } from 'react';
import { ApiError } from '../../api/errors';
import { useCurrentIdentity } from '../../hooks/useCurrentIdentity';
import { ServiceCaseDetailPanel } from './components/ServiceCaseDetail';
import { ServiceCaseList } from './components/ServiceCaseList';
import { useServiceCase, useServiceCases } from './hooks';
import {
  SERVICE_CASE_PAGE_SIZE,
  toServiceCaseApiStatus,
  type ServiceCaseStatusFilter,
} from './types';
import {
  getServiceCaseListErrorMessage,
  isIdentityScopeError,
} from './utils';

const FILTERS: { id: ServiceCaseStatusFilter; label: string }[] = [
  { id: 'all', label: '全部' },
  { id: 'open', label: '待服务' },
  { id: 'in_progress', label: '处理中' },
  { id: 'completed', label: '已完成' },
  { id: 'closed', label: '已关闭' },
];

export function ServiceCaseWorkspace() {
  const identity = useCurrentIdentity();
  const [statusFilter, setStatusFilter] = useState<ServiceCaseStatusFilter>('all');
  const [offset, setOffset] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileShowDetail, setMobileShowDetail] = useState(false);

  const listEnabled = identity.isSuccess;
  const listQuery = useServiceCases(
    {
      status: toServiceCaseApiStatus(statusFilter),
      limit: SERVICE_CASE_PAGE_SIZE,
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
  const detailQuery = useServiceCase(listEnabled ? resolvedSelectedId : null);

  const identityError =
    identity.error instanceof ApiError ? identity.error : null;
  const listError = listQuery.error instanceof ApiError ? listQuery.error : null;
  const detailError =
    detailQuery.error instanceof ApiError ? detailQuery.error : null;
  const scopeError =
    (identityError && isIdentityScopeError(identityError) && identityError) ||
    (listError && isIdentityScopeError(listError) && listError) ||
    null;

  function changeFilter(next: ServiceCaseStatusFilter) {
    setStatusFilter(next);
    setOffset(0);
    setSelectedId(null);
    setMobileShowDetail(false);
  }

  const page = Math.floor(offset / SERVICE_CASE_PAGE_SIZE) + 1;
  const hasPrev = offset > 0;
  const hasNext = items.length === SERVICE_CASE_PAGE_SIZE;
  const enterpriseName = identity.data?.enterprise.name;

  if (scopeError || identity.isError) {
    return (
      <div className="submission-workspace">
        <EnterpriseScope name={enterpriseName} />
        <div className="analysis-error" role="alert">
          <p className="analysis-error__message">
            {identityError
              ? getServiceCaseListErrorMessage(identityError)
              : '当前身份不可用，暂时无法查看服务事项。'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="submission-workspace">
      <EnterpriseScope name={enterpriseName} />

      {!listEnabled ? (
        <p className="muted-copy">正在加载服务事项…</p>
      ) : (
        <>
          <div
            className="submission-filters"
            role="tablist"
            aria-label="办理状态"
          >
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

          {listQuery.isError && listError && !isIdentityScopeError(listError) ? (
            <div className="analysis-error" role="alert">
              <p className="analysis-error__message">
                {getServiceCaseListErrorMessage(listError)}
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
                <ServiceCaseList
                  items={items}
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
                      setOffset((value) =>
                        Math.max(0, value - SERVICE_CASE_PAGE_SIZE),
                      );
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
                      setOffset((value) => value + SERVICE_CASE_PAGE_SIZE);
                      setSelectedId(null);
                    }}
                  >
                    下一页
                  </button>
                </div>
              </aside>
              <div className="submission-pane submission-pane--detail">
                <ServiceCaseDetailPanel
                  summary={selectedSummary}
                  detail={detailQuery.data}
                  loading={detailQuery.isLoading}
                  error={detailError}
                  onReload={() => void detailQuery.refetch()}
                  onBack={() => setMobileShowDetail(false)}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function EnterpriseScope({ name }: { name?: string }) {
  return (
    <div className="discovery-scope">
      <p className="discovery-scope__enterprise">当前企业：{name ?? '—'}</p>
      <p className="muted-copy">当前仅查看本企业用户已经发起的服务事项。</p>
    </div>
  );
}
