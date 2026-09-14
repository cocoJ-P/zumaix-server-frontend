import type { SubmissionContentSummary } from '../../../api/types';
import { formatAnalysisWarning, isHttpUrl } from '../../intelligence/utils';
import { formatExtractionStatus, formatFetchStatus } from '../utils';

interface SubmissionContentPanelProps {
  content: SubmissionContentSummary | null | undefined;
}

export function SubmissionContentPanel({ content }: SubmissionContentPanelProps) {
  if (!content) {
    return (
      <section className="result-panel">
        <h2 className="result-panel__title">内容解析</h2>
        <p className="muted-copy">尚未生成内容解析结果。</p>
      </section>
    );
  }

  const url = content.resolved_url;
  const warnings = content.warnings ?? [];

  return (
    <section className="result-panel">
      <h2 className="result-panel__title">内容解析</h2>
      <div className="result-grid">
        <div>
          <div className="result-field__label">标题</div>
          <div className="result-field__value">{content.title ?? '—'}</div>
        </div>
        <div>
          <div className="result-field__label">发布主体</div>
          <div className="result-field__value">{content.publisher ?? '—'}</div>
        </div>
        <div>
          <div className="result-field__label">读取状态</div>
          <div className="result-field__value">
            {formatFetchStatus(content.fetch_status)}
          </div>
        </div>
        <div>
          <div className="result-field__label">提取状态</div>
          <div className="result-field__value">
            {formatExtractionStatus(content.extraction_status)}
          </div>
        </div>
      </div>
      {url ? (
        <p className="result-summary submission-break">
          {isHttpUrl(url) ? (
            <a href={url} target="_blank" rel="noopener noreferrer">
              {url}
            </a>
          ) : (
            url
          )}
        </p>
      ) : null}
      {content.excerpt ? (
        <p className="source-preview__excerpt">{content.excerpt}</p>
      ) : null}
      {warnings.length > 0 ? (
        <div className="notice">
          <div>分析提示</div>
          {warnings.map((warning) => (
            <p key={warning}>{formatAnalysisWarning(warning)}</p>
          ))}
        </div>
      ) : null}
    </section>
  );
}
