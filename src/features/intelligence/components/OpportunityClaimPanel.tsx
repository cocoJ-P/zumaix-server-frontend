import type { OpportunityClaim } from '../../../api/types';
import {
  formatClaimedStatus,
  formatDate,
  formatDisplayValue,
  formatFundingAmount,
  formatOpportunityType,
} from '../utils';

interface OpportunityClaimPanelProps {
  claim: OpportunityClaim | null | undefined;
}

export function OpportunityClaimPanel({ claim }: OpportunityClaimPanelProps) {
  if (!claim) {
    return (
      <section className="result-panel">
        <h2 className="result-panel__title">当前内容声称的机会</h2>
        <p className="muted-copy">
          当前内容中没有识别出足够明确的具体机会。
        </p>
      </section>
    );
  }

  const resource = claim.claimed_resource_value;
  const hasFunding = Boolean(resource?.funding?.amount || resource?.funding?.description);
  const hasScenario = resource?.scenario !== null && resource?.scenario !== undefined && resource.scenario !== false;
  const hasFinancing = Boolean(resource?.financing);
  const hasService = Boolean(resource?.service);
  const hasOther = Boolean(resource?.other && resource.other.length > 0);
  const hasResource = hasFunding || hasScenario || hasFinancing || hasService || hasOther;

  return (
    <section className="result-panel">
      <h2 className="result-panel__title">当前内容声称的机会</h2>
      <div className="result-grid">
        <div>
          <div className="result-field__label">机会类型</div>
          <div className="result-field__value">
            {formatOpportunityType(claim.claimed_type)}
          </div>
        </div>
        <div>
          <div className="result-field__label">机会名称</div>
          <div className="result-field__value">
            {formatDisplayValue(claim.claimed_title)}
          </div>
        </div>
        <div>
          <div className="result-field__label">声称发布主体</div>
          <div className="result-field__value">
            {formatDisplayValue(claim.claimed_issuer)}
          </div>
        </div>
        <div>
          <div className="result-field__label">地区</div>
          <div className="result-field__value">
            {formatDisplayValue(claim.claimed_region)}
          </div>
        </div>
        <div>
          <div className="result-field__label">声称发布日期</div>
          <div className="result-field__value">
            {formatDate(claim.claimed_publish_date)}
          </div>
        </div>
        <div>
          <div className="result-field__label">声称截止时间</div>
          <div className="result-field__value">
            {formatDate(claim.claimed_deadline)}
          </div>
        </div>
        <div>
          <div className="result-field__label">内容中的状态</div>
          <div className="result-field__value">
            {formatClaimedStatus(claim.claimed_status)}
          </div>
        </div>
      </div>
      {claim.claimed_summary ? (
        <p className="result-summary">{claim.claimed_summary}</p>
      ) : null}
      {hasResource ? (
        <div className="result-summary">
          <div className="result-field__label">机会价值</div>
          {hasFunding ? (
            <p className="result-field__value">
              内容提到的支持金额：
              {formatFundingAmount(
                resource?.funding?.amount,
                resource?.funding?.description,
              )}
            </p>
          ) : null}
          {hasScenario ? (
            <p className="result-field__value">
              场景：
              {typeof resource?.scenario === 'string'
                ? resource.scenario
                : '内容中有提到'}
            </p>
          ) : null}
          {hasFinancing ? (
            <p className="result-field__value">融资：{resource?.financing}</p>
          ) : null}
          {hasService ? (
            <p className="result-field__value">服务：{resource?.service}</p>
          ) : null}
          {hasOther
            ? resource?.other?.map((item) => (
                <p key={item} className="result-field__value">
                  {item}
                </p>
              ))
            : null}
        </div>
      ) : null}
      {claim.claimed_official_url ? (
        <p className="result-summary">
          内容中提到的官方链接：{' '}
          <a
            href={claim.claimed_official_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            打开链接
          </a>
        </p>
      ) : null}
    </section>
  );
}
