import { useState, type ReactNode } from 'react';
import { ApiError } from '../../../api/errors';
import type { DiscoveryItemDetail, DiscoveryItemSummary } from '../../../api/types';
import { EmptyState } from '../../../components/common/EmptyState';
import { formatDateTime } from '../../intelligence/utils';
import { useWithdrawDiscovery } from '../hooks';
import {
  formatDiscoveryDeadline,
  formatDiscoveryOpportunityType,
  formatDiscoveryPriority,
  formatDiscoveryReferenceType,
  getDiscoveryDetailErrorMessage,
  getDiscoveryWithdrawErrorMessage,
} from '../utils';
import { DiscoveryStatusBadge } from './DiscoveryStatusBadge';

interface DiscoveryDetailProps {
  summary: DiscoveryItemSummary | null;
  detail: DiscoveryItemDetail | undefined;
  loading: boolean;
  error: ApiError | null;
  onBack?: () => void;
}

export function DiscoveryDetail({
  summary,
  detail,
  loading,
  error,
  onBack,
}: DiscoveryDetailProps) {
  const item = detail ?? summary;

  if (!item) {
    return (
      <section className="submission-detail submission-detail--empty">
        <EmptyState
          title="请选择一条发现"
          description="从列表中选择一条发现，查看详情。"
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
            {getDiscoveryDetailErrorMessage(error)}
          </p>
        </div>
      </section>
    );
  }

  const deadline = formatDiscoveryDeadline(item.deadline);
  const opportunityType = formatDiscoveryOpportunityType(item.opportunity_type);
  const reason = item.reason?.trim();
  const summaryText = item.summary?.trim();
  const issuer = item.issuer?.trim();
  const region = item.region?.trim();
  const createdBy = item.created_by?.display_name;

  return (
    <section className="submission-detail" aria-label="发现详情">
      {onBack ? (
        <button type="button" className="btn btn--ghost submission-back" onClick={onBack}>
          返回列表
        </button>
      ) : null}

      <header className="submission-detail__header">
        <div className="submission-detail__title-row">
          <h2 className="submission-detail__title">{item.title}</h2>
          <DiscoveryStatusBadge status={item.status} />
          <span
            className={`discovery-priority-label discovery-priority-label--${item.priority}`}
          >
            {formatDiscoveryPriority(item.priority)}优先级
          </span>
        </div>
        <p className="muted-copy">
          {formatDiscoveryReferenceType(item.reference_type)}
          {createdBy ? ` · ${createdBy}` : ''}
          {' · '}
          {formatDateTime(item.created_at)}
        </p>
      </header>

      {loading && !detail ? <p className="muted-copy">正在加载发现详情…</p> : null}

      {summaryText ? (
        <DetailBlock title="摘要">
          <p className="discovery-detail__body">{summaryText}</p>
        </DetailBlock>
      ) : null}

      {reason ? (
        <DetailBlock title="推荐理由">
          <p className="discovery-detail__body discovery-detail__reason">{reason}</p>
        </DetailBlock>
      ) : null}

      <dl className="result-grid discovery-detail__facts">
        {opportunityType ? (
          <Fact label="机会类型" value={opportunityType} />
        ) : null}
        {issuer ? <Fact label="发布主体" value={issuer} /> : null}
        {region ? <Fact label="地区" value={region} /> : null}
        {deadline ? <Fact label="截止时间" value={deadline} /> : null}
      </dl>

      {item.reference_url ? (
        <p className="discovery-detail__link">
          <a
            href={item.reference_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            查看参考链接
          </a>
        </p>
      ) : null}

      {item.status === 'active' ? (
        <WithdrawAction discoveryId={item.id} />
      ) : (
        <p className="muted-copy">该发现已撤回，当前不可恢复。</p>
      )}

      <details className="tech-details">
        <summary className="tech-details__summary">技术信息</summary>
        <div className="tech-details__body result-grid">
          <TechField label="Discovery ID" value={item.id} />
          <TechField label="Opportunity ID" value={item.opportunity_id} />
          <TechField label="Source ID" value={item.source_id} />
          {detail?.withdrawn_at ? (
            <TechField
              label="撤回时间"
              value={formatDateTime(detail.withdrawn_at)}
            />
          ) : null}
        </div>
      </details>
    </section>
  );
}

function DetailBlock({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="discovery-detail__block">
      <h3 className="discovery-detail__label">{title}</h3>
      {children}
    </div>
  );
}

function Fact({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  if (!value) {
    return null;
  }

  return <TechField label={label} value={value} />;
}

function TechField({
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

function WithdrawAction({ discoveryId }: { discoveryId: string }) {
  const withdrawMutation = useWithdrawDiscovery();
  const [confirming, setConfirming] = useState(false);
  const error =
    withdrawMutation.error instanceof ApiError ? withdrawMutation.error : null;

  return (
    <div className="discovery-withdraw">
      {confirming ? (
        <div className="discovery-withdraw__confirm" role="dialog" aria-labelledby="withdraw-title">
          <p id="withdraw-title" className="discovery-withdraw__title">
            撤回这条发现？
          </p>
          <p className="muted-copy">
            撤回后，它将不再出现在当前企业的有效发现列表中。
          </p>
          <div className="discovery-withdraw__actions">
            <button
              type="button"
              className="btn btn--secondary"
              disabled={withdrawMutation.isPending}
              onClick={() => setConfirming(false)}
            >
              取消
            </button>
            <button
              type="button"
              className="btn"
              disabled={withdrawMutation.isPending}
              onClick={() => {
                withdrawMutation.mutate(discoveryId, {
                  onSuccess: () => setConfirming(false),
                });
              }}
            >
              {withdrawMutation.isPending ? '正在撤回…' : '确认撤回'}
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="btn btn--secondary"
          onClick={() => {
            withdrawMutation.reset();
            setConfirming(true);
          }}
        >
          撤回发现
        </button>
      )}

      {error ? (
        <div className="analysis-error" role="alert">
          <p className="analysis-error__message">
            {getDiscoveryWithdrawErrorMessage(error)}
          </p>
        </div>
      ) : null}
    </div>
  );
}
