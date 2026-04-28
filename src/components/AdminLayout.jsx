import { NavLink, useLocation } from 'react-router-dom';

const TAB_TITLES = {
  '/shows': '쇼 모니터링',
  '/hosts': '호스트 관리',
  '/stats': '통계 분석',
  '/categories': '카테고리 관리',
  '/events': '기획전 관리',
};

function AdminLayout({ tabs, children }) {
  const location = useLocation();
  const currentTitle = TAB_TITLES[location.pathname] || 'Posh Live Admin';

  return (
    <>
      <nav className="nav">
        <div className="nav-inner">
          <a href="/" className="nav-logo">
            <span className="nav-logo-mark">P</span>
            Posh Admin
          </a>
          <div className="nav-tabs">
            {tabs.map((tab) => (
              <NavLink
                key={tab.path}
                to={tab.path}
                className={({ isActive }) => `nav-tab${isActive ? ' active' : ''}`}
              >
                {tab.label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      <div className="banner">
        <span className="banner-title">{currentTitle}</span>
        <span className="banner-env">Internal Admin</span>
      </div>

      <div className="admin-body">
        {children}
      </div>
    </>
  );
}

export default AdminLayout;
