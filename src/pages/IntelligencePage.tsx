import { PageHeader } from '../components/common/PageHeader';
import { IntelligenceConsole } from '../features/intelligence/IntelligenceConsole';

export function IntelligencePage() {
  return (
    <>
      <PageHeader
        title="查一个机会"
        description="粘贴公开网页或正文，理解其中的企业机会信息与来源特征。"
        status="available"
      />
      <IntelligenceConsole />
    </>
  );
}
