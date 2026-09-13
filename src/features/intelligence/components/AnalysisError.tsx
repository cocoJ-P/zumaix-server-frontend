import type { ApiError } from '../../../api/errors';
import type { ErrorPhase, InputMode } from '../types';
import { getConsoleErrorMessage } from '../utils';

interface AnalysisErrorProps {
  error: ApiError;
  phase: ErrorPhase;
  mode: InputMode;
  canRetryAnalyze: boolean;
  onRetryAnalyze: () => void;
  onRetryAll: () => void;
  onSwitchToText: () => void;
  onReset: () => void;
}

export function AnalysisError({
  error,
  phase,
  mode,
  canRetryAnalyze,
  onRetryAnalyze,
  onRetryAll,
  onSwitchToText,
  onReset,
}: AnalysisErrorProps) {
  const message = getConsoleErrorMessage(error, phase, mode);
  const suggestText = phase === 'ingest' && mode === 'url';

  return (
    <div className="analysis-error" role="alert">
      <h2 className="analysis-error__title">分析未完成</h2>
      <p className="analysis-error__message">{message}</p>
      <div className="intelligence-actions">
        {canRetryAnalyze ? (
          <button type="button" className="btn" onClick={onRetryAnalyze}>
            重新分析
          </button>
        ) : (
          <button type="button" className="btn" onClick={onRetryAll}>
            重新分析
          </button>
        )}
        {suggestText ? (
          <button
            type="button"
            className="btn btn--secondary"
            onClick={onSwitchToText}
          >
            切换到“粘贴正文”
          </button>
        ) : null}
        <button type="button" className="btn btn--ghost" onClick={onReset}>
          重新输入
        </button>
      </div>
    </div>
  );
}
