import type { CrawlJobStatus } from '../types';
import { formatCrawlJobStatus } from '../utils';

interface CrawlStatusBadgeProps {
  status: CrawlJobStatus;
}

export function CrawlStatusBadge({ status }: CrawlStatusBadgeProps) {
  return (
    <span className={`status-badge crawl-status crawl-status--${status}`}>
      {formatCrawlJobStatus(status)}
    </span>
  );
}
