import type {
  CrawlJob,
  CrawlJobStatus,
  CrawlJobStatusFilter,
  CrawlLogEntry,
  CrawlLogLevel,
  RobotsPolicy,
  WhitelistKind,
  WhitelistSite,
} from './types';

export const JOB_STATUS_LABEL: Record<CrawlJobStatus, string> = {
  running: '运行中',
  paused: '已暂停',
  queued: '排队中',
  completed: '已完成',
  failed: '失败',
};

export const JOB_STATUS_FILTERS: { id: CrawlJobStatusFilter; label: string }[] = [
  { id: 'all', label: '全部' },
  { id: 'running', label: '运行中' },
  { id: 'paused', label: '已暂停' },
  { id: 'queued', label: '排队中' },
  { id: 'completed', label: '已完成' },
  { id: 'failed', label: '失败' },
];

export const LOG_LEVEL_LABEL: Record<CrawlLogLevel | 'all', string> = {
  all: '全部级别',
  info: 'INFO',
  warn: 'WARN',
  error: 'ERROR',
};

const KIND_LABEL: Record<WhitelistKind, string> = {
  policy: '政策',
  vendor: '服务商',
  event: '活动',
};

const ROBOTS_LABEL: Record<RobotsPolicy, string> = {
  allowed: 'robots 允许',
  restricted: 'robots 受限',
};

export function formatCrawlJobStatus(status: CrawlJobStatus): string {
  return JOB_STATUS_LABEL[status];
}

export function formatWhitelistKind(kind: WhitelistKind): string {
  return KIND_LABEL[kind];
}

export function formatRobotsPolicy(robots: RobotsPolicy): string {
  return ROBOTS_LABEL[robots];
}

export function filterCrawlJobs(
  jobs: CrawlJob[],
  filter: CrawlJobStatusFilter,
): CrawlJob[] {
  if (filter === 'all') {
    return jobs;
  }

  return jobs.filter((job) => job.status === filter);
}

export function filterCrawlLogs(
  logs: CrawlLogEntry[],
  options: { jobId?: string | null; level?: CrawlLogLevel | 'all' },
): CrawlLogEntry[] {
  return logs.filter((log) => {
    if (options.jobId && log.jobId !== options.jobId) {
      return false;
    }

    if (options.level && options.level !== 'all' && log.level !== options.level) {
      return false;
    }

    return true;
  });
}

export function crawlProgressPercent(job: CrawlJob): number {
  if (job.planned <= 0) {
    return 0;
  }

  return Math.min(100, Math.round((job.fetched / job.planned) * 100));
}

export function nowTimeLabel(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const time = now.toLocaleTimeString('zh-CN', { hour12: false });
  return `${month}-${day} ${time}`;
}

export function isValidHost(value: string): boolean {
  return /^[a-z0-9][a-z0-9.-]*\.[a-z]{2,}$/i.test(value.trim());
}

export function normalizeHost(value: string): string {
  return value
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/\/.*$/, '')
    .toLowerCase();
}

export function findWhitelistSite(
  sites: WhitelistSite[],
  id: string,
): WhitelistSite | undefined {
  return sites.find((site) => site.id === id);
}
