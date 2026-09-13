import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './layout/AppLayout';
import { DashboardPage } from '../pages/DashboardPage';
import { EnterprisesPage } from '../pages/EnterprisesPage';
import { IntelligencePage } from '../pages/IntelligencePage';
import { IntelligenceRunsPage } from '../pages/IntelligenceRunsPage';
import { LeadsPage } from '../pages/LeadsPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { OpportunitiesPage } from '../pages/OpportunitiesPage';
import { SourcesPage } from '../pages/SourcesPage';
import { ToolsPage } from '../pages/ToolsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'intelligence', element: <IntelligencePage /> },
      { path: 'sources', element: <SourcesPage /> },
      { path: 'intelligence-runs', element: <IntelligenceRunsPage /> },
      { path: 'opportunities', element: <OpportunitiesPage /> },
      { path: 'enterprises', element: <EnterprisesPage /> },
      { path: 'leads', element: <LeadsPage /> },
      { path: 'tools', element: <ToolsPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
