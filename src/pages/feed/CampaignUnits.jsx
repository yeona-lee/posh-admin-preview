import { useState } from 'react';
import { initials, avatarBg, move, genId, fmtDate, campaignStatus, closetSummary, livesForSellers } from './utils';
import { HeroCard } from './FeedPreview';

const PRESETS = ['#1f3d2f', '#2a2320', '#1a2230', '#3a1f2a', '#241b33', '#2b2b2b', '#7c1d2c', '#1b2433'];
const MAX_UNITS = 10;
const MAX_SELLERS = 100;

const emptyForm = {
  title: '', startDate: '', endDate: '',
  bgColor: '#1f3d2f', image: '', closetSellers: [], excludedShows: [],
};

export default function CampaignUnits({ units, setUnits }) {
  const [mode, setMode] = useState(null);          // 'create' | 'edit'
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [sellerInput, setSellerInput] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  function openCreate() { setForm(emptyForm); setEditId(null); setSellerInput(''); setMode('create'); }
  function openEdit(u) {
    setForm({ ...emptyForm, ...u, closetSellers: [...(u.closetSellers || [])], excludedShows: [...(u.excludedShows || [])] });
    setEditId(u.id); setSellerInput(''); setMode('edit');
  }
  function close() { setMode(null); setEditId(null); setForm(emptyForm); setSellerInput(''); }

  function onPickImage(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setForm((p) => ({ ...p, image: URL.createObjectURL(f) }));
  }

  function addSeller() {
    const raw = sellerInput.trim();
    if (!raw) return;
    const handle = raw.startsWith('@') ? raw : `@${raw}`;
    setForm((p) => {
      if (p.closetSellers.includes(handle) || p.closetSellers.length >= MAX_SELLERS) return p;
      return { ...p, closetSellers: [...p.closetSellers, handle] };
    });
    setSellerInput('');
  }
  function removeSeller(handle) {
    setForm((p) => ({
      ...p,
      closetSellers: p.closetSellers.filter((h) => h !== handle),
    }));
  }
  function toggleExclude(showId) {
    setForm((p) => ({
      ...p,
      excludedShows: p.excludedShows.includes(showId)
        ? p.excludedShows.filter((id) => id !== showId)
        : [...p.excludedShows, showId],
    }));
  }

  function save() {
    if (!form.title.trim()) return;
    if (mode === 'create') setUnits((prev) => [...prev, { ...form, id: genId('CU') }]);
    else setUnits((prev) => prev.map((u) => (u.id === editId ? { ...u, ...form } : u)));
    close();
  }
  function reorder(idx, dir) { setUnits((prev) => move(prev, idx, dir)); }

  // ── editor view ──────────────────────────────────────────────
  if (mode) {
    const lives = livesForSellers(form.closetSellers);
    const shownCount = lives.filter((s) => !form.excludedShows.includes(s.id)).length;

    return (
      <div className="form-panel">
        <div className="form-panel-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{mode === 'create' ? 'New Campaign Unit' : 'Edit Campaign Unit'}</span>
          <button className="link" onClick={close} style={{ color: 'var(--muted)' }}>Cancel</button>
        </div>
        <div className="form-panel-body" style={{ display: 'flex', gap: 22, flexWrap: 'wrap' }}>
          {/* ── form fields ── */}
          <div style={{ flex: '1 1 360px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-col">
              <label className="form-label">UNIT TITLE <span className="required">*</span></label>
              <input className="inp inp-full" style={{ height: 38, fontSize: 14 }}
                value={form.title} placeholder="e.g. Lauren X Poshmark"
                onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <div className="form-col">
                <label className="form-label">START <span className="required">*</span></label>
                <input className="inp inp-full" style={{ height: 38 }} type="datetime-local"
                  value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
              </div>
              <div className="form-col">
                <label className="form-label">END <span className="required">*</span></label>
                <input className="inp inp-full" style={{ height: 38 }} type="datetime-local"
                  value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
              </div>
            </div>

            {/* background */}
            <div className="form-col">
              <label className="form-label">BACKGROUND COLOR</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                {PRESETS.map((c) => (
                  <button key={c} className={`swatch${form.bgColor === c ? ' sel' : ''}`}
                    style={{ background: c }} onClick={() => setForm({ ...form, bgColor: c })} title={c} />
                ))}
                <input type="color" value={form.bgColor} onChange={(e) => setForm({ ...form, bgColor: e.target.value })}
                  style={{ width: 30, height: 28, padding: 0, border: '1px solid var(--border)', borderRadius: 4, background: 'none', cursor: 'pointer' }} />
                <input className="inp" style={{ width: 92 }} value={form.bgColor}
                  onChange={(e) => setForm({ ...form, bgColor: e.target.value })} />
              </div>
            </div>

            {/* hero image — upload only, with spec guidance */}
            <div className="form-col">
              <label className="form-label">HERO IMAGE</label>
              {form.image ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 56, height: 70, borderRadius: 6, background: `center/cover url(${form.image})`, border: '1px solid var(--border)' }} />
                  <button className="btn btn-secondary btn-sm" onClick={() => setForm({ ...form, image: '' })}>Replace</button>
                </div>
              ) : (
                <label className="dropzone">
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>⬆ Click to upload hero image</div>
                  <div style={{ marginTop: 4 }}>Recommended 1080 × 1350px (4:5 portrait) · JPG·PNG · max 5MB</div>
                  <input type="file" accept="image/png,image/jpeg" hidden onChange={onPickImage} />
                </label>
              )}
            </div>

            {/* closet sellers — typed, multiple, max 100 */}
            <div className="form-col">
              <label className="form-label">CLOSET SELLERS &nbsp;<span style={{ color: 'var(--muted)', fontWeight: 400 }}>{form.closetSellers.length}/{MAX_SELLERS}</span></label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input className="inp inp-full" style={{ height: 38 }}
                  placeholder="Type a seller handle then Enter (e.g. @lauren)"
                  value={sellerInput} onChange={(e) => setSellerInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSeller())} />
                <button className="btn btn-primary" style={{ height: 38, padding: '0 16px' }}
                  onClick={addSeller} disabled={form.closetSellers.length >= MAX_SELLERS}>Add</button>
              </div>
              {form.closetSellers.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                  {form.closetSellers.map((h) => (
                    <span key={h} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6, background: '#f3f4f6',
                      border: '1px solid var(--border)', borderRadius: 14, padding: '3px 6px 3px 3px', fontSize: 12,
                    }}>
                      <span style={{ width: 22, height: 22, borderRadius: '50%', background: avatarBg(h), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#555' }}>{initials(h)}</span>
                      {h}
                      <button onClick={() => removeSeller(h)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: 13, lineHeight: 1 }}>✕</button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* featured lives — auto-pulled, opt-out */}
            <div className="form-col">
              <label className="form-label">FEATURED LIVES &nbsp;<span style={{ color: 'var(--muted)', fontWeight: 400 }}>{shownCount} shown · {form.excludedShows.length} hidden</span></label>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>
                Auto-loaded from the CLOSET sellers' scheduled & live shows. Uncheck to hide a show from the feed.
              </div>
              {lives.length === 0 ? (
                <div style={{ border: '1px dashed var(--border)', borderRadius: 6, padding: 14, textAlign: 'center', color: 'var(--muted)', fontSize: 12 }}>
                  Add CLOSET sellers above to load their upcoming lives.
                </div>
              ) : (
                <div style={{ border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden' }}>
                  {lives.map((s) => {
                    const excluded = form.excludedShows.includes(s.id);
                    return (
                      <label key={s.id} style={{
                        display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
                        borderBottom: '1px solid var(--border-light)', cursor: 'pointer',
                        opacity: excluded ? 0.45 : 1,
                      }}>
                        <input type="checkbox" checked={!excluded} onChange={() => toggleExclude(s.id)} />
                        <span className={`badge ${s.status === 'live' ? 'badge-live' : 'badge-scheduled'}`} style={{ fontSize: 9 }}>
                          {s.status === 'live' ? 'LIVE' : 'SOON'}
                        </span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, textDecoration: excluded ? 'line-through' : 'none' }}>{s.title}</div>
                          <div style={{ fontSize: 11, color: 'var(--muted)' }}>{s.handle} · {fmtDate(s.startTime)}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ── live preview of this unit ── */}
          <div style={{ flex: '0 0 260px' }}>
            <label className="form-label">PREVIEW</label>
            <div style={{ marginTop: 6 }}><HeroCard unit={form} /></div>
          </div>
        </div>
        <div className="form-panel-footer">
          <button className="btn btn-secondary" onClick={close}>Cancel</button>
          <button className="btn btn-primary" onClick={save} disabled={!form.title.trim()}>Save Unit</button>
        </div>
      </div>
    );
  }

  // ── list view ────────────────────────────────────────────────
  const liveCount = units.filter((u) => campaignStatus(u).key === 'live').length;
  return (
    <>
      <div className="sec-header">
        <span className="sec-count">{units.length} campaign units · {liveCount} live</span>
        <button className="btn btn-primary" onClick={openCreate} disabled={units.length >= MAX_UNITS}>
          + Add Campaign Unit ({units.length}/{MAX_UNITS})
        </button>
      </div>

      <table className="tbl">
        <thead>
          <tr>
            <th style={{ width: 54 }}>ORDER</th>
            <th>UNIT</th>
            <th>PERIOD</th>
            <th>CLOSET</th>
            <th className="c">LIVES</th>
            <th className="c">ON FEED</th>
            <th className="c">MANAGE</th>
          </tr>
        </thead>
        <tbody>
          {units.length === 0 && <tr><td colSpan={7} className="tbl-empty">No campaign units.</td></tr>}
          {units.map((u, idx) => {
            const status = campaignStatus(u);
            const liveN = livesForSellers(u.closetSellers).filter((s) => !(u.excludedShows || []).includes(s.id)).length;
            return (
              <tr key={u.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', width: 14 }}>{idx + 1}</span>
                    <span className="sortbtns">
                      <button className="sortbtn" disabled={idx === 0} onClick={() => reorder(idx, -1)}>▲</button>
                      <button className="sortbtn" disabled={idx === units.length - 1} onClick={() => reorder(idx, 1)}>▼</button>
                    </span>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 24, height: 30, borderRadius: 5, flexShrink: 0, background: u.image ? `center/cover url(${u.image})` : u.bgColor, border: '1px solid rgba(0,0,0,.1)' }} />
                    <span style={{ fontWeight: 700, fontSize: 13 }}>{u.title}</span>
                  </div>
                </td>
                <td className="date">{fmtDate(u.startDate)} → {fmtDate(u.endDate)}</td>
                <td style={{ fontSize: 12, color: 'var(--burgundy)', fontWeight: 600 }}>{closetSummary(u.closetSellers)}</td>
                <td className="c">{liveN}</td>
                <td className="c"><span className={`badge ${status.cls}`}>{status.label}</span></td>
                <td className="c">
                  <div className="actions" style={{ justifyContent: 'center', gap: 8 }}>
                    <button className="link" onClick={() => openEdit(u)}>Edit</button>
                    <span style={{ color: 'var(--border)' }}>·</span>
                    <button className="link" style={{ color: 'var(--red)' }} onClick={() => setConfirmDelete(u)}>Delete</button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {confirmDelete && (
        <div className="overlay" onClick={() => setConfirmDelete(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Delete Campaign Unit</span>
              <button className="modal-close" onClick={() => setConfirmDelete(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p className="modal-msg">Delete "{confirmDelete.title}"?</p>
              <div className="modal-detail">It will be removed from the For You feed. This cannot be undone.</div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="btn btn-red" onClick={() => { setUnits((prev) => prev.filter((u) => u.id !== confirmDelete.id)); setConfirmDelete(null); }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
