import { SHOWS } from '../../data/sampleData';

const AVATAR_COLORS = ['#e0d7f5', '#d7e8f5', '#d7f5e0', '#f5e0d7', '#f5f0d7', '#e0f5f0'];

export function initials(handle) {
  return (handle || '').replace('@', '').slice(0, 2).toUpperCase();
}

export function avatarBg(seed) {
  let n = 0;
  for (const c of (seed || 'x')) n += c.charCodeAt(0);
  return AVATAR_COLORS[n % AVATAR_COLORS.length];
}

export function genId(prefix) {
  return prefix + Math.random().toString(36).slice(2, 6).toUpperCase();
}

// "Jun 14, 20:00" (24h, no seconds — for tables)
export function fmtDateTime(iso) {
  if (!iso) return '–';
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false,
  });
}

// "Aug 14 · 8pm" (for hero)
export function fmtHeroDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const date = d.toLocaleString('en-US', { month: 'short', day: 'numeric' });
  const time = d.toLocaleString('en-US', { hour: 'numeric', hour12: true }).replace(' ', '').toLowerCase();
  return `${date} · ${time}`;
}

// "Aug 14, 8:00 PM" (for show card badge)
export function fmtShowTime(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true,
  });
}

// is the exposure window valid at the current moment (ignores `stopped`)
export function isInPeriod(u) {
  const now = new Date();
  const s = u.startDate ? new Date(u.startDate) : null;
  const e = u.endDate ? new Date(u.endDate) : null;
  return (!s || now >= s) && (!e || now <= e);
}

// status derived from period + stopped flag
export function unitStatus(u) {
  if (u.stopped) return { key: 'stopped', label: 'Stopped', cls: 'badge-amber' };
  const now = new Date();
  const s = u.startDate ? new Date(u.startDate) : null;
  const e = u.endDate ? new Date(u.endDate) : null;
  if (s && now < s) return { key: 'scheduled', label: 'Scheduled', cls: 'badge-scheduled' };
  if (e && now > e)  return { key: 'ended',     label: 'Ended',     cls: 'badge-grey' };
  return { key: 'live', label: 'Live', cls: 'badge-live' };
}

// scheduled + live shows for the given seller handles
export function livesForSellers(handles) {
  if (!handles || handles.length === 0) return [];
  return SHOWS.filter((s) => handles.includes(s.handle) && (s.status === 'scheduled' || s.status === 'live'));
}
