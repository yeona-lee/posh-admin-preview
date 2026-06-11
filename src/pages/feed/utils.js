import { SALE_TYPES, BRAND_TAGS, SHOWS } from '../../data/sampleData';

const AVATAR_COLORS = ['#e0d7f5', '#d7e8f5', '#d7f5e0', '#f5e0d7', '#f5f0d7', '#e0f5f0'];

export function initials(handle) {
  return (handle || '').replace('@', '').slice(0, 2).toUpperCase();
}

export function avatarBg(seed) {
  let n = 0;
  for (const c of (seed || 'x')) n += c.charCodeAt(0);
  return AVATAR_COLORS[n % AVATAR_COLORS.length];
}

// swap item at idx with its neighbor (dir = -1 up, +1 down); returns a new array
export function move(arr, idx, dir) {
  const j = idx + dir;
  if (j < 0 || j >= arr.length) return arr;
  const next = [...arr];
  [next[idx], next[j]] = [next[j], next[idx]];
  return next;
}

export function genId(prefix) {
  return prefix + Math.random().toString(36).slice(2, 6).toUpperCase();
}

// short date like "Jun 11, 19:00"
export function fmtDate(iso) {
  if (!iso) return '–';
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false,
  });
}

// hero date line "Jun 11, 19:00  →  Jun 20, 22:00"
export function fmtRange(start, end) {
  if (!start && !end) return 'Schedule TBD';
  return `${fmtDate(start)}  →  ${fmtDate(end)}`;
}

// on-feed status derived from the exposure window vs. now
export function campaignStatus(unit) {
  const now = new Date();
  const s = unit.startDate ? new Date(unit.startDate) : null;
  const e = unit.endDate ? new Date(unit.endDate) : null;
  if (s && now < s) return { key: 'upcoming', label: '노출예정', cls: 'badge-scheduled' };
  if (e && now > e)  return { key: 'ended',    label: '노출종료', cls: 'badge-grey' };
  return { key: 'live', label: '노출중', cls: 'badge-live' };
}

// "@a @b @c 외 N명" — show up to `max`, then a count
export function closetSummary(handles, max = 3) {
  if (!handles || handles.length === 0) return '–';
  const shown = handles.slice(0, max).join(' ');
  const extra = handles.length - max;
  return extra > 0 ? `${shown} 외 ${extra}명` : shown;
}

// scheduled + live shows belonging to the given seller handles
export function livesForSellers(handles) {
  if (!handles || handles.length === 0) return [];
  return SHOWS.filter((s) => handles.includes(s.handle) && (s.status === 'scheduled' || s.status === 'live'));
}

// human summary of a theme's filter set
export function filterSummary(filters) {
  const parts = [];
  if (filters.saleType) {
    const st = SALE_TYPES.find((s) => s.id === filters.saleType);
    if (st && st.name !== 'None') parts.push(st.name);
  }
  if (filters.category) {
    parts.push(filters.subCategory ? `${filters.category} › ${filters.subCategory}` : filters.category);
  }
  if (filters.brands && filters.brands.length) {
    const names = filters.brands
      .map((id) => BRAND_TAGS.find((b) => b.id === id))
      .filter(Boolean)
      .map((b) => b.name);
    if (names.length) parts.push(names.join(', '));
  }
  return parts.length ? parts.join(' · ') : 'No filters set';
}
