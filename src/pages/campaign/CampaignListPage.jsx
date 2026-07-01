import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCampaigns } from './store';
import { unitStatus, isInPeriod, fmtDateTime, initials, avatarBg } from './utils';

const PAGE_SIZE = 5;

function SellerAvatars({ handles = [] }) {
  if (handles.length === 0) return <span style={{ color: 'var(--muted)' }}>–</span>;
  const shown = handles.slice(0, 3);
  const extra = handles.length - shown.length;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ display: 'flex' }}>
        {shown.map((h, i) => (
          <span key={h} title={h} style={{
            width: 24, height: 24, borderRadius: '50%', background: avatarBg(h),
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 9, fontWeight: 700, color: '#555', marginLeft: i ? -7 : 0, border: '1.5px solid #fff',
          }}>{initials(h)}</span>
        ))}
      </div>
      <span style={{ fontSize: 11, color: 'var(--muted)' }}>{extra > 0 ? `+${extra}` : `${handles.length}`}</span>
    </div>
  );
}

export default function CampaignListPage() {
  const { units, stop, resume, reorderLive } = useCampaigns();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  // reorder mode
  const [reordering, setReordering] = useState(false);
  const [draft, setDraft] = useState([]); // ordered ids while reordering

  // currently in exposure window (includes stopped → shown disabled)
  const inPeriod = units.filter(isInPeriod);
  const activeCount = inPeriod.filter((u) => !u.stopped).length;
  const stoppedCount = inPeriod.length - activeCount;

  const liveRows = reordering
    ? draft.map((id) => units.find((u) => u.id === id)).filter(Boolean)
    : inPeriod;

  function startReorder() {
    setDraft(inPeriod.map((u) => u.id));
    setReordering(true);
  }
  function moveDraft(idx, dir) {
    setDraft((d) => {
      const j = idx + dir;
      if (j < 0 || j >= d.length) return d;
      const next = [...d];
      [next[idx], next[j]] = [next[j], next[idx]];
      return next;
    });
  }
  function saveOrder() {
    reorderLive(draft);
    setReordering(false);
    setDraft([]);
  }
  function cancelReorder() {
    setReordering(false);
    setDraft([]);
  }

  // all units (newest first) + pagination
  const all = [...units].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  const pageCount = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageUnits = all.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <>
      <div className="cu-toolbar">
        <h1 className="cu-h1">Campaign Units</h1>
        <button className="btn btn-primary" onClick={() => navigate('/campaign-units/new')} disabled={reordering}>+ New Unit</button>
      </div>

      {/* ── Section: currently live ── */}
      <div className="cu-section">
        <div className="cu-sec-title">
          Currently Live <span className="cu-pill">{activeCount}</span>
          <span className="cu-sec-hint">
            in exposure window now{stoppedCount > 0 ? ` · ${stoppedCount} stopped` : ''}
          </span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            {!reordering ? (
              <button className="btn btn-secondary btn-sm" onClick={startReorder} disabled={inPeriod.length < 2}>↕ Reorder</button>
            ) : (
              <>
                <button className="btn btn-secondary btn-sm" onClick={cancelReorder}>Cancel</button>
                <button className="btn btn-primary btn-sm" onClick={saveOrder}>Save order</button>
              </>
            )}
          </div>
        </div>

        {reordering && (
          <div className="cu-reorder-bar">Reorder mode — use ▲▼ to arrange the feed order, then <strong>Save order</strong>. Other actions are paused.</div>
        )}

        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width: 58 }}>ORDER</th>
              <th>UNIT ID</th>
              <th>INTERNAL TITLE</th>
              <th>TITLE</th>
              <th>EXPOSURE PERIOD</th>
              <th>SELLERS</th>
              <th>LAST EDITOR</th>
              <th className="c">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {liveRows.length === 0 && <tr><td colSpan={8} className="tbl-empty">No units in their exposure window right now.</td></tr>}
            {liveRows.map((u, idx) => {
              const disabled = u.stopped;
              return (
                <tr key={u.id} style={disabled && !reordering ? { background: '#fafafa' } : undefined}>
                  <td>
                    {reordering ? (
                      <span className="sortbtns">
                        <button className="sortbtn" disabled={idx === 0} onClick={() => moveDraft(idx, -1)}>▲</button>
                        <button className="sortbtn" disabled={idx === liveRows.length - 1} onClick={() => moveDraft(idx, 1)}>▼</button>
                      </span>
                    ) : (
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)' }}>{idx + 1}</span>
                    )}
                  </td>
                  <td className="mono" style={{ opacity: disabled ? 0.55 : 1 }}>{u.id}</td>
                  <td style={{ color: 'var(--muted)', opacity: disabled ? 0.55 : 1 }}>{u.internalTitle}</td>
                  <td style={{ opacity: disabled ? 0.55 : 1 }}>
                    <span style={{ fontWeight: 700 }}>{u.title}</span>
                    {disabled && <span className="badge badge-amber" style={{ marginLeft: 8 }}>Stopped</span>}
                  </td>
                  <td className="date" style={{ opacity: disabled ? 0.55 : 1 }}>{fmtDateTime(u.startDate)} → {fmtDateTime(u.endDate)}</td>
                  <td style={{ opacity: disabled ? 0.55 : 1 }}><SellerAvatars handles={u.closetSellers} /></td>
                  <td className="mono" style={{ opacity: disabled ? 0.55 : 1 }}>{u.lastEditor}</td>
                  <td className="c">
                    {reordering ? (
                      <span style={{ color: 'var(--muted)' }}>–</span>
                    ) : (
                      <div className="actions" style={{ justifyContent: 'center', gap: 8 }}>
                        {disabled ? (
                          <>
                            <button className="link" style={{ color: 'var(--green)' }} onClick={() => resume(u.id)}>Resume</button>
                            <span style={{ color: 'var(--border)' }}>·</span>
                            <button className="link" onClick={() => navigate(`/campaign-units/${u.id}/edit`)}>Edit</button>
                          </>
                        ) : (
                          <button className="link" style={{ color: 'var(--red)' }} onClick={() => stop(u.id)}>Stop</button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Section: all units ── */}
      <div className="cu-section">
        <div className="cu-sec-title">All Units <span className="cu-pill">{all.length}</span>
          <span className="cu-sec-hint">newest first</span>
        </div>
        <table className="tbl">
          <thead>
            <tr>
              <th>UNIT ID</th>
              <th>INTERNAL TITLE</th>
              <th>TITLE</th>
              <th>EXPOSURE PERIOD</th>
              <th>SELLERS</th>
              <th className="c">STATUS</th>
              <th>LAST EDITOR</th>
              <th className="c">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {pageUnits.map((u) => {
              const st = unitStatus(u);
              const editable = st.key === 'scheduled' || st.key === 'stopped';
              return (
                <tr key={u.id}>
                  <td className="mono">{u.id}</td>
                  <td style={{ color: 'var(--muted)' }}>{u.internalTitle}</td>
                  <td style={{ fontWeight: 700 }}>{u.title}</td>
                  <td className="date">{fmtDateTime(u.startDate)} → {fmtDateTime(u.endDate)}</td>
                  <td><SellerAvatars handles={u.closetSellers} /></td>
                  <td className="c"><span className={`badge ${st.cls}`}>{st.label}</span></td>
                  <td className="mono">{u.lastEditor}</td>
                  <td className="c">
                    {editable
                      ? <button className="link" onClick={() => navigate(`/campaign-units/${u.id}/edit`)}>Edit</button>
                      : <span style={{ color: 'var(--muted)' }}>–</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="cu-pager">
          <button className="btn btn-secondary btn-sm" disabled={safePage <= 1} onClick={() => setPage(safePage - 1)}>‹ Prev</button>
          <span className="cu-pager-info">Page {safePage} / {pageCount}</span>
          <button className="btn btn-secondary btn-sm" disabled={safePage >= pageCount} onClick={() => setPage(safePage + 1)}>Next ›</button>
        </div>
      </div>
    </>
  );
}
