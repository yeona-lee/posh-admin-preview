import { useState, useRef, useEffect } from 'react';
import { HOSTS } from '../data/sampleData';

const SEG_STYLE = {
  5: { bg: '#e8e4ff', color: '#5b21b6' },
  4: { bg: '#fef3c7', color: '#b45309' },
  3: { bg: '#f1f5f9', color: '#475569' },
  2: { bg: '#fde8d8', color: '#92400e' },
  1: { bg: '#f3f4f6', color: '#888'    },
};

const PENALTY_TYPE_BADGE = {
  Warning:       'badge-amber',
  'Temp Suspend': 'badge-scheduled',
  'Account Ban':  'badge-live',
};

function avatarBg(handle) {
  const colors = ['#e0d7f5', '#d7e8f5', '#d7f5e0', '#f5e0d7', '#f5f0d7', '#e0f5f0'];
  let n = 0;
  for (const c of handle) n += c.charCodeAt(0);
  return colors[n % colors.length];
}
function avatarText(handle) {
  return handle.replace('@', '').slice(0, 2).toUpperCase();
}

function StatCard({ label, value, sub }) {
  return (
    <div className="mini-card" style={{ flex: '1 1 130px' }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 700 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function ActionDropdown({ host, onDiscipline }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handler(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        className="btn btn-sm btn-secondary"
        onClick={() => setOpen((v) => !v)}
        style={{ display: 'flex', alignItems: 'center', gap: 4 }}
      >
        Action <span style={{ fontSize: 9 }}>▼</span>
      </button>
      {open && (
        <div style={{
          position: 'absolute', right: 0, top: 'calc(100% + 4px)',
          background: '#fff', border: '1px solid var(--border)',
          borderRadius: 6, boxShadow: '0 4px 16px rgba(0,0,0,.12)',
          minWidth: 140, zIndex: 100, overflow: 'hidden',
        }}>
          <button
            onClick={() => { setOpen(false); onDiscipline(host); }}
            style={{
              display: 'block', width: '100%', padding: '9px 14px',
              background: 'none', border: 'none', cursor: 'pointer',
              textAlign: 'left', fontSize: 13, color: 'var(--red)',
              fontWeight: 600, fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#fee2e2'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
          >
            Discipline Seller
          </button>
        </div>
      )}
    </div>
  );
}

export default function HostsPage() {
  const [search, setSearch] = useState('');
  const [hosts, setHosts] = useState(HOSTS);
  const [penaltyModal, setPenaltyModal]     = useState(null);
  const [disciplineModal, setDisciplineModal] = useState(null);
  const [dashboardModal, setDashboardModal] = useState(null);
  const [disciplineForm, setDisciplineForm] = useState({ type: 'Warning', reason: '' });

  const filtered = hosts.filter((h) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return h.handle.toLowerCase().includes(q) || h.email.toLowerCase().includes(q);
  });

  function submitDiscipline() {
    if (!disciplineForm.reason.trim()) return;
    setHosts((prev) => prev.map((h) =>
      h.id === disciplineModal.id
        ? {
            ...h,
            penaltyHistory: [
              ...h.penaltyHistory,
              { date: new Date().toISOString().slice(0, 10), reason: disciplineForm.reason, type: disciplineForm.type },
            ],
          }
        : h
    ));
    setDisciplineModal(null);
    setDisciplineForm({ type: 'Warning', reason: '' });
  }

  return (
    <>
      <div className="filter-bar">
        <div className="filter-group filter-right">
          <input
            className="inp inp-search"
            placeholder="Search by handle or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="sec-header">
        <span className="sec-count">{filtered.length} hosts</span>
      </div>

      <table className="tbl">
        <thead>
          <tr>
            <th>Host</th>
            <th>Email</th>
            <th>Join Date</th>
            <th className="r">Total Shows</th>
            <th className="c">SEG</th>
            <th className="c">Penalties</th>
            <th className="c">Dashboard</th>
            <th className="c">Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 && (
            <tr><td colSpan={8} className="tbl-empty">No hosts found.</td></tr>
          )}
          {filtered.map((host) => {
            const penaltyCount = host.penaltyHistory.length;
            const seg = SEG_STYLE[host.seg] || SEG_STYLE[1];
            return (
              <tr key={host.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                      background: avatarBg(host.handle),
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 700, color: '#555',
                    }}>
                      {avatarText(host.handle)}
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--burgundy)' }}>{host.handle}</span>
                  </div>
                </td>
                <td className="muted" style={{ fontSize: 12 }}>{host.email}</td>
                <td className="date">{host.joinDate}</td>
                <td className="r">{host.showCount}</td>
                <td className="c">
                  <span style={{
                    display: 'inline-block', padding: '2px 9px',
                    borderRadius: 10, fontSize: 11, fontWeight: 700,
                    background: seg.bg, color: seg.color,
                  }}>
                    {host.seg}
                  </span>
                </td>
                <td className="c">
                  {penaltyCount === 0 ? (
                    <span style={{ fontSize: 12, color: 'var(--muted)' }}>None</span>
                  ) : (
                    <button
                      className="link"
                      style={{ color: 'var(--red)', fontWeight: 700, fontSize: 12 }}
                      onClick={() => setPenaltyModal(host)}
                    >
                      {penaltyCount} case{penaltyCount > 1 ? 's' : ''}
                    </button>
                  )}
                </td>
                <td className="c">
                  <button
                    className="btn btn-sm btn-blue"
                    onClick={() => setDashboardModal(host)}
                  >
                    Channel Dashboard
                  </button>
                </td>
                <td className="c">
                  <ActionDropdown host={host} onDiscipline={setDisciplineModal} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Penalty History modal */}
      {penaltyModal && (
        <div className="overlay" onClick={() => setPenaltyModal(null)}>
          <div className="modal modal-wide" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Penalty History — {penaltyModal.handle}</span>
              <button className="modal-close" onClick={() => setPenaltyModal(null)}>✕</button>
            </div>
            <div className="modal-body" style={{ padding: 0 }}>
              <table className="tbl" style={{ marginBottom: 0 }}>
                <thead>
                  <tr><th>Date</th><th>Type</th><th>Reason</th></tr>
                </thead>
                <tbody>
                  {penaltyModal.penaltyHistory.map((p, i) => (
                    <tr key={i}>
                      <td className="date">{p.date}</td>
                      <td>
                        <span className={`badge ${PENALTY_TYPE_BADGE[p.type] || 'badge-amber'}`}>{p.type}</span>
                      </td>
                      <td>{p.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setPenaltyModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Channel Dashboard modal */}
      {dashboardModal && (
        <div className="overlay" onClick={() => setDashboardModal(null)}>
          <div className="modal modal-wide" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: avatarBg(dashboardModal.handle),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, color: '#555',
                }}>
                  {avatarText(dashboardModal.handle)}
                </div>
                <span className="modal-title">Channel Dashboard — {dashboardModal.handle}</span>
              </div>
              <button className="modal-close" onClick={() => setDashboardModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="detail-grid" style={{ marginBottom: 16 }}>
                <StatCard label="Total Shows" value={dashboardModal.showCount} />
                <StatCard label="SEG Level" value={`Lv.${dashboardModal.seg}`} />
                <StatCard label="Penalties" value={dashboardModal.penaltyHistory.length} sub={dashboardModal.penaltyHistory.length === 0 ? 'Clean record' : 'Cases on record'} />
                <StatCard label="Member Since" value={dashboardModal.joinDate} />
              </div>
              <table className="tbl" style={{ marginBottom: 0 }}>
                <thead><tr><th>Field</th><th className="r">Value</th></tr></thead>
                <tbody>
                  <tr><td>Handle</td><td className="r" style={{ color: 'var(--burgundy)', fontWeight: 600 }}>{dashboardModal.handle}</td></tr>
                  <tr><td>Email</td><td className="r">{dashboardModal.email}</td></tr>
                  <tr><td>Join Date</td><td className="r">{dashboardModal.joinDate}</td></tr>
                  <tr><td>Total Shows</td><td className="r">{dashboardModal.showCount}</td></tr>
                  <tr><td>SEG</td><td className="r">Lv.{dashboardModal.seg}</td></tr>
                  <tr><td>Penalty Count</td><td className="r">{dashboardModal.penaltyHistory.length}</td></tr>
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDashboardModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Discipline modal */}
      {disciplineModal && (
        <div className="overlay" onClick={() => setDisciplineModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Discipline Seller — {disciplineModal.handle}</span>
              <button className="modal-close" onClick={() => setDisciplineModal(null)}>✕</button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="form-col">
                <label className="form-label">Penalty Type</label>
                <select
                  className="inp"
                  value={disciplineForm.type}
                  onChange={(e) => setDisciplineForm((p) => ({ ...p, type: e.target.value }))}
                  style={{ width: '100%' }}
                >
                  <option value="Warning">Warning</option>
                  <option value="Temp Suspend">Temp Suspend</option>
                  <option value="Account Ban">Account Ban</option>
                </select>
              </div>
              <div className="form-col">
                <label className="form-label">Reason <span className="required">*</span></label>
                <textarea
                  className="inp inp-full"
                  rows={3}
                  placeholder="Enter reason for discipline"
                  value={disciplineForm.reason}
                  onChange={(e) => setDisciplineForm((p) => ({ ...p, reason: e.target.value }))}
                />
              </div>
              <div className="modal-detail" style={{ marginTop: 0 }}>
                The seller will be notified upon applying this action.
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDisciplineModal(null)}>Cancel</button>
              <button
                className="btn btn-red"
                onClick={submitDiscipline}
                disabled={!disciplineForm.reason.trim()}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
