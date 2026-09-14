import { useState } from 'react';
import { ApiError } from '../../api/errors';
import { useCurrentIdentity } from '../../hooks/useCurrentIdentity';
import { FeedbackDetail } from './components/FeedbackDetail';
import { FeedbackList } from './components/FeedbackList';
import { useDiscoveryFeedback } from './hooks';
import {
  DISCOVERY_FEEDBACK_PAGE_SIZE,
  toDiscoveryFeedbackApiFilters,
  type DiscoveryFeedbackFilter,
} from './types';
import {
  getDiscoveryFeedbackErrorMessage,
  isIdentityScopeError,
} from './utils';

const FILTERS: { id: DiscoveryFeedbackFilter; label: string }[] = [
  { id: 'all', label: '全部' },
  { id: 'saved', label: '保存' },
  { id: 'deprioritized', label: '稍后' },
  { id: 'seen', label: '看过' },
];

export function DiscoveryFeedbackWorkspace() {
  const identity = useCurrentIdentity();
  const [filter, setFilter] = useState<DiscoveryFeedbackFilter>('all');
  const [offset, setOffset] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileShowDetail, setMobileShowDetail] = useState(false);

  const listEnabled = identity.isSuccess;
  const listQuery = useDiscoveryFeedback(
    {
      ...toDiscoveryFeedbackApiFilters(filter),
      limit: DISCOVERY_FEEDBACK_PAGE_SIZE,
      offset,
    },
    { enabled: listEnabled },
  );
  const items = listQuery.data?.items ?? [];
  const resolvedSelectedId =
    selectedId && items.some((item) => item.id === selectedId)
      ? selectedId
      : (items[0]?.id ?? null);
  const selectedItem =
    items.find((item) => item.id === resolvedSelectedId) ?? null;

  const identityError =
    identity.error instanceof ApiError ? identity.error : null;
  const listError = listQuery.error instanceof ApiError ? listQuery.error : null;
  const scopeError =
    (identityError && isIdentityScopeError(identityError) && identityError) ||
    (listError && isIdentityScopeError(listError) && listError) ||
    null;

  function changeFilter(next: DiscoveryFeedbackFilter) {
    setFilter(next);
    setOffset(0);
    setSelectedId(null);
    setMobileShowDetail(false);
  }

  const page = Math.floor(offset / DISCOVERY_FEEDBACK_PAGE_SIZE) + 1;
  const hasPrev = offset > 0;
  const hasNext = items.length === DISCOVERY_FEEDBACK_PAGE_SIZE;
  const enterpriseName = identity.data?.enterprise.name;

  if (scopeError || identity.isError) {
    return (
      <div className="submission-workspace">
        <EnterpriseScope name={enterpriseName} />
        <div className="analysis-error" role="alert">
          <p className="analysis-error__message">
            {identityError
              ? getDiscoveryFeedbackErrorMessage(identityError)
              : '当前身份不可用，暂时无法查看发现反馈。'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="submission-workspace">
      <EnterpriseScope name={enterpriseName} />

      {!listEnabled ? (
        <p className="muted-copy">正在加载发现反馈…</p>
      ) : (
        <>
          <div
            className="submission-filters"
            role="tablist"
            aria-label="反馈状态"
          >
            {FILTERS.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                className="intelligence-tab"
                aria-selected={filter === item.id}
                onClick={() => changeFilter(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>

          {listQuery.isError && listError && !isIdentityScopeError(listError) ? (
            <div className="analysis-error" role="alert">
              <p className="analysis-error__message">
                {getDiscoveryFeedbackErrorMessage(listError)}
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
                <FeedbackList
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
                        Math.max(0, value - DISCOVERY_FEEDBACK_PAGE_SIZE),
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
                      setOffset((value) => value + DISCOVERY_FEEDBACK_PAGE_SIZE);
                      setSelectedId(null);
                    }}
                  >
                    下一页
                  </button>
                </div>
              </aside>
              <div className="submission-pane submission-pane--detail">
                <FeedbackDetail
                  item={selectedItem}
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
      <p className="muted-copy">当前仅查看本企业用户对发现内容的反馈。</p>
    </div>
  );
}
