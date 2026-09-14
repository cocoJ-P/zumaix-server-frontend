import type { DiscoveryUserStateListItem } from '../../../api/types';
import { EmptyState } from '../../../components/common/EmptyState';
import {
  formatDiscoveryReferenceType,
  formatDiscoveryStatus,
} from '../../discoveries/utils';
import { formatDateTime } from '../../intelligence/utils';
import { formatSubmissionDate } from '../../submissions/utils';
import {
  deriveDiscoveryFeedbackDisplayState,
  formatFeedbackFailureMessage,
  formatFeedbackFailureStage,
  formatLinkedSubmissionStatus,
} from '../utils';
import { FeedbackStatusBadge } from './FeedbackStatusBadge';

interface FeedbackDetailProps {
  item: DiscoveryUserStateListItem | null;
  onBack?: () => void;
}

export function FeedbackDetail({ item, onBack }: FeedbackDetailProps) {
  if (!item) {
    return (
      <section className="submission-detail submission-detail--empty">
        <EmptyState
          title="请选择一条反馈"
          description="从列表中选择一条发现反馈，查看用户后续处理情况。"
        />
      </section>
    );
  }

  const display = deriveDiscoveryFeedbackDisplayState(item);
  const linked = item.linked_submission ?? null;
  const failureStage = formatFeedbackFailureStage(linked);
  const failureMessage = formatFeedbackFailureMessage(linked);
  const withdrawn = item.discovery.status === 'withdrawn';

  return (
    <section className="submission-detail" aria-label="发现反馈详情">
      {onBack ? (
        <button type="button" className="btn btn--ghost submission-back" onClick={onBack}>
          返回列表
        </button>
      ) : null}

      <header className="submission-detail__header">
        <div className="submission-detail__title-row">
          <h2 className="submission-detail__title">{item.discovery.title}</h2>
          <FeedbackStatusBadge
            tone={display.badgeTone}
            label={display.listStatusText}
          />
        </div>
        <p className="muted-copy">
          {formatDiscoveryReferenceType(item.discovery.reference_type)}
          {' · '}
          {formatDiscoveryStatus(item.discovery.status)}
        </p>
        {withdrawn ? <p className="feedback-withdrawn">发现已撤回</p> : null}
      </header>

      <section className="feedback-section">
        <h3 className="feedback-section__title">发现</h3>
        <dl className="result-grid">
          <Fact label="标题" value={item.discovery.title} />
          <Fact
            label="来源类型"
            value={formatDiscoveryReferenceType(item.discovery.reference_type)}
          />
          <Fact
            label="发现状态"
            value={formatDiscoveryStatus(item.discovery.status)}
          />
        </dl>
      </section>

      <section className="feedback-section">
        <h3 className="feedback-section__title">用户反馈</h3>
        <dl className="result-grid">
          <Fact label="用户" value={item.user.display_name} />
          <Fact label="首次查看" value={formatDateTime(item.seen_at)} />
          <Fact
            label="当前反馈"
            value={
              display.kind === 'seen'
                ? `${display.feedbackLabel} / 尚未明确判断`
                : display.feedbackLabel
            }
          />
          <Fact label="反馈时间" value={formatDateTime(item.disposition_at)} />
        </dl>
        {display.hint && display.kind === 'saved' ? (
          <p className="muted-copy">{display.hint}</p>
        ) : null}
      </section>

      {linked ? (
        <section className="feedback-section">
          <h3 className="feedback-section__title">关联工作项</h3>
          <dl className="result-grid">
            <Fact
              label="状态"
              value={formatLinkedSubmissionStatus(linked.status)}
            />
            <Fact
              label="进入工作流"
              value={formatDateTime(linked.created_at)}
            />
            {linked.completed_at ? (
              <Fact label="完成时间" value={formatDateTime(linked.completed_at)} />
            ) : null}
          </dl>
          {linked.status === 'failed' ? (
            <div className="feedback-failure">
              {failureStage ? (
                <p>
                  <span className="result-field__label">失败阶段</span>
                  {failureStage}
                </p>
              ) : null}
              {failureMessage ? (
                <p>
                  <span className="result-field__label">错误说明</span>
                  {failureMessage}
                </p>
              ) : null}
            </div>
          ) : null}
        </section>
      ) : null}

      <section className="feedback-section">
        <h3 className="feedback-section__title">时间线摘要</h3>
        <ul className="feedback-timeline">
          {item.seen_at ? (
            <li>首次查看 · {formatSubmissionDate(item.seen_at)}</li>
          ) : null}
          {item.disposition_at ? (
            <li>
              {display.feedbackLabel} · {formatSubmissionDate(item.disposition_at)}
            </li>
          ) : null}
          {linked?.created_at ? (
            <li>进入工作流 · {formatSubmissionDate(linked.created_at)}</li>
          ) : null}
          {linked?.completed_at ? (
            <li>完成 · {formatSubmissionDate(linked.completed_at)}</li>
          ) : null}
        </ul>
      </section>

      <details className="tech-details">
        <summary className="tech-details__summary">技术信息</summary>
        <div className="tech-details__body result-grid">
          <Fact label="Discovery ID" value={item.discovery.id} />
          <Fact label="User ID" value={item.user.id} />
          <Fact label="UserState ID" value={item.id} />
          <Fact label="Submission ID" value={linked?.id} />
          <Fact label="origin_type" value={linked?.origin_type} />
          <Fact label="disposition" value={item.disposition} />
        </div>
      </details>
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
