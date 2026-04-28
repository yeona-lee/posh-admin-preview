import { useState } from 'react';
import { EVENTS } from '../data/sampleData';

const emptyForm = { title: '', startDate: '', endDate: '', sellers: [] };

function formatDate(iso) {
  if (!iso) return '–';
  return new Date(iso).toLocaleString('en-US', {
    month: '2-digit', day: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: false,
  });
}

function initials(handle) {
  return handle.replace('@', '').slice(0, 2).toUpperCase();
}

function randomColor(str) {
  const colors = ['#e8d5c4', '#c4d8e8', '#d5e8c4', '#e8c4d5', '#d5c4e8', '#e8e4c4'];
  let n = 0;
  for (let i = 0; i < str.length; i++) n += str.charCodeAt(i);
  return colors[n % colors.length];
}

export default function EventsPage() {
  const [events, setEvents] = useState(EVENTS);
  const [formMode, setFormMode] = useState(null); // 'create' | 'edit'
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [sellerInput, setSellerInput] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  function openCreate() {
    setForm(emptyForm);
    setEditId(null);
    setSellerInput('');
    setFormMode('create');
  }

  function openEdit(ev) {
    setForm({ title: ev.title, startDate: ev.startDate, endDate: ev.endDate, sellers: [...ev.sellers] });
    setEditId(ev.id);
    setSellerInput('');
    setFormMode('edit');
  }

  function closeForm() {
    setFormMode(null);
    setForm(emptyForm);
    setEditId(null);
    setSellerInput('');
  }

  function addSeller() {
    const raw = sellerInput.trim();
    if (!raw) return;
    const handle = raw.startsWith('@') ? raw : `@${raw}`;
    if (form.sellers.find((s) => s.handle === handle)) {
      setSellerInput('');
      return;
    }
    const name = handle.replace('@', '').replace(/_/g, ' ');
    setForm((prev) => ({ ...prev, sellers: [...prev.sellers, { handle, name }] }));
    setSellerInput('');
  }

  function removeSeller(handle) {
    setForm((prev) => ({ ...prev, sellers: prev.sellers.filter((s) => s.handle !== handle) }));
  }

  function handleSave() {
    if (!form.title.trim()) return;
    if (formMode === 'create') {
      const newEv = {
        id: Math.random().toString(36).slice(2, 6).toUpperCase(),
        ...form,
      };
      setEvents((prev) => [...prev, newEv]);
    } else {
      setEvents((prev) => prev.map((e) => e.id === editId ? { ...e, ...form } : e));
    }
    closeForm();
  }

  if (formMode) {
    return (
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <div className="form-panel">
          <div className="form-panel-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{formMode === 'create' ? 'Add New Unit' : 'Edit Unit'}</span>
            <button className="link" onClick={closeForm} style={{ fontSize: 13, color: 'var(--muted)' }}>Cancel</button>
          </div>
          <div className="form-panel-body">
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              {/* Left column */}
              <div style={{ flex: '1 1 320px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="form-col">
                  <label className="form-label">UNIT TITLE <span className="required">*</span></label>
                  <input
                    className="inp inp-full"
                    style={{ height: 40, fontSize: 13 }}
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="기획전 제목을 입력하세요"
                  />
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div className="form-col">
                    <label className="form-label">START DATE <span className="required">*</span></label>
                    <input
                      className="inp inp-full"
                      style={{ height: 40, fontSize: 13 }}
                      type="datetime-local"
                      value={form.startDate}
                      onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    />
                  </div>
                  <div className="form-col">
                    <label className="form-label">END DATE <span className="required">*</span></label>
                    <input
                      className="inp inp-full"
                      style={{ height: 40, fontSize: 13 }}
                      type="datetime-local"
                      value={form.endDate}
                      onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Right column — seller management */}
              <div style={{ flex: '1 1 280px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <label className="form-label">MANAGE SELLERS</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    className="inp inp-full"
                    style={{ height: 40, fontSize: 13 }}
                    placeholder="Enter seller handle (e.g. @posh_seller)"
                    value={sellerInput}
                    onChange={(e) => setSellerInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addSeller()}
                  />
                  <button
                    className="btn btn-primary"
                    style={{ height: 40, padding: '0 18px', fontSize: 13 }}
                    onClick={addSeller}
                  >
                    Add
                  </button>
                </div>
                {form.sellers.length > 0 && (
                  <div style={{ border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden' }}>
                    {form.sellers.map((seller) => (
                      <div
                        key={seller.handle}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          padding: '10px 12px', borderBottom: '1px solid var(--border-light)',
                        }}
                      >
                        <div
                          style={{
                            width: 36, height: 36, borderRadius: '50%',
                            background: randomColor(seller.handle),
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 11, fontWeight: 700, color: '#555', flexShrink: 0,
                          }}
                        >
                          {initials(seller.handle)}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{seller.name}</div>
                          <div style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--muted)' }}>{seller.handle}</div>
                        </div>
                        <button
                          onClick={() => removeSeller(seller.handle)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: 15, padding: '2px 4px' }}
                        >
                          🗑
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="form-panel-footer">
            <button className="btn btn-secondary" onClick={closeForm}>취소</button>
            <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="sec-header">
        <span className="sec-count">{events.length}개 기획전</span>
        <button className="btn btn-primary" onClick={openCreate}>+ Add New Unit ({events.length}/10)</button>
      </div>

      <table className="tbl">
        <thead>
          <tr>
            <th style={{ width: 24 }}></th>
            <th>ID</th>
            <th>UNIT TITLE</th>
            <th>START DATE</th>
            <th>END DATE</th>
            <th className="c">MANAGE</th>
          </tr>
        </thead>
        <tbody>
          {events.length === 0 && (
            <tr><td colSpan={6} className="tbl-empty">등록된 기획전이 없습니다.</td></tr>
          )}
          {events.map((ev, idx) => (
            <tr key={ev.id}>
              <td style={{ color: 'var(--border)', fontSize: 16, cursor: 'grab', textAlign: 'center' }}>⠿</td>
              <td className="mono">{ev.id}</td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span
                    style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 26, height: 26, borderRadius: 6,
                      background: '#1e1e1e', color: '#fff',
                      fontSize: 12, fontWeight: 700, flexShrink: 0,
                    }}
                  >
                    {idx + 1}
                  </span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{ev.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>{ev.sellers.length} sellers registered</div>
                  </div>
                </div>
              </td>
              <td className="date">{formatDate(ev.startDate)}</td>
              <td className="date">{formatDate(ev.endDate)}</td>
              <td className="c">
                <div className="actions" style={{ justifyContent: 'center' }}>
                  <button
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--muted)', padding: '2px 6px' }}
                    onClick={() => openEdit(ev)}
                    title="수정"
                  >
                    ✏️
                  </button>
                  <button
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--red)', padding: '2px 6px' }}
                    onClick={() => setConfirmDelete(ev)}
                    title="삭제"
                  >
                    🗑
                  </button>
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
              <span className="modal-title">기획전 삭제</span>
              <button className="modal-close" onClick={() => setConfirmDelete(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p className="modal-msg">"{confirmDelete.title}" 기획전을 삭제하시겠습니까?</p>
              <div className="modal-detail">삭제 후 복구가 불가합니다.</div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>취소</button>
              <button className="btn btn-red" onClick={() => {
                setEvents((prev) => prev.filter((e) => e.id !== confirmDelete.id));
                setConfirmDelete(null);
              }}>삭제</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
