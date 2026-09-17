import { PageHeader } from '../components/common/PageHeader';
import { OpportunityWorkspace } from '../features/opportunities/OpportunityWorkspace';

export function OpportunitiesPage() {
  return (
    <>
      <PageHeader
        title="机会库"
        description="面向小程序的内容仓库。汇集自有服务、机构政策、服务商服务与活动，整理后再推向企业用户。"
        status="development"
      />
      <OpportunityWorkspace />
    </>
  );
}
