import { useState } from 'react';
import { SHOWS, STATUS_LABELS, STATUS_BADGE_CLASS } from '../data/sampleData';

const STATUS_ORDER = { live: 0, scheduled: 1, done: 2 };

function formatTime(iso) {
  if (!iso) return '–';
  return new Date(iso).toLocaleString('ko-KR', {
    month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
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
      <span style={{ fontSize: 9, marginLeft: 4, color: 'var(--muted)' }}>예정</span>
    </button>
  );
}

/* 채팅관리자 셀 */
function ChatModCell({ show, onUpdate }) {
  const [adding, setAdding] = useState(false);
  const [input, setInput] = useState('');

  function confirm() {
    const val = input.trim();
    if (!val) { setAdding(false); return; }
    const handle = val.startsWith('@') ? val : `@${val}`;
    onUpdate(show.id, [...show.chatModerators, handle]);
    setInput('');
    setAdding(false);
  }

  function remove(handle) {
    onUpdate(show.id, show.chatModerators.filter((m) => m !== handle));
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center', minWidth: 120 }}>
      {show.chatModerators.map((mod) => (
        <span
          key={mod}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 3,
            background: '#f3f4f6', border: '1px solid var(--border)',
            borderRadius: 10, padding: '1px 8px',
            fontSize: 11, color: '#444',
          }}
        >
          {mod}
          <button
            onClick={() => remove(mod)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', fontSize: 12, padding: 0, lineHeight: 1 }}
          >×</button>
        </span>
      ))}

      {adding ? (
        <input
          autoFocus
          className="inp"
          style={{ width: 110, height: 22, fontSize: 11, padding: '0 6px' }}
          placeholder="@handle"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') confirm(); if (e.key === 'Escape') setAdding(false); }}
          onBlur={confirm}
        />
      ) : (
        <button
          onClick={() => setAdding(true)}
          style={{
            width: 20, height: 20, borderRadius: '50%',
            background: 'var(--burgundy)', color: '#fff',
            border: 'none', cursor: 'pointer', fontSize: 14, lineHeight: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}
        >+</button>
      )}
    </div>
  );
}

export default function ShowsPage() {
  const [sortStatus, setSortStatus] = useState('all');
  const [search, setSearch]         = useState('');
  const [shows, setShows]           = useState(SHOWS);
  const [statsModal, setStatsModal] = useState(null);

  function updateModerators(showId, mods) {
    setShows((prev) => prev.map((s) => s.id === showId ? { ...s, chatModerators: mods } : s));
  }

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
      {/* ── Filter bar ── */}
      <div className="filter-bar">
        <div className="filter-group">
          <label className="filter-label">상태</label>
          <select
            className="inp"
            style={{ width: 110 }}
            value={sortStatus}
            onChange={(e) => setSortStatus(e.target.value)}
          >
            <option value="all">전체</option>
            <option value="live">진행중</option>
            <option value="scheduled">예정</option>
            <option value="done">종료</option>
          </select>
        </div>
        <div className="filter-group filter-right">
          <input
            className="inp inp-search"
            placeholder="셀러 핸들 또는 방송 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="sec-header">
        <span className="sec-count">{list.length}개 방송</span>
      </div>

      <table className="tbl">
        <thead>
          <tr>
            <th>방송ID</th>
            <th>제목</th>
            <th>셀러</th>
            <th>카테고리</th>
            <th className="c">상태</th>
            <th>시작시간</th>
            <th>종료시간</th>
            <th>채팅관리자</th>
            <th className="c">액션</th>
          </tr>
        </thead>
        <tbody>
          {list.length === 0 && (
            <tr><td colSpan={9} className="tbl-empty">조회된 방송이 없습니다.</td></tr>
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
                <span className={`badge ${STATUS_BADGE_CLASS[show.status]}`}>
                  {STATUS_LABELS[show.status]}
                </span>
              </td>
              <td className="date">{formatTime(show.startTime)}</td>
              <td className="date">{formatTime(show.endTime)}</td>
              <td>
                <ChatModCell show={show} onUpdate={updateModerators} />
              </td>
              <td>
                <div className="actions">
                  <button className="btn btn-sm btn-blue" onClick={() => setStatsModal(show)}>통계</button>
                  <PlannedBtn label="미노출" />
                  <PlannedBtn label="삭제" />
                  <PlannedBtn label="채팅관리" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ── 통계 모달 ── */}
      {statsModal && (
        <div className="overlay" onClick={() => setStatsModal(null)}>
          <div className="modal modal-wide" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">방송 통계 — {statsModal.title}</span>
              <button className="modal-close" onClick={() => setStatsModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <table className="tbl" style={{ marginBottom: 0 }}>
                <thead>
                  <tr><th>항목</th><th className="r">값</th></tr>
                </thead>
                <tbody>
                  <tr><td>방송 ID</td><td className="r mono">{statsModal.id}</td></tr>
                  <tr><td>셀러</td><td className="r" style={{ color: 'var(--burgundy)', fontWeight: 600 }}>{statsModal.handle}</td></tr>
                  <tr><td>카테고리</td><td className="r">{statsModal.category} › {statsModal.subCategory}</td></tr>
                  <tr><td>상태</td><td className="r">{STATUS_LABELS[statsModal.status]}</td></tr>
                  <tr><td>최대 동시접속</td><td className="r">{statsModal.viewerCount > 0 ? statsModal.viewerCount.toLocaleString() + '명' : '–'}</td></tr>
                  <tr><td>총 GMV</td><td className="r">{statsModal.gmv > 0 ? statsModal.gmv.toLocaleString('ko-KR') + '원' : '–'}</td></tr>
                  <tr><td>시작시간</td><td className="r">{formatTime(statsModal.startTime)}</td></tr>
                  <tr><td>종료시간</td><td className="r">{formatTime(statsModal.endTime)}</td></tr>
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setStatsModal(null)}>닫기</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
