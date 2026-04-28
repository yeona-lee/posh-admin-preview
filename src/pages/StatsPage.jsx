import { useState } from 'react';
import { HOST_STATS } from '../data/sampleData';

function formatGmv(n) {
  return n.toLocaleString('ko-KR') + '원';
}

export default function StatsPage() {
  const [expandedRow, setExpandedRow] = useState(null);

  function toggle(userId) {
    setExpandedRow((prev) => (prev === userId ? null : userId));
  }

  return (
    <>
      <div className="sec-header">
        <span className="sec-count">호스트별 채널 통계</span>
      </div>

      <table className="tbl">
        <thead>
          <tr>
            <th>호스트</th>
            <th className="r">총 방송수</th>
            <th className="r">평균 시청자</th>
            <th className="r">총 GMV</th>
            <th className="r">방송당 평균 GMV</th>
            <th>주요 카테고리</th>
            <th>마지막 방송</th>
            <th className="c">상세</th>
          </tr>
        </thead>
        <tbody>
          {HOST_STATS.map((row) => (
            <>
              <tr key={row.userId}>
                <td>
                  <div className="user-cell">
                    <div className="avatar">{row.handle[1].toUpperCase()}</div>
                    <span className="user-name">{row.handle}</span>
                  </div>
                </td>
                <td className="r">{row.totalShows}</td>
                <td className="r">{row.avgViewers.toLocaleString()}</td>
                <td className="r">{formatGmv(row.totalGmv)}</td>
                <td className="r">{formatGmv(row.avgGmvPerShow)}</td>
                <td>{row.topCategory}</td>
                <td className="date">{row.lastShowDate}</td>
                <td className="c">
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => toggle(row.userId)}
                  >
                    {expandedRow === row.userId ? '접기' : '펼치기'}
                  </button>
                </td>
              </tr>
              {expandedRow === row.userId && (
                <tr key={`${row.userId}-detail`}>
                  <td colSpan={8} style={{ background: '#f5f5f5', padding: '12px 16px' }}>
                    <div className="detail-grid">
                      <div className="mini-card">
                        <div className="mini-card-title">총 방송</div>
                        <div>{row.totalShows}회</div>
                      </div>
                      <div className="mini-card">
                        <div className="mini-card-title">평균 시청자</div>
                        <div>{row.avgViewers.toLocaleString()}명</div>
                      </div>
                      <div className="mini-card">
                        <div className="mini-card-title">총 GMV</div>
                        <div>{formatGmv(row.totalGmv)}</div>
                      </div>
                      <div className="mini-card">
                        <div className="mini-card-title">방송당 평균</div>
                        <div>{formatGmv(row.avgGmvPerShow)}</div>
                      </div>
                      <div className="mini-card">
                        <div className="mini-card-title">주요 카테고리</div>
                        <div>{row.topCategory}</div>
                      </div>
                      <div className="mini-card">
                        <div className="mini-card-title">최근 방송일</div>
                        <div>{row.lastShowDate}</div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </>
  );
}
