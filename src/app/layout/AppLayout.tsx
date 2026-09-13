import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { getDocumentTitle } from '../navigation';
import { PageContainer } from './PageContainer';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

const NARROW_QUERY = '(max-width: 1023px)';

export function AppLayout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(
    () => window.matchMedia(NARROW_QUERY).matches,
  );

  useEffect(() => {
    document.title = getDocumentTitle(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const media = window.matchMedia(NARROW_QUERY);
    const onChange = () => {
      setCollapsed(media.matches);
    };

    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  return (
    <div className="app-shell">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((value) => !value)}
      />
      <div className="app-shell__body">
        <Topbar />
        <main className="app-shell__main">
          <PageContainer>
            <Outlet />
          </PageContainer>
        </main>
      </div>
    </div>
  );
}
