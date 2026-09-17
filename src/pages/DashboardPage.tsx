import { Link } from 'react-router-dom';
import {
  BarChart3,
  Bot,
  Building2,
  ChevronRight,
  ClipboardList,
  Lightbulb,
  Search,
} from 'lucide-react';
import '../styles/dashboard.css';

const OVERVIEW_STATS = [
  {
    id: 'enterprises',
    label: '入驻企业',
    value: '128',
    icon: Building2,
    tone: 'blue',
  },
  {
    id: 'frequency',
    label: '服务频次',
    value: '2,486',
    icon: BarChart3,
    tone: 'green',
  },
  {
    id: 'leads',
    label: '机会线索',
    value: '63',
    icon: Lightbulb,
    tone: 'orange',
  },
  {
    id: 'cases',
    label: '在办服务',
    value: '12',
    icon: ClipboardList,
    tone: 'purple',
  },
] as const;

const OVERVIEW_ENTRIES = [
  {
    title: '机会智能',
    description: '解析公开内容，识别其中的企业机会信息。',
    path: '/intelligence',
    icon: Bot,
    tone: 'blue',
  },
  {
    title: '企业索引',
    description: '快速查找企业，了解企业与服务需求。',
    path: '/enterprises',
    icon: Search,
    tone: 'green',
  },
  {
    title: '服务办理',
    description: '受理与跟进企业服务事项。',
    path: '/service-cases',
    icon: ClipboardList,
    tone: 'purple',
  },
] as const;

export function DashboardPage() {
  return (
    <div className="overview">
      <section className="overview-stats" aria-label="轻量概览">
        {OVERVIEW_STATS.map((stat) => {
          const Icon = stat.icon;

          return (
            <article
              className={`overview-stat overview-stat--${stat.tone}`}
              key={stat.id}
            >
              <span className="overview-stat__icon" aria-hidden="true">
                <Icon size={16} strokeWidth={1.75} />
              </span>
              <div className="overview-stat__body">
                <p className="overview-stat__label">{stat.label}</p>
                <p className="overview-stat__value">{stat.value}</p>
              </div>
            </article>
          );
        })}
      </section>

      <section className="overview-entries" aria-label="功能入口">
        {OVERVIEW_ENTRIES.map((entry) => {
          const Icon = entry.icon;

          return (
            <Link
              key={entry.path}
              to={entry.path}
              className={`overview-entry overview-entry--${entry.tone}`}
            >
              <span className="overview-entry__icon" aria-hidden="true">
                <Icon size={18} strokeWidth={1.75} />
              </span>
              <span className="overview-entry__body">
                <span className="overview-entry__title">{entry.title}</span>
                <span className="overview-entry__description">
                  {entry.description}
                </span>
              </span>
              <span className="overview-entry__go" aria-hidden="true">
                <ChevronRight size={16} strokeWidth={1.75} />
              </span>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
