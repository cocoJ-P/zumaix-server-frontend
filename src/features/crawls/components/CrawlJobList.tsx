import type { CrawlJob } from '../types';
import { EmptyState } from '../../../components/common/EmptyState';
import { findWhitelistSite } from '../utils';
import type { WhitelistSite } from '../types';
import { CrawlJobItem } from './CrawlJobItem';

interface CrawlJobListProps {
  jobs: CrawlJob[];
  sites: WhitelistSite[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function CrawlJobList({
  jobs,
  sites,
  selectedId,
  onSelect,
}: CrawlJobListProps) {
  if (jobs.length === 0) {
    return (
      <EmptyState
        title="没有匹配的任务"
        description="换一个状态筛选，或从白名单站点新建任务。"
      />
    );
  }

  return (
    <div className="submission-list" role="list">
      {jobs.map((job) => (
        <CrawlJobItem
          key={job.id}
          job={job}
          host={findWhitelistSite(sites, job.whitelistId)?.host ?? '未知主机'}
          selected={job.id === selectedId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
