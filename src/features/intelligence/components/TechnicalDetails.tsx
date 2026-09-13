import type {
  IntelligenceAnalyzeResponse,
  IngestResponse,
} from '../../../api/types';
import { formatDateTime } from '../utils';

interface TechnicalDetailsProps {
  ingest: IngestResponse;
  analyze: IntelligenceAnalyzeResponse;
}

export function TechnicalDetails({ ingest, analyze }: TechnicalDetailsProps) {
  const run = analyze.run;

  return (
    <details className="tech-details">
      <summary className="tech-details__summary">技术详情</summary>
      <div className="tech-details__body result-grid">
        <TechField label="Source ID" value={ingest.source.id} />
        <TechField label="Ingestion ID" value={ingest.ingestion.id} />
        <TechField label="Run ID" value={run.id} />
        <TechField label="Run Status" value={run.status} />
        <TechField
          label="Reused"
          value={analyze.reused ? '已复用已有分析' : '新分析'}
        />
        <TechField label="Rule Version" value={run.rule_version} />
        <TechField label="Prompt Version" value={run.prompt_version} />
        <TechField label="Provider" value={run.provider} />
        <TechField label="Model" value={run.model} />
        <TechField
          label="Input Char Count"
          value={String(run.input_char_count)}
        />
        <TechField
          label="Input Truncated"
          value={run.input_truncated ? '是' : '否'}
        />
        <TechField label="Started At" value={formatDateTime(run.started_at)} />
        <TechField
          label="Completed At"
          value={formatDateTime(run.completed_at)}
        />
      </div>
    </details>
  );
}

function TechField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="result-field__label">{label}</div>
      <div className="result-field__value">{value}</div>
    </div>
  );
}
