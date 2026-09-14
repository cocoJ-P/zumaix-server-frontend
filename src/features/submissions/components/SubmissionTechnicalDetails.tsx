import type { UserSubmissionDetail } from '../../../api/types';

interface SubmissionTechnicalDetailsProps {
  detail: UserSubmissionDetail;
}

export function SubmissionTechnicalDetails({
  detail,
}: SubmissionTechnicalDetailsProps) {
  const { submission, intelligence } = detail;

  return (
    <details className="tech-details">
      <summary className="tech-details__summary">技术信息</summary>
      <div className="tech-details__body result-grid">
        <TechField label="Submission ID" value={submission.id} />
        <TechField label="Source ID" value={submission.source_id} />
        <TechField label="Ingestion ID" value={submission.ingestion_id} />
        <TechField
          label="Intelligence Run ID"
          value={submission.intelligence_run_id ?? intelligence?.run_id}
        />
        {submission.error_code ? (
          <TechField label="错误代码" value={submission.error_code} />
        ) : null}
        {submission.error_message ? (
          <TechField label="Backend Message" value={submission.error_message} />
        ) : null}
      </div>
    </details>
  );
}

function TechField({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div>
      <div className="result-field__label">{label}</div>
      <div className="result-field__value">{value ?? '—'}</div>
    </div>
  );
}
