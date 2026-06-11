import { useState } from 'react';
import { HOST_STATS } from '../data/sampleData';

function formatGmv(n) {
  return '$' + Math.round(n / 1300).toLocaleString('en-US');
}

export default function StatsPage() {
  const [expandedRow, setExpandedRow] = useState(null);

  function toggle(userId) {
    setExpandedRow((prev) => (prev === userId ? null : userId));
  }

  return (
    <>
      <div className="sec-header">
        <span className="sec-count">Channel stats by host</span>
      </div>

      <table className="tbl">
        <thead>
          <tr>
            <th>Host</th>
            <th className="r">Total Shows</th>
            <th className="r">Avg Viewers</th>
            <th className="r">Total GMV</th>
            <th className="r">Avg GMV / Show</th>
            <th>Top Category</th>
            <th>Last Show</th>
            <th className="c">Details</th>
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
                    {expandedRow === row.userId ? 'Collapse' : 'Expand'}
                  </button>
                </td>
              </tr>
              {expandedRow === row.userId && (
                <tr key={`${row.userId}-detail`}>
                  <td colSpan={8} style={{ background: '#f5f5f5', padding: '12px 16px' }}>
                    <div className="detail-grid">
                      <div className="mini-card">
                        <div className="mini-card-title">Total Shows</div>
                        <div>{row.totalShows}</div>
                      </div>
                      <div className="mini-card">
                        <div className="mini-card-title">Avg Viewers</div>
                        <div>{row.avgViewers.toLocaleString()}</div>
                      </div>
                      <div className="mini-card">
                        <div className="mini-card-title">Total GMV</div>
                        <div>{formatGmv(row.totalGmv)}</div>
                      </div>
                      <div className="mini-card">
                        <div className="mini-card-title">Avg / Show</div>
                        <div>{formatGmv(row.avgGmvPerShow)}</div>
                      </div>
                      <div className="mini-card">
                        <div className="mini-card-title">Top Category</div>
                        <div>{row.topCategory}</div>
                      </div>
                      <div className="mini-card">
                        <div className="mini-card-title">Last Show Date</div>
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
