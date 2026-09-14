import type { ContentIntelligenceResult } from '../../../api/types';
import { ContentAssessmentPanel } from './ContentAssessmentPanel';
import { EvidencePanel } from './EvidencePanel';
import { OpportunityClaimPanel } from './OpportunityClaimPanel';
import { RequirementsPanel } from './RequirementsPanel';
import { SourceAssessmentPanel } from './SourceAssessmentPanel';

interface IntelligenceResultViewProps {
  result: ContentIntelligenceResult | null | undefined;
}

export function IntelligenceResultView({ result }: IntelligenceResultViewProps) {
  if (!result) {
    return (
      <section className="result-panel">
        <p className="muted-copy">
          分析已完成，但当前没有可展示的结构化结果。
        </p>
      </section>
    );
  }

  const claim = result.opportunity_claim;
  const materials = claim?.claimed_required_materials ?? [];
  const process = claim?.claimed_application_process ?? [];

  return (
    <>
      <ContentAssessmentPanel result={result} />
      <SourceAssessmentPanel result={result} />
      <OpportunityClaimPanel claim={claim} />
      {claim ? (
        <>
          <RequirementsPanel claim={claim} />
          <section className="result-panel">
            <h2 className="result-panel__title">内容中提到的申报材料</h2>
            {materials.length === 0 ? (
              <p className="muted-copy">当前内容未明确列出材料。</p>
            ) : (
              <ul className="material-list">
                {materials.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </section>
          <section className="result-panel">
            <h2 className="result-panel__title">内容中提到的申报流程</h2>
            {process.length === 0 ? (
              <p className="muted-copy">当前内容未明确列出流程。</p>
            ) : (
              <ol className="process-list">
                {process.map((item, index) => (
                  <li key={`${index}-${item}`}>
                    {index + 1}. {item}
                  </li>
                ))}
              </ol>
            )}
          </section>
        </>
      ) : null}
      <EvidencePanel evidence={result.evidence ?? []} />
    </>
  );
}
