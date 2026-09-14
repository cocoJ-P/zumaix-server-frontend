import type {
  IntelligenceAnalyzeResponse,
  IngestResponse,
} from '../../../api/types';
import { IntelligenceResultView } from './IntelligenceResultView';
import { TechnicalDetails } from './TechnicalDetails';

interface AnalysisResultProps {
  ingest: IngestResponse;
  analyze: IntelligenceAnalyzeResponse;
}

export function AnalysisResult({ ingest, analyze }: AnalysisResultProps) {
  const content = ingest.normalized_content;

  return (
    <div className="result-stack">
      <section className="result-panel source-preview">
        <h2 className="result-panel__title">内容来源</h2>
        {content.input_type === 'url' ? (
          <>
            <p>{content.resolved_url ?? content.source_url ?? '—'}</p>
            <p>{content.title ?? ingest.source.title ?? '—'}</p>
            <p>{content.publisher ?? ingest.source.publisher ?? '—'}</p>
          </>
        ) : (
          <p>粘贴正文</p>
        )}
        {content.excerpt ? (
          <p className="source-preview__excerpt">{content.excerpt}</p>
        ) : null}
      </section>

      <IntelligenceResultView result={analyze.intelligence_result} />
      <TechnicalDetails ingest={ingest} analyze={analyze} />
    </div>
  );
}
