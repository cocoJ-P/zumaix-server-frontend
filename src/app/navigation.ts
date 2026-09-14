import {
  BriefcaseBusiness,
  Building2,
  ClipboardList,
  FileText,
  History,
  Inbox,
  LayoutDashboard,
  ListTodo,
  MessageSquare,
  Search,
  Sparkles,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

export type FeatureStatus = 'available' | 'development' | 'coming-soon';

export interface NavigationItem {
  label: string;
  path: string;
  icon: LucideIcon;
  status: FeatureStatus;
}

export interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

export const APP_NAME = '筑脉企服';
export const APP_BRAND = 'ZUMAIX 筑脉';
export const APP_TAGLINE = '企业服务工作台';

export const navigation: NavigationSection[] = [
  {
    title: '总览',
    items: [
      {
        label: '总览',
        path: '/',
        icon: LayoutDashboard,
        status: 'available',
      },
    ],
  },
  {
    title: '机会智能',
    items: [
      {
        label: '查一个机会',
        path: '/intelligence',
        icon: Search,
        status: 'available',
      },
      {
        label: '用户提交',
        path: '/submissions',
        icon: Inbox,
        status: 'available',
      },
      {
        label: '发现投放',
        path: '/discoveries',
        icon: Sparkles,
        status: 'available',
      },
      {
        label: '发现反馈',
        path: '/discovery-feedback',
        icon: MessageSquare,
        status: 'available',
      },
      {
        label: '服务办理',
        path: '/service-cases',
        icon: ClipboardList,
        status: 'available',
      },
      {
        label: '内容源',
        path: '/sources',
        icon: FileText,
        status: 'development',
      },
      {
        label: '分析记录',
        path: '/intelligence-runs',
        icon: History,
        status: 'development',
      },
    ],
  },
  {
    title: '业务对象',
    items: [
      {
        label: '机会库',
        path: '/opportunities',
        icon: BriefcaseBusiness,
        status: 'development',
      },
      {
        label: '企业',
        path: '/enterprises',
        icon: Building2,
        status: 'development',
      },
      {
        label: '企业线索',
        path: '/leads',
        icon: ListTodo,
        status: 'coming-soon',
      },
    ],
  },
  {
    title: '系统',
    items: [
      {
        label: '工具池',
        path: '/tools',
        icon: Wrench,
        status: 'coming-soon',
      },
    ],
  },
];

export function findNavItem(pathname: string): NavigationItem | undefined {
  for (const section of navigation) {
    const match = section.items.find((item) => item.path === pathname);
    if (match) {
      return match;
    }
  }

  return undefined;
}

export function findNavSection(pathname: string): NavigationSection | undefined {
  return navigation.find((section) =>
    section.items.some((item) => item.path === pathname),
  );
}

export function getBreadcrumb(pathname: string): string {
  const section = findNavSection(pathname);
  const item = findNavItem(pathname);

  if (!section || !item) {
    return '页面不存在';
  }

  if (section.title === item.label) {
    return item.label;
  }

  return `${section.title} / ${item.label}`;
}

export function getDocumentTitle(pathname: string): string {
  const item = findNavItem(pathname);

  if (!item) {
    return `页面不存在 | ${APP_NAME}`;
  }

  if (item.path === '/') {
    return APP_NAME;
  }

  return `${item.label} | ${APP_NAME}`;
}
