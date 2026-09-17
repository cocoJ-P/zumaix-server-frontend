import { Link } from 'react-router-dom';
import { EmptyState } from '../../../components/common/EmptyState';
import type { EnterpriseLead } from '../types';
import {
  formatBehaviorKind,
  getLeadEnterprise,
  getLeadEnterpriseName,
  getLeadParkName,
} from '../utils';
import { LeadSignalBadge } from './LeadSignalBadge';

interface LeadDetailProps {
  item: EnterpriseLead | null;
}

export function LeadDetailPanel({ item }: LeadDetailProps) {
  if (!item) {
    return (
      <section className="submission-detail submission-detail--empty">
        <EmptyState
          title="请选择一条线索"
          description="从左侧选择一家企业，查看它最近的操作行为与归纳结论。"
        />
      </section>
    );
  }

  const enterprise = getLeadEnterprise(item.enterpriseId);

  return (
    <section className="submission-detail" aria-label="线索详情">
      <header className="submission-detail__header">
        <div className="submission-detail__title-row">
          <h2 className="submission-detail__title">
            {getLeadEnterpriseName(item.enterpriseId)}
          </h2>
          <LeadSignalBadge signal={item.signal} />
        </div>
        <p className="muted-copy">
          {getLeadParkName(item.enterpriseId)}
          {enterprise ? ` · ${enterprise.industry}` : ''}
        </p>
      </header>

      <section className="opportunity-section">
        <h3 className="opportunity-section__title">行为总结</h3>
        <p className="opportunity-section__body">{item.summary}</p>
      </section>

      <section className="opportunity-section">
        <h3 className="opportunity-section__title">这意味着</h3>
        <p className="opportunity-section__body">{item.implication}</p>
        <p className="opportunity-footnote">
          企业线索来自操作行为，不是销售线索池。不在这里改状态、分派负责人。
        </p>
      </section>

      <section className="opportunity-section">
        <h3 className="opportunity-section__title">关注内容</h3>
        <p className="opportunity-section__body">{item.focusContent}</p>
      </section>

      <section className="opportunity-section">
        <h3 className="opportunity-section__title">近期动作</h3>
        <ol className="lead-events">
          {item.events.map((event) => (
            <li key={event.id} className="lead-events__item">
              <span className="lead-events__time">{event.atLabel}</span>
              <span className="lead-events__kind">
                {formatBehaviorKind(event.kind)}
              </span>
              <span className="lead-events__title">{event.title}</span>
            </li>
          ))}
        </ol>
      </section>

      <p className="opportunity-footnote">
        企业名录在「企业」，办理队列在「服务办理」。
        {enterprise ? (
          <>
            {' '}
            <Link to="/enterprises">查看该企业所在园区</Link>
          </>
        ) : null}
      </p>
    </section>
  );
}
