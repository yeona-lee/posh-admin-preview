import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

const MENU_ITEMS = [
  { path: '/shows',      label: 'Show Monitor'         },
  { path: '/hosts',      label: 'Host Management'       },
  { path: '/categories', label: 'Category Management'   },
  { path: '/events',     label: 'Show Unit Management'  },
];

const PAGE_TITLE = {
  '/shows':      'Show Monitor',
  '/hosts':      'Host Management',
  '/categories': 'Category Management',
  '/events':     'Show Unit Management',
};

function PoshLiveDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const currentLabel = PAGE_TITLE[location.pathname] || 'Posh Live';
  const isActive = Object.keys(PAGE_TITLE).includes(location.pathname);

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // close on route change
  useEffect(() => { setOpen(false); }, [location.pathname]);

  return (
    <div ref={ref} style={{ position: 'relative', display: 'flex', alignItems: 'stretch' }}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`nav-tab${isActive ? ' active' : ''}`}
        style={{ display: 'flex', alignItems: 'center', gap: 6 }}
      >
        Posh Live
        <span style={{ fontSize: 10, opacity: 0.7, marginTop: 1 }}>▼</span>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 1px)', left: 0,
          background: '#fff', border: '1px solid #e0e0e0',
          borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,.15)',
          minWidth: 220, zIndex: 999, overflow: 'hidden',
          /* arrow */
        }}>
          {/* triangle */}
          <div style={{
            position: 'absolute', top: -7, left: 20,
            width: 0, height: 0,
            borderLeft: '7px solid transparent',
            borderRight: '7px solid transparent',
            borderBottom: '7px solid #fff',
            filter: 'drop-shadow(0 -1px 0 #e0e0e0)',
          }} />

          {MENU_ITEMS.map((item) => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => { navigate(item.path); setOpen(false); }}
                style={{
                  display: 'block', width: '100%',
                  padding: '12px 20px',
                  background: active ? '#f9f0f2' : 'none',
                  border: 'none', borderBottom: '1px solid #f0f0f0',
                  cursor: 'pointer', textAlign: 'left',
                  fontSize: 14, color: active ? 'var(--burgundy)' : '#222',
                  fontWeight: active ? 700 : 400,
                  fontFamily: 'inherit',
                  textDecoration: active ? 'none' : 'underline',
                  transition: 'background .1s',
                }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = '#f5f5f5'; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'none'; }}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function AdminLayout({ children }) {
  const location = useLocation();
  const currentTitle = PAGE_TITLE[location.pathname] || 'Posh Live Admin';

  return (
    <>
      <nav className="nav">
        <div className="nav-inner">
          <a href="/" className="nav-logo">
            <span className="nav-logo-mark">P</span>
            Posh Admin
          </a>
          <div className="nav-tabs">
            <PoshLiveDropdown />
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
