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
      <Topbar />
      <div className="app-shell__body">
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((value) => !value)}
        />
        <main
          className={
            location.pathname === '/'
              ? 'app-shell__main'
              : 'app-shell__main app-shell__main--veiled'
          }
        >
          <div className="app-shell__scroller">
            <PageContainer>
              <Outlet />
            </PageContainer>
          </div>
        </main>
      </div>
    </div>
  );
}
