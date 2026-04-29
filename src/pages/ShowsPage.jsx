import { useState } from 'react';
import { SHOWS, STATUS_BADGE_CLASS } from '../data/sampleData';

const STATUS_ORDER = { live: 0, scheduled: 1, done: 2 };
const STATUS_LABEL = { live: 'Live', scheduled: 'Scheduled', done: 'Ended' };

function formatTime(iso) {
  if (!iso) return '–';
  return new Date(iso).toLocaleString('en-US', {
    month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false,
  });
}

function avatarBg(handle) {
  const colors = ['#e0d7f5', '#d7e8f5', '#d7f5e0', '#f5e0d7', '#f5f0d7', '#e0f5f0'];
  let n = 0;
  for (const c of handle) n += c.charCodeAt(0);
  return colors[n % colors.length];
}
function avatarText(handle) {
  return handle.replace('@', '').slice(0, 2).toUpperCase();
}

function PlannedBtn({ label }) {
  return (
    <button className="btn btn-sm btn-ghost" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
      {label}
      <span style={{ fontSize: 9, marginLeft: 4, color: 'var(--muted)' }}>soon</span>
    </button>
  );
}

function ChatModCell({ show }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center', minWidth: 120 }}>
      {show.chatModerators.length === 0
        ? <span style={{ fontSize: 11, color: 'var(--muted)' }}>–</span>
        : show.chatModerators.map((mod) => (
            <span key={mod} style={{
              display: 'inline-flex', alignItems: 'center',
              background: '#f3f4f6', border: '1px solid var(--border)',
              borderRadius: 10, padding: '1px 8px', fontSize: 11, color: '#444',
            }}>
              {mod}
            </span>
          ))
      }
    </div>
  );
}

export default function ShowsPage() {
  const [sortStatus, setSortStatus]       = useState('all');
  const [search, setSearch]               = useState('');
  const [shows, setShows]                 = useState(SHOWS);
  const [statsModal, setStatsModal]       = useState(null);
  const [forceEndModal, setForceEndModal] = useState(null);

  const list = shows
    .filter((s) => {
      if (sortStatus !== 'all' && s.status !== sortStatus) return false;
      if (search) {
        const q = search.toLowerCase();
        return s.handle.toLowerCase().includes(q) || s.title.toLowerCase().includes(q);
      }
      return true;
    })
    .sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);

  return (
    <>
      <div className="filter-bar">
        <div className="filter-group">
          <label className="filter-label">Status</label>
          <select className="inp" style={{ width: 120 }} value={sortStatus} onChange={(e) => setSortStatus(e.target.value)}>
            <option value="all">All</option>
            <option value="live">Live</option>
            <option value="scheduled">Scheduled</option>
            <option value="done">Ended</option>
          </select>
        </div>
        <div className="filter-group filter-right">
          <input className="inp inp-search" placeholder="Search by seller handle or title" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="sec-header">
        <span className="sec-count">{list.length} shows</span>
      </div>

      <table className="tbl">
        <thead>
          <tr>
            <th>Show ID</th>
            <th>Title</th>
            <th>Seller</th>
            <th>Category</th>
            <th className="c">Status</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Chat Moderators</th>
            <th className="c">Actions</th>
          </tr>
        </thead>
        <tbody>
          {list.length === 0 && (
            <tr><td colSpan={9} className="tbl-empty">No shows found.</td></tr>
          )}
          {list.map((show) => (
            <tr key={show.id}>
              <td className="mono">{show.id}</td>
              <td style={{ maxWidth: 200 }}>
                <span style={{ fontWeight: 600, fontSize: 13 }}>{show.title}</span>
              </td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                    background: avatarBg(show.handle),
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, color: '#555',
                  }}>
                    {avatarText(show.handle)}
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--burgundy)', fontWeight: 600 }}>{show.handle}</span>
                </div>
              </td>
              <td>
                <div style={{ lineHeight: 1.5 }}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{show.category}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>{show.subCategory}</div>
                </div>
              </td>
              <td className="c">
                <span className={`badge ${STATUS_BADGE_CLASS[show.status]}`}>{STATUS_LABEL[show.status]}</span>
              </td>
              <td className="date">{formatTime(show.startTime)}</td>
              <td className="date">{formatTime(show.endTime)}</td>
              <td><ChatModCell show={show} /></td>
              <td>
                <div className="actions">
                  <button className="btn btn-sm btn-blue" onClick={() => setStatsModal(show)}>Stats</button>
                  {show.status === 'live' && (
                    <button className="btn btn-sm btn-red" onClick={() => setForceEndModal(show)}>Force End</button>
                  )}
                  <PlannedBtn label="Hide" />
                  <PlannedBtn label="Delete" />
                  <PlannedBtn label="Chat" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Force End modal */}
      {forceEndModal && (
        <div className="overlay" onClick={() => setForceEndModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Force End Show</span>
              <button className="modal-close" onClick={() => setForceEndModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p className="modal-msg">Force-end the live show by <strong>{forceEndModal.handle}</strong>?</p>
              <p className="modal-msg" style={{ marginTop: 4 }}>"{forceEndModal.title}"</p>
              <div className="modal-detail">
                The broadcast will be terminated immediately and viewers will see an end screen. This action cannot be undone.
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setForceEndModal(null)}>Cancel</button>
              <button className="btn btn-red" onClick={() => {
                setShows((prev) => prev.map((s) =>
                  s.id === forceEndModal.id
                    ? { ...s, status: 'done', endTime: new Date().toISOString().slice(0, 16) }
                    : s
                ));
                setForceEndModal(null);
              }}>Force End</button>
            </div>
          </div>
        </div>
      )}

      {/* Stats modal */}
      {statsModal && (
        <div className="overlay" onClick={() => setStatsModal(null)}>
          <div className="modal modal-wide" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Show Stats — {statsModal.title}</span>
              <button className="modal-close" onClick={() => setStatsModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <table className="tbl" style={{ marginBottom: 0 }}>
                <thead><tr><th>Metric</th><th className="r">Value</th></tr></thead>
                <tbody>
                  <tr><td>Show ID</td><td className="r mono">{statsModal.id}</td></tr>
                  <tr><td>Seller</td><td className="r" style={{ color: 'var(--burgundy)', fontWeight: 600 }}>{statsModal.handle}</td></tr>
                  <tr><td>Category</td><td className="r">{statsModal.category} › {statsModal.subCategory}</td></tr>
                  <tr><td>Status</td><td className="r">{STATUS_LABEL[statsModal.status]}</td></tr>
                  <tr><td>Peak Viewers</td><td className="r">{statsModal.viewerCount > 0 ? statsModal.viewerCount.toLocaleString() : '–'}</td></tr>
                  <tr><td>Total GMV</td><td className="r">{statsModal.gmv > 0 ? '$' + (statsModal.gmv / 1300).toFixed(0).toLocaleString() : '–'}</td></tr>
                  <tr><td>Start Time</td><td className="r">{formatTime(statsModal.startTime)}</td></tr>
                  <tr><td>End Time</td><td className="r">{formatTime(statsModal.endTime)}</td></tr>
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setStatsModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
