import { PageHeader } from '../components/common/PageHeader';
import { CrawlWorkspace } from '../features/crawls/CrawlWorkspace';

export function CrawlsPage() {
  return (
    <>
      <PageHeader
        title="爬取"
        description="按白名单采集公开政策、服务商与活动页。采集要可控，入库和投放仍在机会库完成。"
        status="development"
      />
      <CrawlWorkspace />
    </>
  );
}
