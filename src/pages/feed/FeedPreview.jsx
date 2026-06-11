import { initials, avatarBg, fmtRange, livesForSellers } from './utils';

// Shared preview building blocks used inside the editor forms.

// ── One hero card (campaign unit) ──────────────────────────────
export function HeroCard({ unit }) {
  const sellers = unit.closetSellers || [];
  const shownSellers = sellers.slice(0, 3);
  const extra = sellers.length - shownSellers.length;
  const lives = livesForSellers(sellers).filter((s) => !(unit.excludedShows || []).includes(s.id));
  const ringBorder = `1.5px solid ${unit.bgColor || '#222'}`;

  return (
    <div style={{
      borderRadius: 14, overflow: 'hidden', position: 'relative',
      background: unit.bgColor || '#222',
      backgroundImage: unit.image ? `url(${unit.image})` : 'none',
      backgroundSize: 'cover', backgroundPosition: 'center',
      color: '#fff', padding: 14, minWidth: 230,
    }}>
      {unit.image && <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(0,0,0,.12),rgba(0,0,0,.6))' }} />}
      <div style={{ position: 'relative' }}>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 600, lineHeight: 1.1 }}>
          {unit.title || 'Untitled unit'}
        </div>
        <div style={{ fontSize: 10.5, opacity: .85, marginTop: 5 }}>{fmtRange(unit.startDate, unit.endDate)}</div>

        {sellers.length > 0 && (
          <>
            <div style={{ fontSize: 9, letterSpacing: 1, marginTop: 12, opacity: .85, fontWeight: 700 }}>🏠 CLOSET</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
              <div style={{ display: 'flex' }}>
                {shownSellers.map((h, i) => (
                  <div key={h} style={{
                    width: 32, height: 32, borderRadius: '50%', background: avatarBg(h),
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#333', fontWeight: 700, fontSize: 11,
                    marginLeft: i ? -8 : 0, border: ringBorder,
                  }}>{initials(h)}</div>
                ))}
                {extra > 0 && (
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,.28)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 700, fontSize: 10, marginLeft: -8, border: ringBorder,
                  }}>+{extra}</div>
                )}
              </div>
              <span style={{ fontSize: 11 }}>
                {sellers[0]}{sellers.length > 1 ? ` +${sellers.length - 1} more` : ''}
              </span>
            </div>
          </>
        )}

        {lives.length > 0 && (
          <div style={{ display: 'flex', gap: 6, marginTop: 10, overflowX: 'auto', paddingBottom: 2 }}>
            {lives.map((s) => (
              <div key={s.id} style={{ width: 92, flexShrink: 0 }}>
                <div style={{
                  height: 100, borderRadius: 8, background: 'rgba(255,255,255,.14)',
                  display: 'flex', alignItems: 'flex-start', padding: 6,
                }}>
                  <span style={{
                    fontSize: 8.5, fontWeight: 700, padding: '2px 5px', borderRadius: 6,
                    background: s.status === 'live' ? '#e11d48' : 'rgba(0,0,0,.5)',
                  }}>
                    {s.status === 'live' ? '● LIVE' : '◷ Soon'}
                  </span>
                </div>
                <div style={{ fontSize: 9, marginTop: 4, lineHeight: 1.25, opacity: .92 }}>
                  {s.title.length > 30 ? s.title.slice(0, 30) + '…' : s.title}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── One theme tile ─────────────────────────────────────────────
export function ThemeTile({ unit }) {
  return (
    <div style={{
      borderRadius: 10, overflow: 'hidden', position: 'relative', height: 92,
      background: unit.bgColor || '#222',
      backgroundImage: unit.image ? `url(${unit.image})` : 'none',
      backgroundSize: 'cover', backgroundPosition: 'center',
      color: '#fff', padding: 10, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
    }}>
      {unit.image && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.32)' }} />}
      {unit.badge && (
        <span style={{
          position: 'absolute', top: 8, left: 8, fontSize: 7.5, fontWeight: 800, letterSpacing: .5,
          background: 'var(--burgundy)', color: '#fff', padding: '2px 6px', borderRadius: 8,
        }}>● {unit.badge}</span>
      )}
      <span style={{ position: 'relative', fontSize: 13, fontWeight: 700, lineHeight: 1.1 }}>{unit.title}</span>
    </div>
  );
}
