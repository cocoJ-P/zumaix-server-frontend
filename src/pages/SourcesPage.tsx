import { EmptyState } from '../components/common/EmptyState';
import { PageHeader } from '../components/common/PageHeader';

export function SourcesPage() {
  return (
    <>
      <PageHeader
        title="内容源"
        description="查看进入系统的网页、正文及其解析记录。"
        status="development"
      />
      <EmptyState description="Frontend API 接入将在后续阶段完成。" />
    </>
  );
}
