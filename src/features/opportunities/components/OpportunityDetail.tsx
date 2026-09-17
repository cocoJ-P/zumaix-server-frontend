import { EmptyState } from '../../../components/common/EmptyState';
import type { OpportunityWarehouseItem } from '../types';
import {
  formatOpportunityKind,
  formatOpportunityOrigin,
  formatOpportunityShelfStatus,
} from '../utils';
import { OpportunityKindBadge } from './OpportunityKindBadge';
import { OpportunityShelfStatusBadge } from './OpportunityShelfStatusBadge';

interface OpportunityDetailProps {
  item: OpportunityWarehouseItem | null;
  onBack?: () => void;
}

export function OpportunityDetailPanel({ item, onBack }: OpportunityDetailProps) {
  if (!item) {
    return (
      <section className="submission-detail submission-detail--empty">
        <EmptyState
          title="请选择一条内容"
          description="从左侧选择政策、服务或活动，查看它如何进入小程序内容仓库。"
        />
      </section>
    );
  }

  return (
    <section className="submission-detail" aria-label="内容详情">
      {onBack ? (
        <button type="button" className="btn btn--ghost submission-back" onClick={onBack}>
          返回列表
        </button>
      ) : null}

      <header className="submission-detail__header">
        <div className="submission-detail__title-row">
          <h2 className="submission-detail__title">{item.title}</h2>
          <OpportunityKindBadge kind={item.kind} />
          <OpportunityShelfStatusBadge status={item.status} />
        </div>
        <p className="muted-copy">
          {item.publisher}
          {' · '}
          {formatOpportunityOrigin(item.origin)}
        </p>
      </header>

      <ol className="opportunity-path" aria-label="投放路径">
        <li className="opportunity-path__step opportunity-path__step--current">
          机会库备好
        </li>
        <li className="opportunity-path__step">发现投放发出</li>
        <li className="opportunity-path__step">小程序可见</li>
      </ol>

      <section className="opportunity-section">
        <h3 className="opportunity-section__title">这条内容</h3>
        <p className="opportunity-section__body">{item.summary}</p>
        <dl className="result-grid">
          <Fact label="类型" value={formatOpportunityKind(item.kind)} />
          <Fact label="发布主体" value={item.publisher} />
          <Fact label="库内状态" value={formatOpportunityShelfStatus(item.status)} />
        </dl>
      </section>

      <section className="opportunity-section">
        <h3 className="opportunity-section__title">面向谁</h3>
        <p className="opportunity-section__body">{item.audience}</p>
      </section>

      <section className="opportunity-section">
        <h3 className="opportunity-section__title">来源</h3>
        <dl className="result-grid">
          <Fact label="进入方式" value={formatOpportunityOrigin(item.origin)} />
          <Fact label="来源说明" value={item.sourceLabel} />
          {item.captureUrl ? <Fact label="采集页" value={item.captureUrl} /> : null}
        </dl>
        {item.origin === 'capture' ? (
          <p className="opportunity-footnote">
            采集只负责把公开网页带进来。分类、适用对象和是否投放，仍在机会库完成。
          </p>
        ) : (
          <p className="opportunity-footnote">
            投放请到「发现投放」。机会库只负责把内容备好，不直接改小程序首页。
          </p>
        )}
      </section>
    </section>
  );
}

function Fact({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="result-field__label">{label}</div>
      <div className="result-field__value discovery-break">{value}</div>
    </div>
  );
}
