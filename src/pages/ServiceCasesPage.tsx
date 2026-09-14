import { PageHeader } from '../components/common/PageHeader';
import { ServiceCaseWorkspace } from '../features/service-cases/ServiceCaseWorkspace';
import { useRefreshServiceCases } from '../features/service-cases/hooks';

export function ServiceCasesPage() {
  const refresh = useRefreshServiceCases();

  return (
    <>
      <PageHeader
        title="服务办理"
        description="查看企业用户已经发起的服务事项及当前办理状态。"
        status="available"
        actions={
          <button
            type="button"
            className="btn btn--secondary"
            onClick={() => void refresh()}
          >
            刷新
          </button>
        }
      />
      <ServiceCaseWorkspace />
    </>
  );
}
