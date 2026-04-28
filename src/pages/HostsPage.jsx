import { useState, useRef, useEffect } from 'react';
import { HOSTS } from '../data/sampleData';

const SEG_STYLE = {
  Platinum: { bg: '#e8e4ff', color: '#5b21b6' },
  Gold:     { bg: '#fef3c7', color: '#b45309' },
  Silver:   { bg: '#f1f5f9', color: '#475569' },
  Bronze:   { bg: '#fde8d8', color: '#92400e' },
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

/* dropdown that closes when clicking outside */
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
        액션 <span style={{ fontSize: 9 }}>▼</span>
      </button>
      {open && (
        <div style={{
          position: 'absolute', right: 0, top: 'calc(100% + 4px)',
          background: '#fff', border: '1px solid var(--border)',
          borderRadius: 6, boxShadow: '0 4px 16px rgba(0,0,0,.12)',
          minWidth: 130, zIndex: 100, overflow: 'hidden',
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
            셀러 징계
          </button>
        </div>
      )}
    </div>
  );
}

export default function HostsPage() {
  const [search, setSearch] = useState('');
  const [hosts, setHosts] = useState(HOSTS);
  const [penaltyModal, setPenaltyModal] = useState(null);   // host object
  const [disciplineModal, setDisciplineModal] = useState(null); // host object
  const [disciplineForm, setDisciplineForm] = useState({ type: '경고', reason: '' });

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
    setDisciplineForm({ type: '경고', reason: '' });
  }

  return (
    <>
      <div className="filter-bar">
        <div className="filter-group filter-right">
          <input
            className="inp inp-search"
            placeholder="핸들 / 이메일 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="sec-header">
        <span className="sec-count">{filtered.length}명 호스트</span>
      </div>

      <table className="tbl">
        <thead>
          <tr>
            <th>호스트</th>
            <th>이메일</th>
            <th>가입일</th>
            <th className="r">총 방송수</th>
            <th className="c">SEG</th>
            <th className="c">패널티</th>
            <th className="c">액션</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 && (
            <tr><td colSpan={7} className="tbl-empty">조회된 호스트가 없습니다.</td></tr>
          )}
          {filtered.map((host) => {
            const penaltyCount = host.penaltyHistory.length;
            const seg = SEG_STYLE[host.seg] || SEG_STYLE.Bronze;
            return (
              <tr key={host.id}>
                {/* 셀러 */}
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

                {/* 이메일 */}
                <td className="muted" style={{ fontSize: 12 }}>{host.email}</td>

                {/* 가입일 */}
                <td className="date">{host.joinDate}</td>

                {/* 방송수 */}
                <td className="r">{host.showCount}회</td>

                {/* SEG */}
                <td className="c">
                  <span style={{
                    display: 'inline-block', padding: '2px 9px',
                    borderRadius: 10, fontSize: 11, fontWeight: 700,
                    background: seg.bg, color: seg.color,
                  }}>
                    {host.seg}
                  </span>
                </td>

                {/* 패널티 */}
                <td className="c">
                  {penaltyCount === 0 ? (
                    <span style={{ fontSize: 12, color: 'var(--muted)' }}>없음</span>
                  ) : (
                    <button
                      className="link"
                      style={{ color: 'var(--red)', fontWeight: 700, fontSize: 12 }}
                      onClick={() => setPenaltyModal(host)}
                    >
                      {penaltyCount}건
                    </button>
                  )}
                </td>

                {/* 액션 */}
                <td className="c">
                  <ActionDropdown host={host} onDiscipline={setDisciplineModal} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* ── 패널티 이력 모달 ── */}
      {penaltyModal && (
        <div className="overlay" onClick={() => setPenaltyModal(null)}>
          <div className="modal modal-wide" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">패널티 이력 — {penaltyModal.handle}</span>
              <button className="modal-close" onClick={() => setPenaltyModal(null)}>✕</button>
            </div>
            <div className="modal-body" style={{ padding: 0 }}>
              <table className="tbl" style={{ marginBottom: 0 }}>
                <thead>
                  <tr>
                    <th>일자</th>
                    <th>유형</th>
                    <th>사유</th>
                  </tr>
                </thead>
                <tbody>
                  {penaltyModal.penaltyHistory.map((p, i) => (
                    <tr key={i}>
                      <td className="date">{p.date}</td>
                      <td>
                        <span className={`badge ${p.type === '경고' ? 'badge-amber' : p.type === '일시정지' ? 'badge-scheduled' : 'badge-live'}`}>
                          {p.type}
                        </span>
                      </td>
                      <td>{p.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setPenaltyModal(null)}>닫기</button>
            </div>
          </div>
        </div>
      )}

      {/* ── 셀러 징계 모달 ── */}
      {disciplineModal && (
        <div className="overlay" onClick={() => setDisciplineModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">셀러 징계 — {disciplineModal.handle}</span>
              <button className="modal-close" onClick={() => setDisciplineModal(null)}>✕</button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="form-col">
                <label className="form-label">징계 유형</label>
                <select
                  className="inp"
                  value={disciplineForm.type}
                  onChange={(e) => setDisciplineForm((p) => ({ ...p, type: e.target.value }))}
                  style={{ width: '100%' }}
                >
                  <option value="경고">경고</option>
                  <option value="일시정지">일시정지</option>
                  <option value="계정정지">계정정지</option>
                </select>
              </div>
              <div className="form-col">
                <label className="form-label">징계 사유 <span className="required">*</span></label>
                <textarea
                  className="inp inp-full"
                  rows={3}
                  placeholder="징계 사유를 입력하세요"
                  value={disciplineForm.reason}
                  onChange={(e) => setDisciplineForm((p) => ({ ...p, reason: e.target.value }))}
                />
              </div>
              <div className="modal-detail" style={{ marginTop: 0 }}>
                징계 처리 시 해당 셀러에게 알림이 발송됩니다.
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDisciplineModal(null)}>취소</button>
              <button
                className="btn btn-red"
                onClick={submitDiscipline}
                disabled={!disciplineForm.reason.trim()}
              >
                징계 적용
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
