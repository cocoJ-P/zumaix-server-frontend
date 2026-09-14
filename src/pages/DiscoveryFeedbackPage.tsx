import { PageHeader } from '../components/common/PageHeader';
import { DiscoveryFeedbackWorkspace } from '../features/discovery-feedback/DiscoveryFeedbackWorkspace';
import { useRefreshDiscoveryFeedback } from '../features/discovery-feedback/hooks';

export function DiscoveryFeedbackPage() {
  const refresh = useRefreshDiscoveryFeedback();

  return (
    <>
      <PageHeader
        title="发现反馈"
        description="查看企业用户对发现内容的查看、稍后与接受情况，以及后续解析进度。"
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
      <DiscoveryFeedbackWorkspace />
    </>
  );
}
