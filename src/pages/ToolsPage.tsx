import { EmptyState } from '../components/common/EmptyState';
import { PageHeader } from '../components/common/PageHeader';

export function ToolsPage() {
  return (
    <>
      <PageHeader
        title="工具池"
        description="统一管理模型、搜索、内容获取等外部能力的状态与使用情况。"
        status="coming-soon"
      />
      <EmptyState
        title="Coming Soon"
        description="当前不开放 Provider 管理，工具池将在后续阶段接入。"
      />
    </>
  );
}
