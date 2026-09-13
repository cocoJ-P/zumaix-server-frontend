export type InputMode = 'url' | 'text';

export type ConsoleState =
  | 'idle'
  | 'ingesting'
  | 'analyzing'
  | 'success'
  | 'error';

export type ErrorPhase = 'ingest' | 'analyze';

export type ProgressStepStatus = 'pending' | 'active' | 'completed' | 'failed';
