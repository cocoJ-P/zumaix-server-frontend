import { PageHeader } from '../components/common/PageHeader';
import { LeadWorkspace } from '../features/leads/LeadWorkspace';

export function LeadsPage() {
  return (
    <>
      <PageHeader
        title="企业线索"
        description="根据企业在发现、提交和办理中的操作行为，归纳意向与可服务信号。"
        status="development"
      />
      <LeadWorkspace />
    </>
  );
}
