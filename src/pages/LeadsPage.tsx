import { EmptyState } from '../components/common/EmptyState';
import { PageHeader } from '../components/common/PageHeader';

export function LeadsPage() {
  return (
    <>
      <PageHeader
        title="企业线索"
        description="管理企业成员提交的机会线索与后续服务进展。"
        status="coming-soon"
      />
      <EmptyState
        title="Coming Soon"
        description="该能力依赖 Backend B9，当前阶段尚未开放。"
      />
    </>
  );
}
