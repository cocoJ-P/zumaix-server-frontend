import type {
  ConsoleState,
  ErrorPhase,
  InputMode,
  ProgressStepStatus,
} from '../types';

const STEPS = ['内容输入', '内容解析', '智能分析', '完成'] as const;

interface AnalysisProgressProps {
  state: ConsoleState;
  mode: InputMode;
  errorPhase?: ErrorPhase | null;
}

function getStepStatus(
  index: number,
  state: ConsoleState,
  errorPhase?: ErrorPhase | null,
): ProgressStepStatus {
  if (state === 'idle') {
    return index === 0 ? 'active' : 'pending';
  }

  if (state === 'ingesting') {
    if (index === 0) return 'completed';
    if (index === 1) return 'active';
    return 'pending';
  }

  if (state === 'analyzing') {
    if (index <= 1) return 'completed';
    if (index === 2) return 'active';
    return 'pending';
  }

  if (state === 'success') {
    return 'completed';
  }

  if (index === 0) return 'completed';
  if (errorPhase === 'ingest') {
    if (index === 1) return 'failed';
    return 'pending';
  }

  if (index === 1) return 'completed';
  if (index === 2) return 'failed';
  return 'pending';
}

function getMessage(state: ConsoleState, mode: InputMode): string | null {
  if (state === 'ingesting') {
    return mode === 'url'
      ? '正在读取网页并提取正文'
      : '正在整理正文内容';
  }

  if (state === 'analyzing') {
    return '内容已解析。正在理解内容中的机会信息…';
  }

  return null;
}

export function AnalysisProgress({
  state,
  mode,
  errorPhase,
}: AnalysisProgressProps) {
  const message = getMessage(state, mode);

  return (
    <div aria-live="polite">
      <div className="progress-list">
        {STEPS.map((label, index) => {
          const status = getStepStatus(index, state, errorPhase);

          return (
            <div
              key={label}
              className={`progress-step progress-step--${status}`}
            >
              <div className="progress-step__index">
                {index + 1}
              </div>
              <div className="progress-step__label">{label}</div>
            </div>
          );
        })}
      </div>
      {message ? <p className="progress-message">{message}</p> : null}
    </div>
  );
}
