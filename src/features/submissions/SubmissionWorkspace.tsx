import { useState } from 'react';
import { ApiError } from '../../api/errors';
import type { SubmissionStatus } from '../../api/types';
import { useCurrentIdentity } from '../../hooks/useCurrentIdentity';
import { useUserSubmission, useUserSubmissions } from './hooks';
import { SubmissionList } from './components/SubmissionList';
import { SubmissionDetail } from './components/SubmissionDetail';
import type { SubmissionStatusFilter } from './types';
import { SUBMISSION_PAGE_SIZE } from './types';
import {
  formatSubmissionStatus,
  getSubmissionListErrorMessage,
  isIdentityScopeError,
  toApiStatus,
} from './utils';

const FILTERS: { id: SubmissionStatusFilter; label: string }[] = [
  { id: 'all', label: '全部' },
  { id: 'pending', label: '待处理' },
  { id: 'ingesting', label: '读取中' },
  { id: 'analyzing', label: '分析中' },
  { id: 'succeeded', label: '成功' },
  { id: 'failed', label: '失败' },
];

export function SubmissionWorkspace() {
  const identity = useCurrentIdentity();
  const [statusFilter, setStatusFilter] = useState<SubmissionStatusFilter>('all');
  const [offset, setOffset] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileShowDetail, setMobileShowDetail] = useState(false);

  const listQuery = useUserSubmissions({
    status: toApiStatus(statusFilter),
    limit: SUBMISSION_PAGE_SIZE,
    offset,
  });
  const items = listQuery.data?.items ?? [];
  const resolvedSelectedId =
    selectedId && items.some((item) => item.id === selectedId)
      ? selectedId
      : (items[0]?.id ?? null);
  const selectedSummary =
    items.find((item) => item.id === resolvedSelectedId) ?? null;
  const detailQuery = useUserSubmission(resolvedSelectedId);

  const identityError =
    identity.error instanceof ApiError ? identity.error : null;
  const listError = listQuery.error instanceof ApiError ? listQuery.error : null;
  const scopeError =
    (identityError && isIdentityScopeError(identityError) && identityError) ||
    (listError && isIdentityScopeError(listError) && listError) ||
    null;

  function changeFilter(next: SubmissionStatusFilter) {
    setStatusFilter(next);
    setOffset(0);
    setSelectedId(null);
    setMobileShowDetail(false);
  }

  const page = Math.floor(offset / SUBMISSION_PAGE_SIZE) + 1;
  const hasPrev = offset > 0;
  const hasNext = items.length === SUBMISSION_PAGE_SIZE;
  const enterpriseName = identity.data?.enterprise.name;

  return (
    <div className="submission-workspace">
      <div className="submission-toolbar">
        {enterpriseName ? (
          <p className="muted-copy">当前企业：{enterpriseName}</p>
        ) : (
          <p className="muted-copy">当前企业：—</p>
        )}
      </div>

      {scopeError ? (
        <div className="analysis-error" role="alert">
          <p className="analysis-error__message">
            {getSubmissionListErrorMessage(scopeError)}
          </p>
        </div>
      ) : (
        <>
          <div
            className="submission-filters"
            role="tablist"
            aria-label="提交状态"
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
                {getSubmissionListErrorMessage(listError)}
              </p>
              <button type="button" className="btn" onClick={() => void listQuery.refetch()}>
                重新加载
              </button>
            </div>
          ) : (
            <div
              className={`submission-split${mobileShowDetail ? ' submission-split--detail' : ''}`}
            >
              <aside className="submission-pane submission-pane--list">
                <SubmissionList
                  items={items}
                  selectedId={resolvedSelectedId}
                  loading={listQuery.isPending}
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
                    onClick={() =>
                      setOffset((value) => Math.max(0, value - SUBMISSION_PAGE_SIZE))
                    }
                  >
                    上一页
                  </button>
                  <span className="muted-copy">第 {page} 页</span>
                  <button
                    type="button"
                    className="btn btn--secondary"
                    disabled={!hasNext}
                    onClick={() => setOffset((value) => value + SUBMISSION_PAGE_SIZE)}
                  >
                    下一页
                  </button>
                </div>
              </aside>
              <div className="submission-pane submission-pane--detail">
                <button
                  type="button"
                  className="btn btn--ghost submission-back"
                  onClick={() => setMobileShowDetail(false)}
                >
                  返回列表
                </button>
                {detailQuery.isError ? (
                  <p className="muted-copy" role="alert">
                    暂时无法加载这条提交的详情。
                  </p>
                ) : (
                  <SubmissionDetail
                    summary={selectedSummary}
                    detail={detailQuery.data}
                    loading={detailQuery.isPending}
                  />
                )}
              </div>
            </div>
          )}
        </>
      )}

      <p className="submission-footnote">
        当前仅查看本企业用户提交，不包含跨企业或平台管理视角。
        {statusFilter !== 'all'
          ? ` 当前筛选：${formatSubmissionStatus(statusFilter as SubmissionStatus)}。`
          : null}
      </p>
    </div>
  );
}

