import { EmptyState } from '../components/common/EmptyState';
import { PageHeader } from '../components/common/PageHeader';

export function EnterprisesPage() {
  return (
    <>
      <PageHeader
        title="企业"
        description="查看企业基础信息与企业状态。"
        status="development"
      />
      <EmptyState description="Frontend API 接入将在后续阶段完成。" />
    </>
  );
}
