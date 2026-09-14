import { PageHeader } from '../components/common/PageHeader';
import { DiscoveryWorkspace } from '../features/discoveries/DiscoveryWorkspace';

export function DiscoveriesPage() {
  return (
    <>
      <PageHeader
        title="发现投放"
        description="将机会或内容加入当前企业的「为你发现」。"
        status="available"
      />
      <DiscoveryWorkspace />
    </>
  );
}
