import { useState } from 'react';
import { SHOWS, STATUS_LABELS, STATUS_BADGE_CLASS } from '../data/sampleData';

/* status sort priority: live → scheduled → done */
const STATUS_ORDER = { live: 0, scheduled: 1, done: 2 };
const SORT_TABS = [
  { key: 'all',       label: '전체' },
  { key: 'live',      label: '진행중' },
  { key: 'scheduled', label: '예정' },
  { key: 'done',      label: '종료' },
];

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

/* grayed-out "coming soon" button */
function PlannedBtn({ label }) {
  return (
    <button
      className="btn btn-sm btn-ghost"
      disabled
      title="준비 중"
      style={{ opacity: 0.55, cursor: 'not-allowed', position: 'relative' }}
    >
      {label}
      <span style={{
        fontSize: 9, fontWeight: 700, color: 'var(--muted)',
        marginLeft: 4, verticalAlign: 'middle',
      }}>예정</span>
    </button>
  );
}

export default function ShowsPage() {
  const [sortKey, setSortKey] = useState('all');
  const [search, setSearch] = useState('');
  const [statsModal, setStatsModal] = useState(null);
  const [shows] = useState(SHOWS);

  const list = shows
    .filter((s) => {
      if (sortKey !== 'all' && s.status !== sortKey) return false;
      if (search) {
        const q = search.toLowerCase();
        return s.handle.toLowerCase().includes(q) || s.title.toLowerCase().includes(q);
      }
      return true;
    })
    .sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);

  return (
    <>
      {/* ── Sort bar ── */}
      <div className="filter-bar">
        <div className="filter-group">
          <span className="filter-label">정렬</span>
          {SORT_TABS.map((tab) => (
            <button
              key={tab.key}
              className={`chip${sortKey === tab.key ? ' active' : ''}`}
              onClick={() => setSortKey(tab.key)}
            >
              {tab.label}
              {tab.key !== 'all' && (
                <span style={{ marginLeft: 5, opacity: 0.75 }}>
                  ({shows.filter((s) => s.status === tab.key).length})
                </span>
              )}
            </button>
          ))}
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
            <th className="c">액션</th>
          </tr>
        </thead>
        <tbody>
          {list.length === 0 && (
            <tr><td colSpan={8} className="tbl-empty">조회된 방송이 없습니다.</td></tr>
          )}
          {list.map((show) => (
            <tr key={show.id}>
              <td className="mono">{show.id}</td>
              <td style={{ maxWidth: 220 }}>
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
                <div style={{ lineHeight: 1.4 }}>
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
                <div className="actions">
                  <button
                    className="btn btn-sm btn-blue"
                    onClick={() => setStatsModal(show)}
                  >
                    통계
                  </button>
                  <PlannedBtn label="미노출" />
                  <PlannedBtn label="삭제" />
                  <PlannedBtn label="채팅관리" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ── Stats modal ── */}
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
