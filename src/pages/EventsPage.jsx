import { useState } from 'react';
import { EVENTS, STATUS_LABELS, STATUS_BADGE_CLASS } from '../data/sampleData';

const STATUS_FILTERS = ['all', 'live', 'scheduled', 'done'];
const emptyForm = { title: '', description: '', startDate: '', endDate: '', status: 'scheduled' };

function formatDate(iso) {
  if (!iso) return '–';
  return new Date(iso).toLocaleString('ko-KR', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
}

export default function EventsPage() {
  const [events, setEvents] = useState(EVENTS);
  const [statusFilter, setStatusFilter] = useState('all');
  const [formMode, setFormMode] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filtered = events.filter((e) => statusFilter === 'all' || e.status === statusFilter);

  function openCreate() {
    setForm(emptyForm);
    setEditId(null);
    setFormMode('create');
  }

  function openEdit(ev) {
    setForm({ title: ev.title, description: ev.description, startDate: ev.startDate, endDate: ev.endDate, status: ev.status });
    setEditId(ev.id);
    setFormMode('edit');
  }

  function closeForm() {
    setFormMode(null);
    setForm(emptyForm);
    setEditId(null);
  }

  function handleSave() {
    if (!form.title.trim()) return;
    if (formMode === 'create') {
      const newEv = {
        id: `EV${String(events.length + 1).padStart(3, '0')}`,
        ...form,
        showCount: 0,
        bannerUrl: '',
      };
      setEvents((prev) => [...prev, newEv]);
    } else {
      setEvents((prev) => prev.map((e) => e.id === editId ? { ...e, ...form } : e));
    }
    closeForm();
  }

  return (
    <>
      <div className="filter-bar">
        <div className="filter-group">
          <span className="filter-label">상태</span>
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              className={`chip${statusFilter === s ? ' active' : ''}`}
              onClick={() => setStatusFilter(s)}
            >
              {s === 'all' ? '전체' : STATUS_LABELS[s]}
            </button>
          ))}
        </div>
        <div className="filter-right">
          <button className="btn btn-primary btn-sm" onClick={openCreate}>+ 기획전 추가</button>
        </div>
      </div>

      {formMode && (
        <div className="form-panel">
          <div className="form-panel-title">{formMode === 'create' ? '새 기획전' : '기획전 수정'}</div>
          <div className="form-panel-body">
            <div className="form-row">
              <label className="form-label">제목 <span className="required">*</span></label>
              <input
                className="inp inp-full"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="기획전 제목"
              />
            </div>
            <div className="form-row">
              <label className="form-label">설명</label>
              <textarea
                className="inp inp-full"
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="기획전 설명"
              />
            </div>
            <div className="form-row cols">
              <div className="form-col">
                <label className="form-label">시작일시</label>
                <input
                  className="inp inp-full"
                  type="datetime-local"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                />
              </div>
              <div className="form-col">
                <label className="form-label">종료일시</label>
                <input
                  className="inp inp-full"
                  type="datetime-local"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                />
              </div>
              <div className="form-col" style={{ maxWidth: 140 }}>
                <label className="form-label">상태</label>
                <select
                  className="inp"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="scheduled">예정</option>
                  <option value="live">진행중</option>
                  <option value="done">종료</option>
                </select>
              </div>
            </div>
          </div>
          <div className="form-panel-footer">
            <button className="btn btn-secondary" onClick={closeForm}>취소</button>
            <button className="btn btn-primary" onClick={handleSave}>저장</button>
          </div>
        </div>
      )}

      <div className="sec-header">
        <span className="sec-count">{filtered.length}개 기획전</span>
      </div>

      <table className="tbl">
        <thead>
          <tr>
            <th>ID</th>
            <th>제목</th>
            <th>설명</th>
            <th>시작일시</th>
            <th>종료일시</th>
            <th className="c">상태</th>
            <th className="r">방송수</th>
            <th className="c">액션</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 && (
            <tr><td colSpan={8} className="tbl-empty">조회된 기획전이 없습니다.</td></tr>
          )}
          {filtered.map((ev) => (
            <tr key={ev.id}>
              <td className="mono">{ev.id}</td>
              <td><strong>{ev.title}</strong></td>
              <td className="muted">{ev.description}</td>
              <td className="date">{formatDate(ev.startDate)}</td>
              <td className="date">{formatDate(ev.endDate)}</td>
              <td className="c">
                <span className={`badge ${STATUS_BADGE_CLASS[ev.status]}`}>{STATUS_LABELS[ev.status]}</span>
              </td>
              <td className="r">{ev.showCount}</td>
              <td className="c">
                <div className="actions" style={{ justifyContent: 'center' }}>
                  <button className="btn btn-sm btn-secondary" onClick={() => openEdit(ev)}>수정</button>
                  <button className="btn btn-sm btn-red" onClick={() => setConfirmDelete(ev)}>삭제</button>
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
