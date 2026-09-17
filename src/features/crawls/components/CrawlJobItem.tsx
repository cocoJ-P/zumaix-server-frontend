import type { CrawlJob } from '../types';
import { crawlProgressPercent } from '../utils';
import { CrawlStatusBadge } from './CrawlStatusBadge';

interface CrawlJobItemProps {
  job: CrawlJob;
  host: string;
  selected: boolean;
  onSelect: (id: string) => void;
}

export function CrawlJobItem({
  job,
  host,
  selected,
  onSelect,
}: CrawlJobItemProps) {
  const percent = crawlProgressPercent(job);

  return (
    <button
      type="button"
      className={`submission-item${selected ? ' submission-item--selected' : ''}`}
      aria-current={selected ? 'true' : undefined}
      onClick={() => onSelect(job.id)}
    >
      <div className="opportunity-item__top">
        <CrawlStatusBadge status={job.status} />
        <span className="muted-copy">
          {job.fetched}/{job.planned}
        </span>
      </div>
      <div className="submission-item__title">{job.title}</div>
      <div className="submission-item__meta">{host}</div>
      <div className="crawl-progress" aria-hidden="true">
        <span className="crawl-progress__bar" style={{ width: `${percent}%` }} />
      </div>
      <div className="submission-item__footer">
        <span>
          间隔 {job.intervalSec}s · 深度 {job.depth}
        </span>
        <span>{job.updatedAtLabel}</span>
      </div>
    </button>
  );
}
