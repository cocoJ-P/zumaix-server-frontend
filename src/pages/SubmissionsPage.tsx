import { PageHeader } from '../components/common/PageHeader';
import { SubmissionWorkspace } from '../features/submissions/SubmissionWorkspace';
import { useRefreshUserSubmissions } from '../features/submissions/hooks';

export function SubmissionsPage() {
  const refresh = useRefreshUserSubmissions();

  return (
    <>
      <PageHeader
        title="用户提交"
        description="查看企业用户通过筑脉查查发起的内容分析记录。"
        status="available"
        actions={
          <button type="button" className="btn btn--secondary" onClick={() => void refresh()}>
            刷新
          </button>
        }
      />
      <SubmissionWorkspace />
    </>
  );
}
