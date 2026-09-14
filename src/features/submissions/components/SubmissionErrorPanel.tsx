import type { SubmissionRecord } from '../../../api/types';
import {
  formatSubmissionFailureStage,
  mapSubmissionError,
} from '../utils';

interface SubmissionErrorPanelProps {
  submission: SubmissionRecord;
}

export function SubmissionErrorPanel({ submission }: SubmissionErrorPanelProps) {
  if (submission.status !== 'failed') {
    return null;
  }

  return (
    <section className="result-panel">
      <h2 className="result-panel__title">处理失败</h2>
      <div className="result-grid">
        <div>
          <div className="result-field__label">失败阶段</div>
          <div className="result-field__value">
            {formatSubmissionFailureStage(submission.failure_stage)}
          </div>
        </div>
        <div>
          <div className="result-field__label">错误说明</div>
          <div className="result-field__value">
            {mapSubmissionError(submission.error_code)}
          </div>
        </div>
      </div>
    </section>
  );
}
