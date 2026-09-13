import type { ContentIntelligenceResult } from '../../../api/types';
import {
  formatApparentSourceType,
  formatIntermediaryLevel,
  formatMarketingLevel,
  formatOriginalityClaim,
} from '../utils';

interface SourceAssessmentPanelProps {
  result: ContentIntelligenceResult;
}

export function SourceAssessmentPanel({ result }: SourceAssessmentPanelProps) {
  const assessment = result.source_assessment;
  const marketingSignals = assessment.marketing_signals ?? [];
  const intermediarySignals = assessment.intermediary_signals ?? [];

  return (
    <section className="result-panel">
      <h2 className="result-panel__title">来源与内容特征</h2>
      <div className="result-grid">
        <div>
          <div className="result-field__label">看起来像什么来源</div>
          <div className="result-field__value">
            {formatApparentSourceType(assessment.apparent_source_type)}
          </div>
        </div>
        <div>
          <div className="result-field__label">营销程度</div>
          <div className="result-field__value">
            {formatMarketingLevel(assessment.marketing_level)}
          </div>
        </div>
        <div>
          <div className="result-field__label">中介特征</div>
          <div className="result-field__value">
            {formatIntermediaryLevel(assessment.intermediary_level)}
          </div>
        </div>
      </div>
      <div className="result-block">
        <div className="result-field__label">内容形态</div>
        <div className="result-field__value">
          {formatOriginalityClaim(assessment.originality_claim)}
        </div>
      </div>
      {marketingSignals.length > 0 ? (
        <div className="tag-list" aria-label="营销特征">
          {marketingSignals.map((signal) => (
            <span key={signal} className="feature-tag">
              {signal}
            </span>
          ))}
        </div>
      ) : null}
      {intermediarySignals.length > 0 ? (
        <div className="tag-list" aria-label="中介特征">
          {intermediarySignals.map((signal) => (
            <span key={signal} className="feature-tag">
              {signal}
            </span>
          ))}
        </div>
      ) : null}
    </section>
  );
}
