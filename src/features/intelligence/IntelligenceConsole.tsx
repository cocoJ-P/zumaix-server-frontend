import { useState } from 'react';
import { ApiError } from '../../api/errors';
import type {
  IntelligenceAnalyzeResponse,
  IngestResponse,
} from '../../api/types';
import { AnalysisError } from './components/AnalysisError';
import { AnalysisProgress } from './components/AnalysisProgress';
import { AnalysisResult } from './components/AnalysisResult';
import { IntelligenceInput } from './components/IntelligenceInput';
import {
  useAnalyzeOpportunitySource,
  useIngestContent,
} from './hooks';
import type { ConsoleState, ErrorPhase, InputMode } from './types';
import { isHttpUrl } from './utils';

export function IntelligenceConsole() {
  const ingestMutation = useIngestContent();
  const analyzeMutation = useAnalyzeOpportunitySource();

  const [mode, setMode] = useState<InputMode>('url');
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [state, setState] = useState<ConsoleState>('idle');
  const [error, setError] = useState<ApiError | null>(null);
  const [errorPhase, setErrorPhase] = useState<ErrorPhase | null>(null);
  const [validationMessage, setValidationMessage] = useState<string | null>(
    null,
  );
  const [ingestResult, setIngestResult] = useState<IngestResponse | null>(null);
  const [analyzeResult, setAnalyzeResult] =
    useState<IntelligenceAnalyzeResponse | null>(null);

  const busy = state === 'ingesting' || state === 'analyzing';

  function resetToInput() {
    setState('idle');
    setError(null);
    setErrorPhase(null);
    setValidationMessage(null);
    setIngestResult(null);
    setAnalyzeResult(null);
  }

  function validate(): boolean {
    if (mode === 'url') {
      const value = url.trim();
      if (!value || !isHttpUrl(value)) {
        setValidationMessage('链接格式不正确');
        return false;
      }
      return true;
    }

    if (!text.trim()) {
      setValidationMessage('请粘贴正文内容');
      return false;
    }

    return true;
  }

  async function runAnalyze(sourceId: string, ingestionId: string) {
    setState('analyzing');
    setErrorPhase(null);
    const analyze = await analyzeMutation.mutateAsync({
      sourceId,
      ingestionId,
    });
    setAnalyzeResult(analyze);
    setState('success');
  }

  async function handleSubmit() {
    setValidationMessage(null);
    if (!validate()) {
      return;
    }

    setError(null);
    setErrorPhase(null);
    setAnalyzeResult(null);
    setIngestResult(null);

    let phase: ErrorPhase = 'ingest';
    try {
      setState('ingesting');
      const ingest = await ingestMutation.mutateAsync({
        content_type: mode,
        content: mode === 'url' ? url.trim() : text.trim(),
      });
      setIngestResult(ingest);
      phase = 'analyze';
      await runAnalyze(ingest.source.id, ingest.ingestion.id);
    } catch (caught) {
      const apiError =
        caught instanceof ApiError
          ? caught
          : new ApiError({
              code: 'UNKNOWN_ERROR',
              message: '筑脉企服 Backend 请求失败',
            });
      setError(apiError);
      setErrorPhase(phase);
      setState('error');
    }
  }

  async function handleRetryAnalyze() {
    if (!ingestResult) {
      await handleSubmit();
      return;
    }

    setError(null);
    try {
      await runAnalyze(ingestResult.source.id, ingestResult.ingestion.id);
    } catch (caught) {
      const apiError =
        caught instanceof ApiError
          ? caught
          : new ApiError({
              code: 'UNKNOWN_ERROR',
              message: '筑脉企服 Backend 请求失败',
            });
      setError(apiError);
      setErrorPhase('analyze');
      setState('error');
    }
  }

  return (
    <div className="intelligence-console">
      <p className="intelligence-note">
        当前展示的是系统对输入内容的结构化理解，不是事实核验。尚未执行外部官方来源搜索、真实性验证或机会归一。
      </p>

      <IntelligenceInput
        mode={mode}
        url={url}
        text={text}
        disabled={busy}
        onModeChange={(nextMode) => {
          setMode(nextMode);
          setValidationMessage(null);
        }}
        onUrlChange={setUrl}
        onTextChange={setText}
        onSubmit={() => {
          void handleSubmit();
        }}
      />

      {validationMessage ? (
        <p className="analysis-error__message" role="alert">
          {validationMessage}
        </p>
      ) : null}

      {state !== 'idle' ? (
        <AnalysisProgress state={state} mode={mode} errorPhase={errorPhase} />
      ) : null}

      {state === 'error' && error && errorPhase ? (
        <AnalysisError
          error={error}
          phase={errorPhase}
          mode={mode}
          canRetryAnalyze={Boolean(ingestResult) && errorPhase === 'analyze'}
          onRetryAnalyze={() => {
            void handleRetryAnalyze();
          }}
          onRetryAll={() => {
            void handleSubmit();
          }}
          onSwitchToText={() => {
            setMode('text');
            resetToInput();
          }}
          onReset={resetToInput}
        />
      ) : null}

      {state === 'success' && ingestResult && analyzeResult ? (
        <>
          <div className="intelligence-actions">
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => {
                void handleRetryAnalyze();
              }}
            >
              重新分析
            </button>
            <button type="button" className="btn btn--ghost" onClick={resetToInput}>
              分析新内容
            </button>
          </div>
          <AnalysisResult ingest={ingestResult} analyze={analyzeResult} />
        </>
      ) : null}
    </div>
  );
}
