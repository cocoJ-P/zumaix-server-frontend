import { ApiError } from '../../../api/errors';
import type { ServiceCaseDetail, ServiceCaseListItem } from '../../../api/types';
import { EmptyState } from '../../../components/common/EmptyState';
import { formatDateTime } from '../../intelligence/utils';
import {
  formatServiceCaseInputType,
  formatServiceCaseOrigin,
  formatServiceCaseSourceStatus,
  formatServiceCaseStatus,
  getServiceCaseDetailErrorMessage,
} from '../utils';
import { ServiceCaseStatusBadge } from './ServiceCaseStatusBadge';

interface ServiceCaseDetailProps {
  summary: ServiceCaseListItem | null;
  detail: ServiceCaseDetail | undefined;
  loading: boolean;
  error: ApiError | null;
  onReload: () => void;
  onBack?: () => void;
}

export function ServiceCaseDetailPanel({
  summary,
  detail,
  loading,
  error,
  onReload,
  onBack,
}: ServiceCaseDetailProps) {
  if (!summary && !detail) {
    return (
      <section className="submission-detail submission-detail--empty">
        <EmptyState
          title="请选择一项服务"
          description="从列表中选择一条服务事项，查看办理状态。"
        />
      </section>
    );
  }

  if (error && !detail) {
    return (
      <section className="submission-detail">
        {onBack ? (
          <button type="button" className="btn btn--ghost submission-back" onClick={onBack}>
            返回列表
          </button>
        ) : null}
        <div className="analysis-error" role="alert">
          <p className="analysis-error__message">
            {getServiceCaseDetailErrorMessage(error)}
          </p>
          <button type="button" className="btn" onClick={onReload}>
            重新加载
          </button>
        </div>
      </section>
    );
  }

  const item = detail;
  const title = item?.title ?? summary?.title ?? '—';
  const status = item?.status ?? summary?.status;
  const userName =
    item?.created_by_user.display_name ?? summary?.created_by_user.display_name;
  const originType =
    item?.submission.origin_type ?? summary?.submission.origin_type;
  const isDiscovery = originType === 'discovery';

  return (
    <section className="submission-detail" aria-label="服务事项详情">
      {onBack ? (
        <button type="button" className="btn btn--ghost submission-back" onClick={onBack}>
          返回列表
        </button>
      ) : null}

      {loading && !item ? <p className="muted-copy">正在加载事项详情…</p> : null}

      <header className="submission-detail__header">
        <div className="submission-detail__title-row">
          <h2 className="submission-detail__title">{title}</h2>
          {status ? <ServiceCaseStatusBadge status={status} /> : null}
        </div>
        <p className="muted-copy">
          {userName ?? '—'}
          {' · '}
          {formatServiceCaseOrigin(originType)}
        </p>
      </header>

      {item ? (
        <>
          <section className="service-case-section">
            <h3 className="service-case-section__title">服务事项</h3>
            <dl className="result-grid">
              <Fact label="标题" value={item.title} />
              <Fact label="当前状态" value={formatServiceCaseStatus(item.status)} />
              <Fact label="创建时间" value={formatDateTime(item.created_at)} />
              <Fact label="更新时间" value={formatDateTime(item.updated_at)} />
              {item.completed_at ? (
                <Fact label="完成时间" value={formatDateTime(item.completed_at)} />
              ) : null}
              {item.closed_at ? (
                <Fact label="关闭时间" value={formatDateTime(item.closed_at)} />
              ) : null}
            </dl>
          </section>

          <section className="service-case-section">
            <h3 className="service-case-section__title">发起用户</h3>
            <dl className="result-grid">
              <Fact label="用户" value={item.created_by_user.display_name} />
            </dl>
          </section>

          <section className="service-case-section">
            <h3 className="service-case-section__title">来源内容</h3>
            <dl className="result-grid">
              <Fact
                label="来源"
                value={formatServiceCaseOrigin(item.submission.origin_type)}
              />
              <Fact
                label="输入类型"
                value={formatServiceCaseInputType(item.submission.input_type)}
              />
              <Fact label="内容摘要" value={item.submission.input_preview} />
              <Fact
                label="解析状态"
                value={formatServiceCaseSourceStatus(item.submission.status)}
              />
            </dl>
            {isDiscovery ? (
              <p className="muted-copy">来源：为你发现</p>
            ) : null}
          </section>

          <section className="service-case-section">
            <h3 className="service-case-section__title">时间</h3>
            <dl className="result-grid">
              <Fact label="进入办理" value={formatDateTime(item.created_at)} />
              <Fact label="最后更新" value={formatDateTime(item.updated_at)} />
              {item.completed_at ? (
                <Fact label="完成时间" value={formatDateTime(item.completed_at)} />
              ) : null}
              {item.closed_at ? (
                <Fact label="关闭时间" value={formatDateTime(item.closed_at)} />
              ) : null}
            </dl>
          </section>

          <details className="tech-details">
            <summary className="tech-details__summary">技术信息</summary>
            <div className="tech-details__body result-grid">
              <Fact label="ServiceCase ID" value={item.id} />
              <Fact label="Enterprise ID" value={item.enterprise_id} />
              <Fact label="Created By User ID" value={item.created_by_user.id} />
              <Fact label="Submission ID" value={item.submission.id} />
              <Fact label="Origin Type" value={item.submission.origin_type} />
              {item.submission.origin_discovery_id ? (
                <Fact
                  label="Origin Discovery ID"
                  value={item.submission.origin_discovery_id}
                />
              ) : null}
            </div>
          </details>
        </>
      ) : null}
    </section>
  );
}

function Fact({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div>
      <div className="result-field__label">{label}</div>
      <div className="result-field__value discovery-break">{value ?? '—'}</div>
    </div>
  );
}
