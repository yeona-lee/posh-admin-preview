import { useState } from 'react';
import { SHOWS, STATUS_LABELS, STATUS_BADGE_CLASS } from '../data/sampleData';

const STATUS_FILTERS = ['all', 'live', 'scheduled', 'rehearsal', 'done'];

function formatTime(iso) {
  if (!iso) return '–';
  return new Date(iso).toLocaleString('ko-KR', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
}

function formatGmv(n) {
  if (!n) return '–';
  return n.toLocaleString('ko-KR') + '원';
}

export default function ShowsPage() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [confirmModal, setConfirmModal] = useState(null);
  const [statsModal, setStatsModal] = useState(null);
  const [shows, setShows] = useState(SHOWS);

  const filtered = shows.filter((s) => {
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    if (search && !s.seller.includes(search) && !s.handle.includes(search) && !s.title.includes(search)) return false;
    return true;
  });

  function handleDelete(show) {
    setConfirmModal({
      type: 'danger',
      title: '방송 삭제',
      message: `"${show.title}" 방송을 삭제하시겠습니까?`,
      detail: '삭제된 방송은 복구할 수 없습니다.',
      onConfirm: () => {
        setShows((prev) => prev.filter((s) => s.id !== show.id));
        setConfirmModal(null);
      },
    });
  }

  function handleRehearsal(show) {
    setConfirmModal({
      type: 'default',
      title: '리허설 시작',
      message: `"${show.title}" 방송을 리허설 상태로 전환하시겠습니까?`,
      detail: '호스트에게 리허설 시작 알림이 발송됩니다.',
      onConfirm: () => {
        setShows((prev) => prev.map((s) => s.id === show.id ? { ...s, status: 'rehearsal' } : s));
        setConfirmModal(null);
      },
    });
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
        <div className="filter-group filter-right">
          <input
            className="inp inp-search"
            placeholder="셀러 또는 방송 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="sec-header">
        <span className="sec-count">{filtered.length}개 방송</span>
      </div>

      <table className="tbl">
        <thead>
          <tr>
            <th>방송ID</th>
            <th>제목</th>
            <th>셀러</th>
            <th>카테고리</th>
            <th>상태</th>
            <th>시작시간</th>
            <th className="r">시청자</th>
            <th className="r">GMV</th>
            <th className="c">액션</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 && (
            <tr><td colSpan={9} className="tbl-empty">조회된 방송이 없습니다.</td></tr>
          )}
          {filtered.map((show) => (
            <tr key={show.id}>
              <td className="mono">{show.id}</td>
              <td>{show.title}</td>
              <td>
                <div className="user-cell">
                  <div className="avatar">{show.seller[0]}</div>
                  <div>
                    <div className="user-name">{show.seller}</div>
                    <div className="user-handle">{show.handle}</div>
                  </div>
                </div>
              </td>
              <td>{show.category}</td>
              <td><span className={`badge ${STATUS_BADGE_CLASS[show.status]}`}>{STATUS_LABELS[show.status]}</span></td>
              <td className="date">{formatTime(show.startTime)}</td>
              <td className="r">{show.viewerCount > 0 ? show.viewerCount.toLocaleString() : '–'}</td>
              <td className="r">{formatGmv(show.gmv)}</td>
              <td>
                <div className="actions">
                  {(show.status === 'scheduled' || show.status === 'live') && (
                    <button className="btn btn-sm btn-amber" onClick={() => handleRehearsal(show)}>리허설</button>
                  )}
                  <button className="btn btn-sm btn-blue" onClick={() => setStatsModal(show)}>통계</button>
                  <button className="btn btn-sm btn-red" onClick={() => handleDelete(show)}>삭제</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {confirmModal && (
        <div className="overlay" onClick={() => setConfirmModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">{confirmModal.title}</span>
              <button className="modal-close" onClick={() => setConfirmModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p className="modal-msg">{confirmModal.message}</p>
              {confirmModal.detail && <div className="modal-detail">{confirmModal.detail}</div>}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setConfirmModal(null)}>취소</button>
              <button
                className={`btn ${confirmModal.type === 'danger' ? 'btn-red' : 'btn-primary'}`}
                onClick={confirmModal.onConfirm}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

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
                  <tr><td>카테고리</td><td className="r">{statsModal.category}</td></tr>
                  <tr><td>최대 동시접속</td><td className="r">{statsModal.viewerCount > 0 ? statsModal.viewerCount.toLocaleString() : '–'}</td></tr>
                  <tr><td>총 GMV</td><td className="r">{formatGmv(statsModal.gmv)}</td></tr>
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
