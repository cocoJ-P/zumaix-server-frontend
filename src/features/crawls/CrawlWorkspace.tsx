import { useMemo, useState } from 'react';
import { useCurrentIdentity } from '../../hooks/useCurrentIdentity';
import { CRAWL_JOBS, CRAWL_LOGS, WHITELIST_SITES } from './data';
import { CrawlComposer } from './components/CrawlComposer';
import { CrawlJobDetail } from './components/CrawlJobDetail';
import { CrawlJobList } from './components/CrawlJobList';
import { CrawlLogPanel } from './components/CrawlLogPanel';
import { CrawlStats } from './components/CrawlStats';
import { CrawlWhitelist } from './components/CrawlWhitelist';
import type {
  CrawlJob,
  CrawlJobStatusFilter,
  CrawlLogEntry,
  CrawlLogLevel,
  CrawlWorkspaceTab,
  WhitelistKind,
  WhitelistSite,
} from './types';
import {
  JOB_STATUS_FILTERS,
  filterCrawlJobs,
  filterCrawlLogs,
  findWhitelistSite,
  nowTimeLabel,
} from './utils';

const TABS: { id: CrawlWorkspaceTab; label: string }[] = [
  { id: 'jobs', label: '任务' },
  { id: 'whitelist', label: '白名单' },
  { id: 'logs', label: '运行日志' },
];

export function CrawlWorkspace() {
  const identity = useCurrentIdentity();
  const [tab, setTab] = useState<CrawlWorkspaceTab>('jobs');
  const [jobs, setJobs] = useState<CrawlJob[]>(CRAWL_JOBS);
  const [sites, setSites] = useState<WhitelistSite[]>(WHITELIST_SITES);
  const [logs, setLogs] = useState<CrawlLogEntry[]>(CRAWL_LOGS);
  const [statusFilter, setStatusFilter] = useState<CrawlJobStatusFilter>('all');
  const [selectedId, setSelectedId] = useState<string | null>(CRAWL_JOBS[0]?.id ?? null);
  const [composerOpen, setComposerOpen] = useState(false);
  const [mobileShowDetail, setMobileShowDetail] = useState(false);
  const [logLevel, setLogLevel] = useState<CrawlLogLevel | 'all'>('all');
  const [logFollowJob, setLogFollowJob] = useState(false);

  const filteredJobs = filterCrawlJobs(jobs, statusFilter);
  const resolvedSelectedId =
    selectedId && filteredJobs.some((job) => job.id === selectedId)
      ? selectedId
      : (filteredJobs[0]?.id ?? null);
  const selectedJob =
    jobs.find((job) => job.id === resolvedSelectedId) ?? null;
  const selectedSite = selectedJob
    ? findWhitelistSite(sites, selectedJob.whitelistId)
    : undefined;
  const jobLogs = filterCrawlLogs(logs, { jobId: resolvedSelectedId });
  const streamLogs = filterCrawlLogs(logs, {
    jobId: logFollowJob ? resolvedSelectedId : null,
    level: logLevel,
  });
  const enterpriseName = identity.data?.enterprise.name ?? '筑脉科技';

  const stats = useMemo(
    () => ({
      running: jobs.filter((job) => job.status === 'running').length,
      fetched: jobs.reduce((sum, job) => sum + job.fetched, 0),
      stored: jobs.reduce((sum, job) => sum + job.stored, 0),
      failed: jobs.filter((job) => job.status === 'failed').length,
      whitelistActive: sites.filter((site) => site.enabled).length,
    }),
    [jobs, sites],
  );

  function appendLog(
    jobId: string,
    level: CrawlLogLevel,
    message: string,
  ) {
    setLogs((current) => [
      {
        id: `log-${Date.now()}-${current.length}`,
        at: nowTimeLabel(),
        jobId,
        level,
        message,
      },
      ...current,
    ]);
  }

  function updateJob(jobId: string, patch: Partial<CrawlJob>) {
    setJobs((current) =>
      current.map((job) =>
        job.id === jobId ? { ...job, ...patch, updatedAtLabel: '刚刚' } : job,
      ),
    );
  }

  function pauseJob(jobId: string) {
    const job = jobs.find((item) => item.id === jobId);
    if (!job || job.status !== 'running') {
      return;
    }

    updateJob(jobId, { status: 'paused' });
    appendLog(jobId, 'info', `操作员暂停  已抓 ${job.fetched}/${job.planned}  保留断点`);
  }

  function resumeJob(jobId: string) {
    const job = jobs.find((item) => item.id === jobId);
    const site = job ? findWhitelistSite(sites, job.whitelistId) : undefined;
    if (!job || job.status !== 'paused' || !site?.enabled) {
      return;
    }

    updateJob(jobId, { status: 'running', lastHttp: '200 · 续跑' });
    appendLog(jobId, 'info', `从断点继续  ${site.host}${site.allowPath}  interval=${job.intervalSec}s`);
  }

  function startJob(jobId: string) {
    const job = jobs.find((item) => item.id === jobId);
    const site = job ? findWhitelistSite(sites, job.whitelistId) : undefined;
    if (!job || job.status !== 'queued' || !site?.enabled) {
      return;
    }

    updateJob(jobId, {
      status: 'running',
      startedAtLabel: '刚刚',
      lastHttp: '200 · 首包',
    });
    appendLog(
      jobId,
      'info',
      `启动任务  起点 ${job.startUrl}  depth=${job.depth}  遵守 robots.txt`,
    );
  }

  function retryJob(jobId: string) {
    const job = jobs.find((item) => item.id === jobId);
    const site = job ? findWhitelistSite(sites, job.whitelistId) : undefined;
    if (!job || job.status !== 'failed' || !site?.enabled) {
      return;
    }

    const startUrl = `https://${site.host}${site.allowPath}`;
    updateJob(jobId, {
      status: 'running',
      startUrl,
      failedPages: 0,
      lastHttp: '200 · 改道重试',
    });
    appendLog(
      jobId,
      'warn',
      `重试失败页  改从白名单路径 ${site.allowPath}  不再请求被 robots 拒绝的入口`,
    );
  }

  function pauseAll() {
    const running = jobs.filter((job) => job.status === 'running');
    if (running.length === 0) {
      return;
    }

    setJobs((current) =>
      current.map((job) =>
        job.status === 'running'
          ? { ...job, status: 'paused' as const, updatedAtLabel: '刚刚' }
          : job,
      ),
    );
    setLogs((current) => [
      ...running.map((job, index) => ({
        id: `log-${Date.now()}-pause-${index}`,
        at: nowTimeLabel(),
        jobId: job.id,
        level: 'info' as const,
        message: '操作员暂停全部  本任务进入已暂停',
      })),
      ...current,
    ]);
  }

  return (
    <div className="crawl-workspace">
      <div className="discovery-scope">
        <p className="discovery-scope__enterprise">当前企业：{enterpriseName}</p>
        <p className="muted-copy">
          只采集白名单内的公开页面。结果进入机会库待整理，不会直接出现在小程序。
        </p>
      </div>

      <CrawlStats {...stats} />

      <div className="opportunity-toolbar">
        <div className="submission-filters" role="tablist" aria-label="爬取工作区">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              className="intelligence-tab"
              aria-selected={tab === item.id}
              onClick={() => setTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="crawl-toolbar__actions">
          <button
            type="button"
            className="btn btn--secondary"
            onClick={pauseAll}
            disabled={stats.running === 0}
          >
            暂停全部
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => {
              setTab('jobs');
              setComposerOpen((open) => !open);
            }}
          >
            {composerOpen ? '收起新建' : '新建任务'}
          </button>
        </div>
      </div>

      <CrawlComposer
        open={composerOpen && tab === 'jobs'}
        sites={sites}
        onClose={() => setComposerOpen(false)}
        onCreate={(input) => {
          const site = findWhitelistSite(sites, input.whitelistId);
          if (!site?.enabled) {
            return '站点未启用，不能发起采集。';
          }

          const id = `job-${Date.now()}`;
          const next: CrawlJob = {
            id,
            title: input.title,
            whitelistId: input.whitelistId,
            startUrl: input.startUrl,
            status: 'running',
            fetched: 1,
            planned: input.depth === 1 ? 24 : 80,
            stored: 0,
            skipped: 0,
            failedPages: 0,
            intervalSec: input.intervalSec,
            depth: input.depth,
            lastHttp: '200 · 首包',
            startedAtLabel: '刚刚',
            updatedAtLabel: '刚刚',
          };
          setJobs((current) => [next, ...current]);
          setSelectedId(id);
          setStatusFilter('all');
          appendLog(
            id,
            'info',
            `启动任务  起点 ${input.startUrl}  depth=${input.depth}  interval=${input.intervalSec}s  白名单 ${site.host}`,
          );
          return null;
        }}
      />

      {tab === 'jobs' ? (
        <>
          <div className="submission-filters" role="tablist" aria-label="任务状态">
            {JOB_STATUS_FILTERS.map((filter) => (
              <button
                key={filter.id}
                type="button"
                role="tab"
                className="intelligence-tab"
                aria-selected={statusFilter === filter.id}
                onClick={() => {
                  setStatusFilter(filter.id);
                  setSelectedId(null);
                  setMobileShowDetail(false);
                }}
              >
                {filter.label}
              </button>
            ))}
          </div>
          <div
            className={`submission-split${mobileShowDetail ? ' submission-split--detail' : ''}`}
          >
            <aside className="submission-pane submission-pane--list">
              <CrawlJobList
                jobs={filteredJobs}
                sites={sites}
                selectedId={resolvedSelectedId}
                onSelect={(id) => {
                  setSelectedId(id);
                  setMobileShowDetail(true);
                }}
              />
            </aside>
            <div className="submission-pane submission-pane--detail">
              <CrawlJobDetail
                job={selectedJob}
                site={selectedSite}
                logs={jobLogs}
                onPause={() => selectedJob && pauseJob(selectedJob.id)}
                onResume={() => selectedJob && resumeJob(selectedJob.id)}
                onRetry={() => selectedJob && retryJob(selectedJob.id)}
                onStart={() => selectedJob && startJob(selectedJob.id)}
                onBack={() => setMobileShowDetail(false)}
              />
            </div>
          </div>
        </>
      ) : null}

      {tab === 'whitelist' ? (
        <CrawlWhitelist
          sites={sites}
          onToggle={(id) => {
            const site = findWhitelistSite(sites, id);
            if (!site) {
              return;
            }

            const enabled = !site.enabled;
            setSites((current) =>
              current.map((item) =>
                item.id === id ? { ...item, enabled } : item,
              ),
            );

            if (!enabled) {
              const affected = jobs.filter(
                (job) => job.whitelistId === id && job.status === 'running',
              );
              setJobs((current) =>
                current.map((job) =>
                  job.whitelistId === id && job.status === 'running'
                    ? { ...job, status: 'paused', updatedAtLabel: '刚刚' }
                    : job,
                ),
              );
              affected.forEach((job) => {
                appendLog(
                  job.id,
                  'warn',
                  `白名单停用 ${site.host}  已暂停任务，不再发请求`,
                );
              });
            }
          }}
          onRemove={(id) => {
            const blocked = jobs.some(
              (job) =>
                job.whitelistId === id &&
                (job.status === 'running' ||
                  job.status === 'paused' ||
                  job.status === 'queued'),
            );
            if (blocked) {
              return '还有未结束的任务绑定该站点。先暂停并处理完任务，再移除白名单。';
            }

            setSites((current) => current.filter((site) => site.id !== id));
            return null;
          }}
          onAdd={(input) => {
            if (sites.some((site) => site.host === input.host)) {
              return '该主机已在白名单中。';
            }

            const next: WhitelistSite = {
              id: `wl-${Date.now()}`,
              host: input.host,
              name: input.name,
              kind: input.kind as WhitelistKind,
              enabled: true,
              robots: 'allowed',
              allowPath: input.allowPath.startsWith('/')
                ? input.allowPath
                : `/${input.allowPath}`,
              addedAtLabel: '刚刚',
              note: '人工加入。首次采集前仍应核对 robots.txt 与公开范围。',
            };
            setSites((current) => [next, ...current]);
            return null;
          }}
        />
      ) : null}

      {tab === 'logs' ? (
        <section className="crawl-panel">
          <div className="crawl-panel__header">
            <h2 className="crawl-panel__title">运行日志</h2>
            <p className="muted-copy">静态工作台可写入操作记录，不会连接真实爬虫进程。</p>
          </div>
          <div className="crawl-log-toolbar">
            <div className="submission-filters" role="tablist" aria-label="日志级别">
              {(['all', 'info', 'warn', 'error'] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  role="tab"
                  className="intelligence-tab"
                  aria-selected={logLevel === level}
                  onClick={() => setLogLevel(level)}
                >
                  {level === 'all' ? '全部级别' : level.toUpperCase()}
                </button>
              ))}
            </div>
            <label className="crawl-log-follow">
              <input
                type="checkbox"
                checked={logFollowJob}
                onChange={(event) => setLogFollowJob(event.target.checked)}
              />
              仅看当前任务
              {selectedJob ? ` · ${selectedJob.title}` : ''}
            </label>
          </div>
          <CrawlLogPanel logs={streamLogs} emptyText="没有符合筛选的日志。" />
        </section>
      ) : null}
    </div>
  );
}
