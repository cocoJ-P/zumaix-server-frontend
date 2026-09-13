import { Link } from 'react-router-dom';
import { PageHeader } from '../components/common/PageHeader';

const DASHBOARD_ENTRIES = [
  {
    title: '机会智能',
    description: '解析公开内容，识别其中的企业机会信息。',
    path: '/intelligence',
  },
  {
    title: '企业',
    description: '查看企业基础信息与企业状态。',
    path: '/enterprises',
  },
  {
    title: '机会库',
    description: '管理经过确认与归一化后的企业机会。',
    path: '/opportunities',
  },
  {
    title: '服务流程',
    description: '跟进企业线索与后续服务进展。',
    path: '/leads',
  },
] as const;

export function DashboardPage() {
  return (
    <>
      <PageHeader
        title="筑脉企服"
        description="连接企业状态、机会信息与服务行动。"
        status="available"
      />
      <section className="entry-grid" aria-label="工作台入口">
        {DASHBOARD_ENTRIES.map((entry) => (
          <Link key={entry.path} to={entry.path} className="entry-card">
            <h2 className="entry-card__title">{entry.title}</h2>
            <p className="entry-card__description">{entry.description}</p>
          </Link>
        ))}
      </section>
    </>
  );
}
