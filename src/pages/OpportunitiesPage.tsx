import { EmptyState } from '../components/common/EmptyState';
import { PageHeader } from '../components/common/PageHeader';

export function OpportunitiesPage() {
  return (
    <>
      <PageHeader
        title="机会库"
        description="管理经过确认与归一化后的企业机会。"
        status="development"
      />
      <EmptyState description="Frontend API 接入将在后续阶段完成。" />
    </>
  );
}
