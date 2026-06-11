import { useState } from 'react';
import { SALE_TYPES, LIVE_CATEGORIES, BRAND_TAGS } from '../../data/sampleData';
import { move, genId, filterSummary, closetSummary, initials, avatarBg } from './utils';
import { ThemeTile } from './FeedPreview';

const PRESETS = ['#3a1f2a', '#1b2433', '#26331f', '#241b33', '#2b2b2b', '#1f3330', '#7c1d2c', '#2a2320'];
const MAX = 12;
const MAX_SELLERS = 100;

const emptyForm = {
  title: '', badge: '', bgColor: '#1b2433', image: '', enabled: true, mode: 'filter',
  filters: { saleType: '', category: '', subCategory: '', brands: [] },
  sellers: [],
};

export default function ThemeUnits({ units, setUnits }) {
  const [mode, setMode] = useState(null);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [brandInput, setBrandInput] = useState('');
  const [sellerInput, setSellerInput] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  function openCreate() { setForm(emptyForm); setEditId(null); setBrandInput(''); setSellerInput(''); setMode('create'); }
  function openEdit(u) {
    setForm({
      ...emptyForm, ...u,
      filters: { ...emptyForm.filters, ...u.filters, brands: [...(u.filters?.brands || [])] },
      sellers: [...(u.sellers || [])],
    });
    setEditId(u.id); setBrandInput(''); setSellerInput(''); setMode('edit');
  }
  function close() { setMode(null); setEditId(null); setForm(emptyForm); setBrandInput(''); setSellerInput(''); }

  function onPickImage(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setForm((p) => ({ ...p, image: URL.createObjectURL(f) }));
  }
  function setFilter(key, val) { setForm((p) => ({ ...p, filters: { ...p.filters, [key]: val } })); }
  function setCategory(name) {
    setForm((p) => ({ ...p, filters: { ...p.filters, category: name, subCategory: '' } }));
  }
  function addBrand(id) {
    if (!id) return;
    setForm((p) => p.filters.brands.includes(id) ? p : { ...p, filters: { ...p.filters, brands: [...p.filters.brands, id] } });
    setBrandInput('');
  }
  function removeBrand(id) { setForm((p) => ({ ...p, filters: { ...p.filters, brands: p.filters.brands.filter((b) => b !== id) } })); }

  function addSeller() {
    const raw = sellerInput.trim();
    if (!raw) return;
    const handle = raw.startsWith('@') ? raw : `@${raw}`;
    setForm((p) => (p.sellers.includes(handle) || p.sellers.length >= MAX_SELLERS) ? p : { ...p, sellers: [...p.sellers, handle] });
    setSellerInput('');
  }
  function removeSeller(handle) { setForm((p) => ({ ...p, sellers: p.sellers.filter((h) => h !== handle) })); }

  function save() {
    if (!form.title.trim()) return;
    if (mode === 'create') setUnits((prev) => [...prev, { ...form, id: genId('TU') }]);
    else setUnits((prev) => prev.map((u) => (u.id === editId ? { ...u, ...form } : u)));
    close();
  }
  function toggle(id) { setUnits((prev) => prev.map((u) => (u.id === id ? { ...u, enabled: !u.enabled } : u))); }
  function reorder(idx, dir) { setUnits((prev) => move(prev, idx, dir)); }

  function summaryFor(u) {
    return u.mode === 'sellers'
      ? `Sellers · ${closetSummary(u.sellers)}`
      : filterSummary(u.filters);
  }

  // ── editor ───────────────────────────────────────────────────
  if (mode) {
    const subOptions = LIVE_CATEGORIES.find((c) => c.name === form.filters.category)?.subs || [];
    const brandMatches = BRAND_TAGS
      .filter((b) => !form.filters.brands.includes(b.id))
      .filter((b) => brandInput && b.name.toLowerCase().includes(brandInput.toLowerCase()));

    return (
      <div className="form-panel">
        <div className="form-panel-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{mode === 'create' ? 'New Theme' : 'Edit Theme'}</span>
          <button className="link" onClick={close} style={{ color: 'var(--muted)' }}>Cancel</button>
        </div>
        <div className="form-panel-body" style={{ display: 'flex', gap: 22, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 380px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <div className="form-col">
                <label className="form-label">THEME TITLE <span className="required">*</span></label>
                <input className="inp inp-full" style={{ height: 38, fontSize: 14 }}
                  value={form.title} placeholder="e.g. Quiet luxury"
                  onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="form-col">
                <label className="form-label">BADGE <span style={{ color: 'var(--muted)', fontWeight: 400 }}>optional</span></label>
                <input className="inp inp-full" style={{ height: 38 }}
                  value={form.badge} placeholder="e.g. POSH MARKETS"
                  onChange={(e) => setForm({ ...form, badge: e.target.value })} />
              </div>
            </div>

            {/* background */}
            <div className="form-col">
              <label className="form-label">BACKGROUND COLOR</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                {PRESETS.map((c) => (
                  <button key={c} className={`swatch${form.bgColor === c ? ' sel' : ''}`} style={{ background: c }} onClick={() => setForm({ ...form, bgColor: c })} title={c} />
                ))}
                <input type="color" value={form.bgColor} onChange={(e) => setForm({ ...form, bgColor: e.target.value })}
                  style={{ width: 30, height: 28, padding: 0, border: '1px solid var(--border)', borderRadius: 4, background: 'none', cursor: 'pointer' }} />
              </div>
            </div>

            {/* image */}
            <div className="form-col">
              <label className="form-label">TILE IMAGE</label>
              {form.image ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 64, height: 44, borderRadius: 6, background: `center/cover url(${form.image})`, border: '1px solid var(--border)' }} />
                  <button className="btn btn-secondary btn-sm" onClick={() => setForm({ ...form, image: '' })}>Replace</button>
                </div>
              ) : (
                <label className="dropzone">
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>⬆ Click to upload tile image</div>
                  <div style={{ marginTop: 4 }}>권장 규격 800 × 800px (1:1) · JPG·PNG · 최대 3MB</div>
                  <input type="file" accept="image/png,image/jpeg" hidden onChange={onPickImage} />
                </label>
              )}
            </div>

            {/* mode toggle */}
            <div className="form-col">
              <label className="form-label">CONTENT SOURCE</label>
              <div className="seg">
                <button className={form.mode === 'filter' ? 'on' : ''} onClick={() => setForm({ ...form, mode: 'filter' })}>Filter conditions</button>
                <button className={form.mode === 'sellers' ? 'on' : ''} onClick={() => setForm({ ...form, mode: 'sellers' })}>Manual seller list</button>
              </div>
            </div>

            {/* filter mode */}
            {form.mode === 'filter' && (
              <div style={{ border: '1px solid var(--border)', borderRadius: 6, padding: 12, background: '#fafafa' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: .5 }}>Filter Conditions</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-col">
                    <label className="form-label">SALE TYPE</label>
                    <select className="inp inp-full" style={{ height: 36 }} value={form.filters.saleType} onChange={(e) => setFilter('saleType', e.target.value)}>
                      <option value="">Any</option>
                      {SALE_TYPES.filter((s) => s.name !== 'None').map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div className="form-col">
                    <label className="form-label">CATEGORY</label>
                    <select className="inp inp-full" style={{ height: 36 }} value={form.filters.category} onChange={(e) => setCategory(e.target.value)}>
                      <option value="">Any</option>
                      {LIVE_CATEGORIES.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="form-col">
                    <label className="form-label">SUB CATEGORY</label>
                    <select className="inp inp-full" style={{ height: 36 }} value={form.filters.subCategory} disabled={!form.filters.category}
                      onChange={(e) => setFilter('subCategory', e.target.value)}>
                      <option value="">{form.filters.category ? 'All sub categories' : 'Pick a category first'}</option>
                      {subOptions.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
                    </select>
                  </div>
                  <div className="form-col" style={{ position: 'relative' }}>
                    <label className="form-label">BRAND</label>
                    <input className="inp inp-full" style={{ height: 36 }} placeholder="Type a brand…"
                      value={brandInput} onChange={(e) => setBrandInput(e.target.value)} />
                    {brandMatches.length > 0 && (
                      <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 5, background: '#fff', border: '1px solid var(--border)', borderRadius: 6, marginTop: 2, maxHeight: 160, overflowY: 'auto', boxShadow: '0 4px 14px rgba(0,0,0,.12)' }}>
                        {brandMatches.slice(0, 8).map((b) => (
                          <div key={b.id} onClick={() => addBrand(b.id)}
                            style={{ padding: '7px 10px', cursor: 'pointer', fontSize: 12, display: 'flex', justifyContent: 'space-between' }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = '#f5f5f5')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}>
                            <span>{b.name}</span><span style={{ color: 'var(--muted)' }}>{b.contents} live</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {form.filters.brands.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                    {form.filters.brands.map((id) => {
                      const b = BRAND_TAGS.find((x) => x.id === id);
                      if (!b) return null;
                      return (
                        <span key={id} className="chip active" style={{ cursor: 'default' }}>
                          {b.name}
                          <button onClick={() => removeBrand(id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', marginLeft: 6, fontSize: 12 }}>✕</button>
                        </span>
                      );
                    })}
                  </div>
                )}
                <div style={{ marginTop: 10, fontSize: 12 }}>
                  <span style={{ color: 'var(--muted)' }}>Matches: </span><strong>{filterSummary(form.filters)}</strong>
                </div>
              </div>
            )}

            {/* sellers mode */}
            {form.mode === 'sellers' && (
              <div style={{ border: '1px solid var(--border)', borderRadius: 6, padding: 12, background: '#fafafa' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: .5 }}>
                  Seller list <span style={{ fontWeight: 400 }}>· {form.sellers.length}/{MAX_SELLERS}</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input className="inp inp-full" style={{ height: 36 }} placeholder="Type a seller handle then Enter (e.g. @luxury_house)"
                    value={sellerInput} onChange={(e) => setSellerInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSeller())} />
                  <button className="btn btn-primary" style={{ height: 36, padding: '0 16px' }} onClick={addSeller}>Add</button>
                </div>
                {form.sellers.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                    {form.sellers.map((h) => (
                      <span key={h} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fff', border: '1px solid var(--border)', borderRadius: 14, padding: '3px 6px 3px 3px', fontSize: 12 }}>
                        <span style={{ width: 22, height: 22, borderRadius: '50%', background: avatarBg(h), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#555' }}>{initials(h)}</span>
                        {h}
                        <button onClick={() => removeSeller(h)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: 13 }}>✕</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div style={{ flex: '0 0 200px' }}>
            <label className="form-label">PREVIEW</label>
            <div style={{ marginTop: 6, width: 180 }}><ThemeTile unit={form} /></div>
          </div>
        </div>
        <div className="form-panel-footer">
          <button className="btn btn-secondary" onClick={close}>Cancel</button>
          <button className="btn btn-primary" onClick={save} disabled={!form.title.trim()}>Save Theme</button>
        </div>
      </div>
    );
  }

  // ── list ─────────────────────────────────────────────────────
  return (
    <>
      <div className="sec-header">
        <span className="sec-count">{units.length} themes · {units.filter((u) => u.enabled).length} on feed</span>
        <button className="btn btn-primary" onClick={openCreate} disabled={units.length >= MAX}>
          + Add Theme ({units.length}/{MAX})
        </button>
      </div>

      <table className="tbl">
        <thead>
          <tr>
            <th style={{ width: 54 }}>ORDER</th>
            <th>THEME</th>
            <th>SOURCE</th>
            <th>CONDITIONS / SELLERS</th>
            <th className="c">ON FEED</th>
            <th className="c">MANAGE</th>
          </tr>
        </thead>
        <tbody>
          {units.length === 0 && <tr><td colSpan={6} className="tbl-empty">No themes.</td></tr>}
          {units.map((u, idx) => (
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
                  <span style={{ width: 28, height: 28, borderRadius: 6, flexShrink: 0, background: u.image ? `center/cover url(${u.image})` : u.bgColor, border: '1px solid rgba(0,0,0,.1)' }} />
                  <span style={{ fontWeight: 700, fontSize: 13 }}>{u.title}</span>
                  {u.badge && <span className="badge" style={{ background: 'var(--burgundy)', color: '#fff' }}>{u.badge}</span>}
                </div>
              </td>
              <td><span className={`badge ${u.mode === 'sellers' ? 'badge-amber' : 'badge-grey'}`}>{u.mode === 'sellers' ? 'Sellers' : 'Filter'}</span></td>
              <td style={{ fontSize: 12, color: '#444' }}>{summaryFor(u)}</td>
              <td className="c"><button className={`toggle${u.enabled ? ' on' : ''}`} onClick={() => toggle(u.id)} /></td>
              <td className="c">
                <div className="actions" style={{ justifyContent: 'center', gap: 8 }}>
                  <button className="link" onClick={() => openEdit(u)}>Edit</button>
                  <span style={{ color: 'var(--border)' }}>·</span>
                  <button className="link" style={{ color: 'var(--red)' }} onClick={() => setConfirmDelete(u)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {confirmDelete && (
        <div className="overlay" onClick={() => setConfirmDelete(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Delete Theme</span>
              <button className="modal-close" onClick={() => setConfirmDelete(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p className="modal-msg">Delete "{confirmDelete.title}"?</p>
              <div className="modal-detail">It will be removed from Browse by theme. This cannot be undone.</div>
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
