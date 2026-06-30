import { useState } from 'react';
import { initials, avatarBg } from './utils';

const MAX_SELLERS = 100;

// Shared input fields for both the Create and Edit pages.
export default function CampaignFields({ form, setForm }) {
  const [sellerInput, setSellerInput] = useState('');

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
      const list = p.closetSellers || [];
      if (list.includes(handle) || list.length >= MAX_SELLERS) return p;
      return { ...p, closetSellers: [...list, handle] };
    });
    setSellerInput('');
  }
  function removeSeller(handle) {
    setForm((p) => ({ ...p, closetSellers: (p.closetSellers || []).filter((h) => h !== handle) }));
  }

  const sellers = form.closetSellers || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div className="form-col">
        <label className="form-label">INTERNAL TITLE <span className="required">*</span></label>
        <input className="inp inp-full" style={{ height: 38, fontSize: 13 }}
          value={form.internalTitle} placeholder="Ops reference — not shown to users"
          onChange={(e) => setForm({ ...form, internalTitle: e.target.value })} />
      </div>

      <div className="form-col">
        <label className="form-label">TITLE <span className="required">*</span></label>
        <input className="inp inp-full" style={{ height: 38, fontSize: 14 }}
          value={form.title} placeholder="Shown on the feed — e.g. Summer Dress Week"
          onChange={(e) => setForm({ ...form, title: e.target.value })} />
      </div>

      <div className="form-col">
        <label className="form-label">EXPOSURE PERIOD <span className="required">*</span></label>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <input className="inp" style={{ height: 38, flex: '1 1 200px' }} type="datetime-local" step="1"
            value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
          <span style={{ color: 'var(--muted)' }}>→</span>
          <input className="inp" style={{ height: 38, flex: '1 1 200px' }} type="datetime-local" step="1"
            value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
        </div>
      </div>

      <div className="form-col">
        <label className="form-label">BACKGROUND IMAGE</label>
        {form.image ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 56, height: 70, borderRadius: 6, background: `center/cover url(${form.image})`, border: '1px solid var(--border)' }} />
            <button className="btn btn-secondary btn-sm" onClick={() => setForm({ ...form, image: '' })}>Replace</button>
          </div>
        ) : (
          <label className="dropzone">
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>⬆ Click to upload background image</div>
            <div style={{ marginTop: 4 }}>Recommended 1080 × 1350px (4:5 portrait) · JPG·PNG · max 5MB</div>
            <input type="file" accept="image/png,image/jpeg" hidden onChange={onPickImage} />
          </label>
        )}
      </div>

      <div className="form-col">
        <label className="form-label">SELLERS &nbsp;<span style={{ color: 'var(--muted)', fontWeight: 400 }}>{sellers.length}/{MAX_SELLERS}</span></label>
        <div style={{ display: 'flex', gap: 8 }}>
          <input className="inp inp-full" style={{ height: 38 }}
            placeholder="Type a seller handle then Enter (e.g. @lauren)"
            value={sellerInput} onChange={(e) => setSellerInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSeller())} />
          <button className="btn btn-primary" style={{ height: 38, padding: '0 16px' }}
            onClick={addSeller} disabled={sellers.length >= MAX_SELLERS}>Add</button>
        </div>
        {sellers.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
            {sellers.map((h) => (
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
    </div>
  );
}
