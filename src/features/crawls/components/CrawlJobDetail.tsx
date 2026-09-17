import { EmptyState } from '../../../components/common/EmptyState';
import type { CrawlJob, CrawlLogEntry, WhitelistSite } from '../types';
import {
  crawlProgressPercent,
  formatRobotsPolicy,
  formatWhitelistKind,
} from '../utils';
import { CrawlLogPanel } from './CrawlLogPanel';
import { CrawlStatusBadge } from './CrawlStatusBadge';

interface CrawlJobDetailProps {
  job: CrawlJob | null;
  site: WhitelistSite | undefined;
  logs: CrawlLogEntry[];
  onPause: () => void;
  onResume: () => void;
  onRetry: () => void;
  onStart: () => void;
  onBack?: () => void;
}

export function CrawlJobDetail({
  job,
  site,
  logs,
  onPause,
  onResume,
  onRetry,
  onStart,
  onBack,
}: CrawlJobDetailProps) {
  if (!job) {
    return (
      <section className="submission-detail submission-detail--empty">
        <EmptyState
          title="请选择一个任务"
          description="从左侧查看运行中、失败或已完成的采集任务。"
        />
      </section>
    );
  }

  const percent = crawlProgressPercent(job);
  const siteEnabled = site?.enabled ?? false;

  return (
    <section className="submission-detail" aria-label="任务详情">
      {onBack ? (
        <button type="button" className="btn btn--ghost submission-back" onClick={onBack}>
          返回列表
        </button>
      ) : null}

      <header className="submission-detail__header">
        <div className="submission-detail__title-row">
          <h2 className="submission-detail__title">{job.title}</h2>
          <CrawlStatusBadge status={job.status} />
        </div>
        <p className="muted-copy">{job.startUrl}</p>
      </header>

      <div className="crawl-progress crawl-progress--detail" aria-label={`进度 ${percent}%`}>
        <span className="crawl-progress__bar" style={{ width: `${percent}%` }} />
      </div>
      <p className="crawl-progress__caption">
        {job.fetched} / {job.planned} 页 · {percent}%
      </p>

      {!siteEnabled ? (
        <p className="crawl-banner crawl-banner--warn">
          白名单已停用，不会继续向该主机发请求。启用站点后再开始或继续。
        </p>
      ) : null}

      {site?.robots === 'restricted' ? (
        <p className="crawl-banner">
          该站点 robots.txt 受限。当前允许路径 {site.allowPath}，越界请求会被拒绝或跳过。
        </p>
      ) : null}

      <div className="crawl-actions">
        {job.status === 'running' ? (
          <button type="button" className="btn btn--secondary" onClick={onPause}>
            暂停
          </button>
        ) : null}
        {job.status === 'paused' ? (
          <button
            type="button"
            className="btn"
            onClick={onResume}
            disabled={!siteEnabled}
          >
            继续
          </button>
        ) : null}
        {job.status === 'queued' ? (
          <button
            type="button"
            className="btn"
            onClick={onStart}
            disabled={!siteEnabled}
          >
            开始
          </button>
        ) : null}
        {job.status === 'failed' ? (
          <button
            type="button"
            className="btn"
            onClick={onRetry}
            disabled={!siteEnabled}
          >
            重试失败页
          </button>
        ) : null}
      </div>

      <section className="opportunity-section">
        <h3 className="opportunity-section__title">任务状态</h3>
        <dl className="result-grid">
          <Fact label="已抓取" value={`${job.fetched} 页`} />
          <Fact label="计划总量" value={`${job.planned} 页`} />
          <Fact label="入库待整理" value={`${job.stored} 条`} />
          <Fact label="跳过" value={`${job.skipped} 页`} />
          <Fact label="失败页" value={`${job.failedPages} 页`} />
          <Fact label="最近响应" value={job.lastHttp} />
          <Fact label="间隔" value={`${job.intervalSec} 秒 / 请求`} />
          <Fact label="深度" value={`${job.depth} 层`} />
          <Fact label="开始时间" value={job.startedAtLabel} />
        </dl>
      </section>

      {site ? (
        <section className="opportunity-section">
          <h3 className="opportunity-section__title">白名单约束</h3>
          <dl className="result-grid">
            <Fact label="站点" value={site.name} />
            <Fact label="主机" value={site.host} />
            <Fact label="类型" value={formatWhitelistKind(site.kind)} />
            <Fact label="路径" value={site.allowPath} />
            <Fact label="协议" value={formatRobotsPolicy(site.robots)} />
            <Fact label="启用" value={site.enabled ? '是' : '否'} />
          </dl>
          <p className="opportunity-footnote">{site.note}</p>
        </section>
      ) : null}

      <section className="opportunity-section">
        <h3 className="opportunity-section__title">本任务日志</h3>
        <CrawlLogPanel logs={logs} compact emptyText="这条任务还没有日志。" />
      </section>
    </section>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="result-field__label">{label}</div>
      <div className="result-field__value discovery-break">{value}</div>
    </div>
  );
}
