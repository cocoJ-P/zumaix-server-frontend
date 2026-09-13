import type { ContentIntelligenceResult } from '../../../api/types';
import {
  formatConfidence,
  formatContentNature,
  formatOpportunityRelevance,
} from '../utils';

interface ContentAssessmentPanelProps {
  result: ContentIntelligenceResult;
}

export function ContentAssessmentPanel({ result }: ContentAssessmentPanelProps) {
  const { analysis } = result;
  const warnings = analysis.warnings ?? [];

  return (
    <section className="result-panel">
      <h2 className="result-panel__title">内容判断</h2>
      <div className="result-grid">
        <div>
          <div className="result-field__label">内容性质</div>
          <div className="result-field__value">
            {formatContentNature(analysis.content_nature)}
          </div>
        </div>
        <div>
          <div className="result-field__label">机会相关度</div>
          <div className="result-field__value">
            {formatOpportunityRelevance(analysis.opportunity_relevance)}
          </div>
        </div>
        <div>
          <div className="result-field__label">分析置信度</div>
          <div className="result-field__value">
            {formatConfidence(analysis.confidence)}
          </div>
        </div>
      </div>
      {warnings.length > 0 ? (
        <div className="notice">
          <div>分析提示</div>
          {warnings.map((warning) => (
            <p key={warning}>{warning}</p>
          ))}
        </div>
      ) : null}
    </section>
  );
}
