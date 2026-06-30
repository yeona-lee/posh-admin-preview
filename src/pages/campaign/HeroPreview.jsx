import { livesForSellers, initials, avatarBg, fmtHeroDate, fmtShowTime } from './utils';

// Mirrors how the unit appears in the Posh Live "For You" feed.
export default function HeroPreview({ unit }) {
  const sellers = unit.closetSellers || [];
  const lives = livesForSellers(sellers).filter((s) => !(unit.excludedShows || []).includes(s.id));
  const bg = unit.image
    ? `center/cover no-repeat url(${unit.image})`
    : `linear-gradient(165deg, ${unit.bgColor || '#3a4a3f'}, #11151a)`;

  return (
    <div className="hero-frame">
      <div className="hero-card" style={{ background: bg }}>
        <div className="hero-shade" />

        {/* sellers row (top-left) */}
        <div className="hero-sellers">
          <div className="hero-avatars">
            {sellers.slice(0, 3).map((h, i) => (
              <span key={h} className="hero-av" style={{ background: avatarBg(h), marginLeft: i ? -10 : 0 }}>{initials(h)}</span>
            ))}
          </div>
          {sellers.length > 0 && (
            <span className="hero-sellers-label">{sellers.length} seller{sellers.length !== 1 ? 's' : ''}</span>
          )}
        </div>

        {/* title block */}
        <div className="hero-info">
          <div className="hero-date">{fmtHeroDate(unit.startDate)}</div>
          <div className="hero-title">{unit.title || 'Untitled'}</div>
        </div>

        {/* live show row */}
        <div className="hero-livelabel">LIVE SHOW <b>{lives.length}</b></div>
        <div className="hero-cards">
          {lives.length === 0 ? (
            <div className="hero-empty">No lives in this period</div>
          ) : (
            lives.map((s) => (
              <div key={s.id} className="hero-show" style={{ background: `linear-gradient(150deg, ${avatarBg(s.handle)}, #20242a)` }}>
                {s.status === 'live'
                  ? <span className="hero-badge live">LIVE&nbsp;&nbsp;{s.viewerCount}</span>
                  : <span className="hero-badge sched">{fmtShowTime(s.startTime)}</span>}
                <span className="hero-show-title">{s.title}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
