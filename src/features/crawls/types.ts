export type CrawlJobStatus =
  | 'running'
  | 'paused'
  | 'queued'
  | 'completed'
  | 'failed';

export type CrawlJobStatusFilter = 'all' | CrawlJobStatus;

export type CrawlLogLevel = 'info' | 'warn' | 'error';

export type CrawlWorkspaceTab = 'jobs' | 'whitelist' | 'logs';

export type WhitelistKind = 'policy' | 'vendor' | 'event';

export type RobotsPolicy = 'allowed' | 'restricted';

export interface WhitelistSite {
  id: string;
  host: string;
  name: string;
  kind: WhitelistKind;
  enabled: boolean;
  robots: RobotsPolicy;
  allowPath: string;
  addedAtLabel: string;
  note: string;
}

export interface CrawlJob {
  id: string;
  title: string;
  whitelistId: string;
  startUrl: string;
  status: CrawlJobStatus;
  fetched: number;
  planned: number;
  stored: number;
  skipped: number;
  failedPages: number;
  intervalSec: number;
  depth: number;
  lastHttp: string;
  startedAtLabel: string;
  updatedAtLabel: string;
}

export interface CrawlLogEntry {
  id: string;
  at: string;
  jobId: string;
  level: CrawlLogLevel;
  message: string;
}
