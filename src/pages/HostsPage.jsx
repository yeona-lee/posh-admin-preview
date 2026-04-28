import { useState } from 'react';
import { HOSTS, STATUS_LABELS, STATUS_BADGE_CLASS } from '../data/sampleData';

export default function HostsPage() {
  const [search, setSearch] = useState('');
  const [hosts, setHosts] = useState(HOSTS);
  const [confirmModal, setConfirmModal] = useState(null);

  const filtered = hosts.filter((h) => {
    if (!search) return true;
    return h.name.includes(search) || h.handle.includes(search) || h.email.includes(search);
  });

  function handleSuspend(host) {
    const isSuspending = host.status === 'active';
    setConfirmModal({
      type: isSuspending ? 'danger' : 'default',
      title: isSuspending ? '계정 정지' : '정지 해제',
      message: isSuspending
        ? `${host.name}(${host.handle}) 계정을 정지하시겠습니까?`
        : `${host.name}(${host.handle}) 계정 정지를 해제하시겠습니까?`,
      detail: isSuspending ? '정지 중에는 라이브 방송이 불가합니다.' : '계정이 정상 상태로 전환됩니다.',
      onConfirm: () => {
        setHosts((prev) =>
          prev.map((h) =>
            h.id === host.id ? { ...h, status: isSuspending ? 'suspended' : 'active' } : h
          )
        );
        setConfirmModal(null);
      },
    });
  }

  return (
    <>
      <div className="filter-bar">
        <div className="filter-group filter-right">
          <input
            className="inp inp-search"
            placeholder="이름 / 핸들 / 이메일 검색"
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
            <th className="r">방송수</th>
            <th className="r">총 GMV</th>
            <th className="c">패널티</th>
            <th className="c">인증</th>
            <th className="c">상태</th>
            <th className="c">액션</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 && (
            <tr><td colSpan={9} className="tbl-empty">조회된 호스트가 없습니다.</td></tr>
          )}
          {filtered.map((host) => (
            <tr key={host.id}>
              <td>
                <div className="user-cell">
                  <div className="avatar">{host.name[0]}</div>
                  <div>
                    <div className="user-name">{host.name}</div>
                    <div className="user-handle">{host.handle}</div>
                  </div>
                </div>
              </td>
              <td className="muted">{host.email}</td>
              <td className="date">{host.joinDate}</td>
              <td className="r">{host.showCount}</td>
              <td className="r">{host.totalGmv.toLocaleString('ko-KR')}원</td>
              <td className="c">
                {host.penalties > 0
                  ? <span className="badge badge-live">{host.penalties}건</span>
                  : <span className="badge badge-done">없음</span>}
              </td>
              <td className="c">
                {host.verified
                  ? <span className="badge badge-done">인증</span>
                  : <span className="badge badge-grey">미인증</span>}
              </td>
              <td className="c">
                <span className={`badge ${STATUS_BADGE_CLASS[host.status]}`}>{STATUS_LABELS[host.status]}</span>
              </td>
              <td className="c">
                <button
                  className={`btn btn-sm ${host.status === 'active' ? 'btn-red' : 'btn-green'}`}
                  onClick={() => handleSuspend(host)}
                >
                  {host.status === 'active' ? '정지' : '해제'}
                </button>
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
    </>
  );
}
