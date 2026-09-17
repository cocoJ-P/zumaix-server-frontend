import { EmptyState } from '../../../components/common/EmptyState';
import type { ParkEnterprise } from '../types';
import {
  formatParkEnterpriseStatus,
  formatParkName,
  getPark,
} from '../utils';
import { EnterpriseStatusBadge } from './EnterpriseStatusBadge';

interface EnterpriseDetailProps {
  item: ParkEnterprise | null;
}

export function EnterpriseDetailPanel({ item }: EnterpriseDetailProps) {
  if (!item) {
    return (
      <section className="submission-detail submission-detail--empty">
        <EmptyState
          title="请选择一家企业"
          description="从园区卡片中选择一家企业，查看在园情况与当前服务需要。"
        />
      </section>
    );
  }

  const park = getPark(item.parkId);

  return (
    <section className="submission-detail" aria-label="企业详情">
      <header className="submission-detail__header">
        <div className="submission-detail__title-row">
          <h2 className="submission-detail__title">{item.name}</h2>
          <EnterpriseStatusBadge status={item.status} />
        </div>
        <p className="muted-copy">
          {formatParkName(item.parkId)} · {item.industry}
        </p>
      </header>

      <section className="opportunity-section">
        <h3 className="opportunity-section__title">在园情况</h3>
        <dl className="result-grid">
          <Fact label="所属园区" value={formatParkName(item.parkId)} />
          <Fact label="状态" value={formatParkEnterpriseStatus(item.status)} />
          <Fact label="阶段" value={item.stage} />
          <Fact label="规模" value={item.peopleLabel} />
          <Fact label="行业" value={item.industry} />
        </dl>
        {park ? <p className="opportunity-footnote">{park.summary}</p> : null}
      </section>

      <section className="opportunity-section">
        <h3 className="opportunity-section__title">企业简介</h3>
        <p className="opportunity-section__body">{item.summary}</p>
      </section>

      <section className="opportunity-section">
        <h3 className="opportunity-section__title">当前需要</h3>
        <p className="opportunity-section__body">{item.needs}</p>
      </section>
    </section>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="result-field__label">{label}</div>
      <div className="result-field__value">{value}</div>
    </div>
  );
}
