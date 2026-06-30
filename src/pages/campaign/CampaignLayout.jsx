import { Link } from 'react-router-dom';

export default function CampaignLayout({ children }) {
  return (
    <div className="cu-app">
      <header className="cu-header">
        <Link to="/campaign-units" className="cu-brand">
          <span className="cu-brand-mark">▶</span>
          <span className="cu-brand-name">Campaign Units</span>
          <span className="cu-brand-sub">Show Unit Management</span>
        </Link>
        <span className="cu-env">Internal Admin</span>
      </header>
      <main className="cu-body">{children}</main>
    </div>
  );
}
