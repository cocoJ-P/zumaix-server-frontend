import type { UserSubmissionDetail, UserSubmissionSummary } from '../../../api/types';
import { IntelligenceResultView } from '../../intelligence/components/IntelligenceResultView';
import { formatSubmissionDate } from '../utils';
import { SubmissionContentPanel } from './SubmissionContentPanel';
import { SubmissionErrorPanel } from './SubmissionErrorPanel';
import { SubmissionInputPanel } from './SubmissionInputPanel';
import { SubmissionStatusBadge } from './SubmissionStatusBadge';
import { SubmissionTechnicalDetails } from './SubmissionTechnicalDetails';

interface SubmissionDetailProps {
  summary: UserSubmissionSummary | null;
  detail: UserSubmissionDetail | undefined;
  loading: boolean;
}

export function SubmissionDetail({
  summary,
  detail,
  loading,
}: SubmissionDetailProps) {
  if (!summary) {
    return (
      <section className="submission-detail submission-detail--empty">
        <p className="muted-copy">选择一条提交查看详情</p>
      </section>
    );
  }

  if (loading && !detail) {
    return (
      <section className="submission-detail">
        <p className="muted-copy">加载提交详情…</p>
      </section>
    );
  }

  if (!detail) {
    return (
      <section className="submission-detail">
        <p className="muted-copy">暂时无法加载这条提交的详情。</p>
      </section>
    );
  }

  const title = summary.display_title;
  const result = detail.intelligence?.result;

  return (
    <section className="submission-detail">
      <header className="submission-detail__header">
        <div className="submission-detail__title-row">
          <h2 className="submission-detail__title">{title}</h2>
          <SubmissionStatusBadge status={detail.submission.status} />
        </div>
        <p className="muted-copy">
          {detail.submitted_by.display_name}
          <br />
          {formatSubmissionDate(detail.submission.created_at)}
        </p>
      </header>

      <div className="result-stack">
        <SubmissionInputPanel submission={detail.submission} />
        <SubmissionContentPanel content={detail.content} />
        <SubmissionErrorPanel submission={detail.submission} />
        {detail.submission.status === 'succeeded' ? (
          <IntelligenceResultView result={result} />
        ) : null}
        {detail.submission.status === 'pending' ||
        detail.submission.status === 'ingesting' ||
        detail.submission.status === 'analyzing' ? (
          <section className="result-panel">
            <p className="muted-copy">智能分析尚未完成。</p>
          </section>
        ) : null}
        <SubmissionTechnicalDetails detail={detail} />
      </div>
    </section>
  );
}
