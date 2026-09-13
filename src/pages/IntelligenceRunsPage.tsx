import { EmptyState } from '../components/common/EmptyState';
import { PageHeader } from '../components/common/PageHeader';

export function IntelligenceRunsPage() {
  return (
    <>
      <PageHeader
        title="分析记录"
        description="查看 Opportunity Intelligence 的运行历史、模型版本和分析状态。"
        status="development"
      />
      <EmptyState description="Frontend API 接入将在后续阶段完成。" />
    </>
  );
}
