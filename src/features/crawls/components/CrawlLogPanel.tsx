import type { CrawlLogEntry, CrawlLogLevel } from '../types';

interface CrawlLogPanelProps {
  logs: CrawlLogEntry[];
  compact?: boolean;
  emptyText?: string;
}

const LEVEL_ORDER: CrawlLogLevel[] = ['error', 'warn', 'info'];

export function CrawlLogPanel({
  logs,
  compact = false,
  emptyText = '暂无日志',
}: CrawlLogPanelProps) {
  const ordered = [...logs].sort((left, right) => {
    const byTime = right.at.localeCompare(left.at);
    if (byTime !== 0) {
      return byTime;
    }

    return LEVEL_ORDER.indexOf(left.level) - LEVEL_ORDER.indexOf(right.level);
  });

  if (ordered.length === 0) {
    return <p className="muted-copy">{emptyText}</p>;
  }

  return (
    <ol
      className={`crawl-log${compact ? ' crawl-log--compact' : ''}`}
      aria-label="运行日志"
    >
      {ordered.map((log) => (
        <li key={log.id} className={`crawl-log__row crawl-log__row--${log.level}`}>
          <span className="crawl-log__time">{log.at}</span>
          <span className="crawl-log__level">{log.level.toUpperCase()}</span>
          <span className="crawl-log__message">{log.message}</span>
        </li>
      ))}
    </ol>
  );
}
