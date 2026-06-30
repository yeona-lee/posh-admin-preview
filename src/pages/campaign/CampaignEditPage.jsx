import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCampaigns } from './store';
import CampaignFields from './CampaignFields';
import HeroPreview from './HeroPreview';
import { livesForSellers, fmtShowTime, unitStatus } from './utils';

export default function CampaignEditPage() {
  const { id } = useParams();
  const { get, update } = useCampaigns();
  const navigate = useNavigate();
  const unit = get(id);

  const [form, setForm] = useState(
    unit
      ? { ...unit, closetSellers: [...(unit.closetSellers || [])], excludedShows: [...(unit.excludedShows || [])] }
      : null
  );
  // explicit "stop specific lives" mode
  const [livesMode, setLivesMode] = useState(false);
  const [liveDraft, setLiveDraft] = useState([]);

  if (!unit || !form) {
    return (
      <div className="cu-panel">
        Unit not found. <button className="link" onClick={() => navigate('/campaign-units')}>Back to list</button>
      </div>
    );
  }

  const lives = livesForSellers(form.closetSellers);
  const status = unitStatus(unit);

  function startLivesEdit() {
    setLiveDraft([...form.excludedShows]);
    setLivesMode(true);
  }
  function toggleDraft(showId) {
    setLiveDraft((d) => (d.includes(showId) ? d.filter((i) => i !== showId) : [...d, showId]));
  }
  function confirmLives() {
    setForm((p) => ({ ...p, excludedShows: liveDraft }));
    setLivesMode(false);
    setLiveDraft([]);
  }
  function cancelLives() {
    setLivesMode(false);
    setLiveDraft([]);
  }
  function save() {
    update(id, form);
    navigate('/campaign-units');
  }

  return (
    <div className="cu-form-page">
      <div className="cu-page-head">
        <button className="link" onClick={() => navigate('/campaign-units')}>‹ Back to list</button>
        <h1 className="cu-h1">Edit Campaign Unit <span className="mono" style={{ fontSize: 14, color: 'var(--muted)' }}>{unit.id}</span>
          <span className={`badge ${status.cls}`} style={{ marginLeft: 8, verticalAlign: 'middle' }}>{status.label}</span>
        </h1>
      </div>

      <div className="cu-edit-grid">
        {/* left: editable fields */}
        <div className="cu-panel">
          <CampaignFields form={form} setForm={setForm} />

          {/* lives in period — gated "stop specific lives" mode */}
          <div className="form-col" style={{ marginTop: 18 }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
              LIVES IN THIS PERIOD
              <span style={{ color: 'var(--muted)', fontWeight: 400, marginLeft: 6 }}>
                {form.excludedShows.length > 0 ? `${form.excludedShows.length} stopped` : 'all showing'}
              </span>
              <span style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                {!livesMode ? (
                  <button type="button" className="btn btn-secondary btn-sm" onClick={startLivesEdit} disabled={lives.length === 0}>
                    Stop specific lives
                  </button>
                ) : (
                  <>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={cancelLives}>Cancel</button>
                    <button type="button" className="btn btn-primary btn-sm" onClick={confirmLives}>Confirm</button>
                  </>
                )}
              </span>
            </label>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>
              Auto-collected from the sellers' scheduled & live shows in this period.
              {livesMode && <strong> Check the lives to stop, then Confirm.</strong>}
            </div>

            {lives.length === 0 ? (
              <div style={{ border: '1px dashed var(--border)', borderRadius: 6, padding: 14, textAlign: 'center', color: 'var(--muted)', fontSize: 12 }}>
                Add sellers to load their lives.
              </div>
            ) : (
              <div style={{ border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden' }}>
                {lives.map((s) => {
                  const stopped = livesMode ? liveDraft.includes(s.id) : form.excludedShows.includes(s.id);
                  const Row = livesMode ? 'label' : 'div';
                  return (
                    <Row key={s.id} style={{
                      display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
                      borderBottom: '1px solid var(--border-light)', cursor: livesMode ? 'pointer' : 'default',
                      background: stopped ? '#fff7f7' : '#fff',
                    }}>
                      {livesMode && <input type="checkbox" checked={stopped} onChange={() => toggleDraft(s.id)} />}
                      <span className={`badge ${s.status === 'live' ? 'badge-live' : 'badge-scheduled'}`} style={{ fontSize: 9 }}>
                        {s.status === 'live' ? 'LIVE' : 'SOON'}
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, textDecoration: stopped ? 'line-through' : 'none', color: stopped ? 'var(--muted)' : 'var(--text)' }}>{s.title}</div>
                        <div style={{ fontSize: 11, color: 'var(--muted)' }}>{s.handle} · {fmtShowTime(s.startTime)}</div>
                      </div>
                      {stopped && <span style={{ fontSize: 10, color: 'var(--red)', fontWeight: 700 }}>STOPPED</span>}
                    </Row>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* right: service preview */}
        <div className="cu-preview-col">
          <div className="form-label" style={{ marginBottom: 8 }}>SERVICE PREVIEW</div>
          <HeroPreview unit={form} />
        </div>
      </div>

      <div className="cu-form-actions">
        <button className="btn btn-secondary" onClick={() => navigate('/campaign-units')}>Cancel</button>
        <button className="btn btn-primary" onClick={save}>Save</button>
      </div>
    </div>
  );
}
