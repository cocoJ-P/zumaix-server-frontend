import { useState } from 'react';
import type { SubmissionRecord } from '../../../api/types';
import { isHttpUrl } from '../../intelligence/utils';
import { formatSubmissionInputType } from '../utils';

interface SubmissionInputPanelProps {
  submission: SubmissionRecord;
}

export function SubmissionInputPanel({ submission }: SubmissionInputPanelProps) {
  const [expanded, setExpanded] = useState(false);
  const content = submission.input_content;
  const longContent = content.length > 280;
  const url = isHttpUrl(content) ? content : null;

  return (
    <section className="result-panel">
      <h2 className="result-panel__title">提交内容</h2>
      <div className="result-field__label">输入方式</div>
      <p className="result-field__value">
        {formatSubmissionInputType(submission.input_type)}
      </p>
      <div className="result-field__label">用户提交内容</div>
      {submission.input_type === 'url' && url ? (
        <p className="submission-break">
          <a href={url} target="_blank" rel="noopener noreferrer">
            {content}
          </a>
        </p>
      ) : (
        <>
          <p
            className={`submission-input__body${expanded ? '' : ' submission-input__body--clamp'}`}
          >
            {content}
          </p>
          {longContent ? (
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => setExpanded((value) => !value)}
            >
              {expanded ? '收起' : '展开全文'}
            </button>
          ) : null}
        </>
      )}
    </section>
  );
}
