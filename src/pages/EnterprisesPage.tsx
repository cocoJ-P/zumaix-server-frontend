import { PageHeader } from '../components/common/PageHeader';
import { EnterpriseWorkspace } from '../features/enterprises/EnterpriseWorkspace';

export function EnterprisesPage() {
  return (
    <>
      <PageHeader
        title="企业"
        description="按产业园查看在园企业。当前覆盖数字要素、机器人与智能会展三个园区。"
        status="development"
      />
      <EnterpriseWorkspace />
    </>
  );
}
