import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { APP_BRAND, APP_TAGLINE, navigation } from '../navigation';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className={collapsed ? 'sidebar sidebar--collapsed' : 'sidebar'}
      aria-label="应用导航"
    >
      <div className="sidebar__brand">
        <div className="sidebar__mark" aria-hidden="true">
          筑
        </div>
        {collapsed ? null : (
          <div className="sidebar__brand-text">
            <div className="sidebar__brand-name">{APP_BRAND}</div>
            <div className="sidebar__brand-tagline">{APP_TAGLINE}</div>
          </div>
        )}
      </div>

      <nav className="sidebar__nav" aria-label="主导航">
        {navigation.map((section) => (
          <div className="nav-section" key={section.title}>
            <div className="nav-section__title">{section.title}</div>
            <ul className="nav-list">
              {section.items.map((item) => {
                const Icon = item.icon;

                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      end={item.path === '/'}
                      title={item.label}
                      aria-label={item.label}
                      className={({ isActive }) =>
                        isActive ? 'nav-link active' : 'nav-link'
                      }
                    >
                      <span className="nav-link__icon">
                        <Icon size={16} strokeWidth={1.75} aria-hidden="true" />
                      </span>
                      {collapsed ? null : (
                        <span className="nav-link__label">{item.label}</span>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="sidebar__footer">
        <button
          type="button"
          className="sidebar-toggle"
          aria-expanded={!collapsed}
          aria-label={collapsed ? '展开导航' : '收起导航'}
          onClick={onToggle}
        >
          {collapsed ? (
            <ChevronsRight size={16} strokeWidth={1.75} aria-hidden="true" />
          ) : (
            <ChevronsLeft size={16} strokeWidth={1.75} aria-hidden="true" />
          )}
          {collapsed ? null : (
            <span className="sidebar-toggle__label">收起导航</span>
          )}
        </button>
      </div>
    </aside>
  );
}
