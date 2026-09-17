interface CrawlStatsProps {
  running: number;
  fetched: number;
  stored: number;
  failed: number;
  whitelistActive: number;
}

export function CrawlStats({
  running,
  fetched,
  stored,
  failed,
  whitelistActive,
}: CrawlStatsProps) {
  const items = [
    { label: '运行中', value: String(running) },
    { label: '今日已抓', value: String(fetched) },
    { label: '入库待整理', value: String(stored) },
    { label: '失败任务', value: String(failed) },
    { label: '白名单启用', value: String(whitelistActive) },
  ];

  return (
    <section className="crawl-stats" aria-label="爬取统计">
      {items.map((item) => (
        <div key={item.label} className="crawl-stats__item">
          <div className="crawl-stats__value">{item.value}</div>
          <div className="crawl-stats__label">{item.label}</div>
        </div>
      ))}
    </section>
  );
}
