import { useState, useEffect, useRef } from 'react';
import { LIVE_CATEGORIES, BRAND_TAGS, SALE_TYPES } from '../data/sampleData';

/* ── helpers ── */
function uid() { return Math.random().toString(36).slice(2, 8).toUpperCase(); }
function deepClone(x) { return JSON.parse(JSON.stringify(x)); }

/* ── init helpers: add active flag to seed data ── */
function initCats() {
  return LIVE_CATEGORIES.map((c) => ({
    ...c,
    active: true,
    subs: c.subs.map((s) => ({ ...s, active: true })),
  }));
}
function initTags() {
  return BRAND_TAGS.map((t) => ({ ...t, active: true }));
}
function initTypes() {
  return SALE_TYPES.map((t) => ({ ...t, active: true }));
}

/* ── shared styles ── */
const arrowBtn = {
  background: 'none', border: 'none', cursor: 'pointer',
  fontSize: 9, color: '#aaa', padding: '1px 2px', lineHeight: 1,
  display: 'block',
};
const orderBadge = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  width: 24, height: 24, borderRadius: 6,
  background: '#1e1e1e', color: '#fff',
  fontSize: 11, fontWeight: 700, flexShrink: 0,
};

/* ── sub-tab bar ── */
const subTabBarStyle = {
  display: 'flex', gap: 0, borderBottom: '2px solid var(--border)',
  marginBottom: 20,
};
function SubTab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'none', border: 'none', cursor: 'pointer',
        padding: '8px 20px', fontSize: 13, fontWeight: 600,
        color: active ? 'var(--burgundy)' : 'var(--muted)',
        borderBottom: active ? '2px solid var(--burgundy)' : '2px solid transparent',
        marginBottom: -2, transition: 'color .15s',
        fontFamily: 'inherit',
      }}
    >
      {label}
    </button>
  );
}

/* ── Toast ── */
function Toast({ msg, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2800);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div style={{
      position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)',
      background: '#1e1e1e', color: '#fff',
      borderRadius: 8, padding: '10px 22px',
      fontSize: 13, fontWeight: 600,
      boxShadow: '0 4px 20px rgba(0,0,0,.25)',
      zIndex: 9999, pointerEvents: 'none',
      animation: 'fadeInUp .2s ease',
    }}>
      {msg}
    </div>
  );
}

/* ── Save / Cancel sticky bar ── */
function SaveBar({ onSave, onCancel }) {
  return (
    <div style={{
      position: 'sticky', bottom: 0,
      background: '#fff', borderTop: '1px solid var(--border)',
      padding: '12px 0', marginTop: 24,
      display: 'flex', justifyContent: 'flex-end', gap: 10,
      zIndex: 10,
    }}>
      <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
      <button className="btn btn-primary" onClick={onSave}>Save Changes</button>
    </div>
  );
}

/* ── Section divider ── */
function SectionDivider({ label }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0 12px',
    }}>
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: 1 }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
    </div>
  );
}

/* ── Modal ── */
function Modal({ title, children, footer, onClose }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">{title}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">{children}</div>
        <div className="modal-footer">{footer}</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   LIVE CATEGORY TAB
═══════════════════════════════════════ */
function LiveCategoryTab({ onDirtyChange }) {
  const [saved, setSaved] = useState(() => initCats());
  const [cats, setCats] = useState(() => deepClone(saved));
  const [dirty, setDirty] = useState(false);
  const [newParent, setNewParent] = useState('');
  const [subInputs, setSubInputs] = useState({});
  const [collapsed, setCollapsed] = useState({});
  const [editState, setEditState] = useState(null); // { id, parentId?, value }
  const [deactivateModal, setDeactivateModal] = useState(null); // { type:'parent'|'sub', catId?, item }
  const [toast, setToast] = useState(null);

  useEffect(() => { onDirtyChange(dirty); }, [dirty, onDirtyChange]);

  function mark(fn) { setCats((p) => { const next = fn(p); setDirty(true); return next; }); }

  /* ── save / cancel ── */
  function handleSave() {
    setSaved(deepClone(cats));
    setDirty(false);
    setToast('Changes saved');
  }
  function handleCancel() {
    setCats(deepClone(saved));
    setDirty(false);
    setEditState(null);
  }

  /* ── add parent ── */
  function addParent() {
    const name = newParent.trim();
    if (!name) return;
    mark((p) => [...p, { id: uid(), name, contents: 0, subs: [], active: true, _new: true }]);
    setNewParent('');
  }

  /* ── reorder (active only) ── */
  function moveParent(id, dir) {
    mark((p) => {
      const active = p.filter((c) => c.active);
      const idx = active.findIndex((c) => c.id === id);
      const swap = idx + dir;
      if (swap < 0 || swap >= active.length) return p;
      // find real indices
      const allA = [...p];
      const rIdx = allA.indexOf(active[idx]);
      const rSwap = allA.indexOf(active[swap]);
      [allA[rIdx], allA[rSwap]] = [allA[rSwap], allA[rIdx]];
      return allA;
    });
  }
  function moveSub(catId, subId, dir) {
    mark((p) => p.map((c) => {
      if (c.id !== catId) return c;
      const active = c.subs.filter((s) => s.active);
      const idx = active.findIndex((s) => s.id === subId);
      const swap = idx + dir;
      if (swap < 0 || swap >= active.length) return c;
      const all = [...c.subs];
      const rIdx = all.indexOf(active[idx]);
      const rSwap = all.indexOf(active[swap]);
      [all[rIdx], all[rSwap]] = [all[rSwap], all[rIdx]];
      return { ...c, subs: all };
    }));
  }

  /* ── deactivate ── */
  function requestDeactivateParent(cat) { setDeactivateModal({ type: 'parent', item: cat }); }
  function requestDeactivateSub(catId, sub) { setDeactivateModal({ type: 'sub', catId, item: sub }); }
  function confirmDeactivate() {
    if (!deactivateModal) return;
    if (deactivateModal.type === 'parent') {
      mark((p) => p.map((c) =>
        c.id === deactivateModal.item.id
          ? { ...c, active: false, subs: c.subs.map((s) => ({ ...s, active: false })) }
          : c
      ));
    } else {
      mark((p) => p.map((c) =>
        c.id === deactivateModal.catId
          ? { ...c, subs: c.subs.map((s) => s.id === deactivateModal.item.id ? { ...s, active: false } : s) }
          : c
      ));
    }
    setDeactivateModal(null);
  }

  /* ── reactivate ── */
  function reactivateParent(catId) {
    mark((p) => p.map((c) => c.id === catId ? { ...c, active: true } : c));
  }
  function reactivateSub(catId, subId) {
    mark((p) => p.map((c) =>
      c.id === catId
        ? { ...c, subs: c.subs.map((s) => s.id === subId ? { ...s, active: true } : s) }
        : c
    ));
  }

  /* ── add sub ── */
  function addSub(catId) {
    const name = (subInputs[catId] || '').trim();
    if (!name) return;
    mark((p) => p.map((c) =>
      c.id === catId
        ? { ...c, subs: [...c.subs, { id: uid(), name, contents: 0, active: true, _new: true }] }
        : c
    ));
    setSubInputs((p) => ({ ...p, [catId]: '' }));
  }

  /* ── inline edit ── */
  function startEditParent(cat) { setEditState({ id: cat.id, value: cat.name }); }
  function startEditSub(catId, sub) { setEditState({ id: sub.id, parentId: catId, value: sub.name }); }
  function saveEdit() {
    if (!editState) return;
    const { id, parentId, value } = editState;
    const v = value.trim();
    if (v) {
      if (parentId) {
        mark((p) => p.map((c) =>
          c.id === parentId
            ? { ...c, subs: c.subs.map((s) => s.id === id ? { ...s, name: v } : s) }
            : c
        ));
      } else {
        mark((p) => p.map((c) => c.id === id ? { ...c, name: v } : c));
      }
    }
    setEditState(null);
  }
  function cancelEdit() { setEditState(null); }

  const activeCats = cats.filter((c) => c.active);
  const inactiveCats = cats.filter((c) => !c.active);

  function CatRow({ cat, idx, total, isInactive }) {
    const isCollapsed = collapsed[cat.id];
    const activeSubs = cat.subs.filter((s) => s.active);
    const inactiveSubs = cat.subs.filter((s) => !s.active);
    const isEditing = editState?.id === cat.id && !editState.parentId;
    const isNew = cat._new;

    return (
      <div key={cat.id} style={{ marginBottom: 8 }}>
        <div style={{
          background: isNew ? '#fafaf5' : 'var(--surface)',
          border: `1px solid ${isNew ? '#d4b896' : isInactive ? '#e5e7eb' : 'var(--border)'}`,
          borderRadius: 8, padding: '12px 14px',
          display: 'flex', alignItems: 'center', gap: 10,
          opacity: isInactive ? 0.7 : 1,
        }}>
          {!isInactive && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <button onClick={() => moveParent(cat.id, -1)} style={arrowBtn} disabled={idx === 0}>▲</button>
                <button onClick={() => moveParent(cat.id, 1)} style={arrowBtn} disabled={idx === total - 1}>▼</button>
              </div>
              <span style={orderBadge}>{idx + 1}</span>
            </>
          )}
          {isInactive && <span style={{ ...orderBadge, background: '#9ca3af' }}>–</span>}

          {isEditing ? (
            <>
              <input
                className="inp"
                autoFocus
                style={{ flex: 1, height: 28, fontSize: 13, fontWeight: 700 }}
                value={editState.value}
                onChange={(e) => setEditState((p) => ({ ...p, value: e.target.value }))}
                onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') cancelEdit(); }}
              />
              <button className="btn btn-sm btn-primary" style={{ padding: '3px 10px' }} onClick={saveEdit}>✓</button>
              <button className="btn btn-sm btn-secondary" style={{ padding: '3px 10px' }} onClick={cancelEdit}>✕</button>
            </>
          ) : (
            <>
              <span style={{ flex: 1, fontWeight: 700, fontSize: 14, color: isInactive ? '#9ca3af' : undefined }}>
                {cat.name}
                {isNew && <span style={{ fontSize: 10, color: '#b45309', marginLeft: 6, background: '#fef3c7', borderRadius: 4, padding: '1px 5px' }}>new</span>}
              </span>
              <span style={{ color: '#7c6fff', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>
                {cat.contents} contents
              </span>
              <span style={{ fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                {cat.subs.length} sub{cat.subs.length !== 1 ? 's' : ''}
              </span>
              <button
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--muted)', padding: '0 2px' }}
                onClick={() => setCollapsed((p) => ({ ...p, [cat.id]: !p[cat.id] }))}
              >
                {isCollapsed ? '▶' : '▼'}
              </button>
              {!isInactive && (
                <button className="btn btn-sm btn-secondary" onClick={() => startEditParent(cat)}>Edit</button>
              )}
              {isInactive ? (
                <button className="btn btn-sm btn-secondary" onClick={() => reactivateParent(cat.id)}
                  style={{ color: '#059669', borderColor: '#059669' }}>
                  Reactivate
                </button>
              ) : (
                <button className="btn btn-sm" style={{ color: '#dc2626', border: '1px solid #dc2626', background: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, padding: '3px 10px', cursor: 'pointer' }}
                  onClick={() => requestDeactivateParent(cat)}>
                  Deactivate
                </button>
              )}
            </>
          )}
        </div>

        {/* Subcategories */}
        {!isCollapsed && (
          <div style={{ paddingLeft: 32, marginTop: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* Active subs */}
            {activeSubs.map((sub, si) => (
              <SubRow key={sub.id} sub={sub} catId={cat.id} idx={si} total={activeSubs.length}
                isInactive={false} parentInactive={isInactive} />
            ))}
            {/* Inactive subs */}
            {inactiveSubs.length > 0 && (
              <>
                <div style={{ fontSize: 11, color: 'var(--muted)', margin: '6px 0 2px', fontWeight: 600, letterSpacing: 0.5 }}>
                  INACTIVE SUBCATEGORIES
                </div>
                {inactiveSubs.map((sub) => (
                  <SubRow key={sub.id} sub={sub} catId={cat.id} idx={0} total={1}
                    isInactive={true} parentInactive={isInactive} />
                ))}
              </>
            )}

            {/* Add sub input (only if parent active) */}
            {!isInactive && (
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <input
                  className="inp inp-full"
                  style={{ height: 34, fontSize: 12 }}
                  placeholder={`Add subcategory to ${cat.name}…`}
                  value={subInputs[cat.id] || ''}
                  onChange={(e) => setSubInputs((p) => ({ ...p, [cat.id]: e.target.value }))}
                  onKeyDown={(e) => e.key === 'Enter' && addSub(cat.id)}
                />
                <button className="btn btn-sm btn-primary" style={{ height: 34, padding: '0 14px' }}
                  onClick={() => addSub(cat.id)}>
                  + Add
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  function SubRow({ sub, catId, idx, total, isInactive, parentInactive }) {
    const isEditing = editState?.id === sub.id && editState.parentId === catId;
    const isNew = sub._new;
    const activeSubs = cats.find((c) => c.id === catId)?.subs.filter((s) => s.active) || [];
    const activeIdx = activeSubs.findIndex((s) => s.id === sub.id);
    const activeTotal = activeSubs.length;

    return (
      <div style={{
        background: isNew ? '#fafaf5' : 'var(--surface)',
        border: `1px solid ${isNew ? '#d4b896' : isInactive ? '#e5e7eb' : 'var(--border)'}`,
        borderRadius: 8, padding: '10px 14px',
        display: 'flex', alignItems: 'center', gap: 10,
        opacity: isInactive ? 0.65 : 1,
      }}>
        {!isInactive && !parentInactive && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <button onClick={() => moveSub(catId, sub.id, -1)} style={arrowBtn} disabled={activeIdx === 0}>▲</button>
              <button onClick={() => moveSub(catId, sub.id, 1)} style={arrowBtn} disabled={activeIdx === activeTotal - 1}>▼</button>
            </div>
            <span style={{ ...orderBadge, background: '#e8e6ff', color: '#7c6fff', width: 22, height: 22, fontSize: 10 }}>
              {activeIdx + 1}
            </span>
          </>
        )}
        {(isInactive || parentInactive) && (
          <span style={{ ...orderBadge, background: '#e5e7eb', color: '#9ca3af', width: 22, height: 22, fontSize: 10 }}>–</span>
        )}

        {isEditing ? (
          <>
            <input
              className="inp"
              autoFocus
              style={{ flex: 1, height: 26, fontSize: 13 }}
              value={editState.value}
              onChange={(e) => setEditState((p) => ({ ...p, value: e.target.value }))}
              onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') cancelEdit(); }}
            />
            <button className="btn btn-sm btn-primary" style={{ padding: '2px 8px' }} onClick={saveEdit}>✓</button>
            <button className="btn btn-sm btn-secondary" style={{ padding: '2px 8px' }} onClick={cancelEdit}>✕</button>
          </>
        ) : (
          <>
            <span style={{ flex: 1, fontSize: 13, color: isInactive ? '#9ca3af' : undefined }}>
              {sub.name}
              {isNew && <span style={{ fontSize: 10, color: '#b45309', marginLeft: 6, background: '#fef3c7', borderRadius: 4, padding: '1px 5px' }}>new</span>}
            </span>
            <span style={{ color: '#7c6fff', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>{sub.contents} contents</span>
            {!isInactive && !parentInactive && (
              <button className="btn btn-sm btn-secondary" onClick={() => startEditSub(catId, sub)}>Edit</button>
            )}
            {isInactive ? (
              !parentInactive && (
                <button className="btn btn-sm btn-secondary" onClick={() => reactivateSub(catId, sub.id)}
                  style={{ color: '#059669', borderColor: '#059669' }}>
                  Reactivate
                </button>
              )
            ) : (
              !parentInactive && (
                <button className="btn btn-sm" style={{ color: '#dc2626', border: '1px solid #dc2626', background: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, padding: '2px 8px', cursor: 'pointer' }}
                  onClick={() => requestDeactivateSub(catId, sub)}>
                  Deactivate
                </button>
              )
            )}
          </>
        )}
      </div>
    );
  }

  return (
    <>
      {/* Add parent input */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        <input
          className="inp inp-full"
          style={{ height: 40, fontSize: 13 }}
          placeholder="New parent category name…"
          value={newParent}
          onChange={(e) => setNewParent(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addParent()}
        />
        <button className="btn btn-primary" style={{ height: 40, padding: '0 20px', whiteSpace: 'nowrap' }}
          onClick={addParent}>
          + Add Category
        </button>
      </div>

      <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 14 }}>
        {activeCats.length} active · {inactiveCats.length} inactive
      </div>

      {/* Active */}
      {activeCats.map((cat, idx) => (
        <CatRow key={cat.id} cat={cat} idx={idx} total={activeCats.length} isInactive={false} />
      ))}

      {/* Inactive section */}
      {inactiveCats.length > 0 && (
        <>
          <SectionDivider label={`Inactive (${inactiveCats.length})`} />
          {inactiveCats.map((cat) => (
            <CatRow key={cat.id} cat={cat} idx={0} total={1} isInactive={true} />
          ))}
        </>
      )}

      {/* Deactivate modal */}
      {deactivateModal && (
        <Modal
          title={deactivateModal.type === 'parent' ? 'Deactivate Category' : 'Deactivate Subcategory'}
          onClose={() => setDeactivateModal(null)}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setDeactivateModal(null)}>Cancel</button>
              <button className="btn btn-red" onClick={confirmDeactivate}>Deactivate</button>
            </>
          }
        >
          <p className="modal-msg">
            Deactivate <strong>"{deactivateModal.item.name}"</strong>?
          </p>
          {deactivateModal.type === 'parent' && (
            <div className="modal-detail">
              All subcategories under this category will also be deactivated. They can be reactivated individually afterwards.
            </div>
          )}
        </Modal>
      )}

      {dirty && <SaveBar onSave={handleSave} onCancel={handleCancel} />}
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
    </>
  );
}

/* ═══════════════════════════════════════
   BRAND TAGS TAB
═══════════════════════════════════════ */
function BrandTagsTab({ onDirtyChange }) {
  const [saved, setSaved] = useState(() => initTags());
  const [tags, setTags] = useState(() => deepClone(saved));
  const [dirty, setDirty] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(new Set());
  const [deactivateModal, setDeactivateModal] = useState(null); // { ids: Set, label: string }
  const [toast, setToast] = useState(null);

  useEffect(() => { onDirtyChange(dirty); }, [dirty, onDirtyChange]);

  function mark(fn) { setTags((p) => { const next = fn(p); setDirty(true); return next; }); }

  function handleSave() { setSaved(deepClone(tags)); setDirty(false); setToast('Changes saved'); }
  function handleCancel() { setTags(deepClone(saved)); setDirty(false); }

  function addTag() {
    const name = newTag.trim();
    if (!name || tags.find((t) => t.name.toLowerCase() === name.toLowerCase())) return;
    mark((p) => [...p, { id: uid(), name, contents: 0, active: true, _new: true }]);
    setNewTag('');
  }

  /* ── filtered active tags for display ── */
  const activeTags = tags.filter((t) => t.active)
    .filter((t) => !search || t.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  const inactiveTags = tags.filter((t) => !t.active)
    .sort((a, b) => a.name.localeCompare(b.name));

  /* group by letter */
  function groupByLetter(list) {
    const g = {};
    list.forEach((t) => {
      const l = t.name[0].toUpperCase();
      if (!g[l]) g[l] = [];
      g[l].push(t);
    });
    return g;
  }
  const grouped = groupByLetter(activeTags);

  /* checkbox logic */
  const allActiveIds = activeTags.map((t) => t.id);
  const allSelected = allActiveIds.length > 0 && allActiveIds.every((id) => selected.has(id));
  const someSelected = allActiveIds.some((id) => selected.has(id));

  function toggleSelectAll() {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(allActiveIds));
  }
  function toggleSelect(id) {
    setSelected((p) => { const s = new Set(p); if (s.has(id)) s.delete(id); else s.add(id); return s; });
  }

  /* deactivate */
  function requestDeactivate(ids) {
    const names = tags.filter((t) => ids.has(t.id)).map((t) => t.name);
    const label = ids.size === 1 ? `"${names[0]}"` : `${ids.size} tags`;
    setDeactivateModal({ ids, label });
  }
  function confirmDeactivate() {
    const ids = deactivateModal.ids;
    mark((p) => p.map((t) => ids.has(t.id) ? { ...t, active: false } : t));
    setSelected((prev) => { const s = new Set(prev); ids.forEach((id) => s.delete(id)); return s; });
    setDeactivateModal(null);
  }
  function reactivateTag(id) {
    mark((p) => p.map((t) => t.id === id ? { ...t, active: true } : t));
  }

  const selectedActiveCount = allActiveIds.filter((id) => selected.has(id)).length;

  return (
    <>
      {/* Add tag input */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        <input
          className="inp inp-full"
          style={{ height: 40, fontSize: 13 }}
          placeholder="New brand tag name…"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTag()}
        />
        <button className="btn btn-primary" style={{ height: 40, padding: '0 20px', whiteSpace: 'nowrap' }}
          onClick={addTag}>
          + Add Tag
        </button>
      </div>

      {/* Search (only filters active) */}
      <div style={{ position: 'relative', marginBottom: 14 }}>
        <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', pointerEvents: 'none' }}>🔍</span>
        <input
          className="inp inp-full"
          style={{ height: 40, fontSize: 13, paddingLeft: 34 }}
          placeholder="Search active tags…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Bulk actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 12, color: 'var(--muted)' }}>
          <input
            type="checkbox"
            checked={allSelected}
            ref={(el) => { if (el) el.indeterminate = someSelected && !allSelected; }}
            onChange={toggleSelectAll}
          />
          Select all
        </label>
        {selectedActiveCount > 0 && (
          <button
            className="btn btn-sm"
            style={{ color: '#dc2626', border: '1px solid #dc2626', background: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, padding: '3px 10px', cursor: 'pointer' }}
            onClick={() => requestDeactivate(new Set(allActiveIds.filter((id) => selected.has(id))))}
          >
            Deactivate selected ({selectedActiveCount})
          </button>
        )}
        <span style={{ fontSize: 12, color: 'var(--muted)', marginLeft: 'auto' }}>
          <strong>{activeTags.length}</strong> active tags shown
        </span>
      </div>

      {/* Active grouped */}
      {Object.keys(grouped).sort().map((letter) => (
        <div key={letter} style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginBottom: 6, paddingLeft: 2 }}>{letter}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {grouped[letter].map((tag) => (
              <div key={tag.id} style={{
                background: tag._new ? '#fafaf5' : 'var(--surface)',
                border: `1px solid ${tag._new ? '#d4b896' : 'var(--border)'}`,
                borderRadius: 8, padding: '10px 14px',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <input type="checkbox" checked={selected.has(tag.id)} onChange={() => toggleSelect(tag.id)}
                  style={{ cursor: 'pointer' }} />
                <span style={{ fontWeight: 700, fontSize: 13, flex: 1 }}>
                  {tag.name}
                  {tag._new && <span style={{ fontSize: 10, color: '#b45309', marginLeft: 6, background: '#fef3c7', borderRadius: 4, padding: '1px 5px' }}>new</span>}
                </span>
                <span style={{ fontSize: 12, color: 'var(--muted)' }}>Contents</span>
                <span style={{ background: '#e8e6ff', color: '#7c6fff', borderRadius: 12, padding: '2px 8px', fontSize: 12, fontWeight: 700 }}>
                  {tag.contents}
                </span>
                <button
                  className="btn btn-sm"
                  style={{ color: '#dc2626', border: '1px solid #dc2626', background: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, padding: '3px 10px', cursor: 'pointer' }}
                  onClick={() => requestDeactivate(new Set([tag.id]))}
                >
                  Deactivate
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {activeTags.length === 0 && !search && (
        <div style={{ color: 'var(--muted)', fontSize: 13, textAlign: 'center', padding: '24px 0' }}>No active tags.</div>
      )}
      {activeTags.length === 0 && search && (
        <div style={{ color: 'var(--muted)', fontSize: 13, textAlign: 'center', padding: '24px 0' }}>No active tags match "{search}".</div>
      )}

      {/* Inactive section */}
      {inactiveTags.length > 0 && (
        <>
          <SectionDivider label={`Inactive (${inactiveTags.length})`} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {inactiveTags.map((tag) => (
              <div key={tag.id} style={{
                background: 'var(--surface)', border: '1px solid #e5e7eb',
                borderRadius: 8, padding: '10px 14px',
                display: 'flex', alignItems: 'center', gap: 10, opacity: 0.65,
              }}>
                <span style={{ fontWeight: 700, fontSize: 13, flex: 1, color: '#9ca3af' }}>{tag.name}</span>
                <span style={{ fontSize: 12, color: 'var(--muted)' }}>Contents</span>
                <span style={{ background: '#f3f4f6', color: '#9ca3af', borderRadius: 12, padding: '2px 8px', fontSize: 12, fontWeight: 700 }}>
                  {tag.contents}
                </span>
                <button className="btn btn-sm btn-secondary"
                  style={{ color: '#059669', borderColor: '#059669' }}
                  onClick={() => reactivateTag(tag.id)}>
                  Reactivate
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Deactivate modal */}
      {deactivateModal && (
        <Modal
          title="Deactivate Brand Tag"
          onClose={() => setDeactivateModal(null)}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setDeactivateModal(null)}>Cancel</button>
              <button className="btn btn-red" onClick={confirmDeactivate}>Deactivate</button>
            </>
          }
        >
          <p className="modal-msg">Deactivate {deactivateModal.label}?</p>
          <div className="modal-detail">
            Deactivated tags will no longer appear as options for sellers. Existing content with this tag is unaffected.
          </div>
        </Modal>
      )}

      {dirty && <SaveBar onSave={handleSave} onCancel={handleCancel} />}
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
    </>
  );
}

/* ═══════════════════════════════════════
   SALE TYPE TAB
═══════════════════════════════════════ */
function SaleTypeTab({ onDirtyChange }) {
  const [saved, setSaved] = useState(() => initTypes());
  const [types, setTypes] = useState(() => deepClone(saved));
  const [dirty, setDirty] = useState(false);
  const [newType, setNewType] = useState('');
  const [deactivateModal, setDeactivateModal] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => { onDirtyChange(dirty); }, [dirty, onDirtyChange]);

  function mark(fn) { setTypes((p) => { const next = fn(p); setDirty(true); return next; }); }

  function handleSave() { setSaved(deepClone(types)); setDirty(false); setToast('Changes saved'); }
  function handleCancel() { setTypes(deepClone(saved)); setDirty(false); }

  function addType() {
    const name = newType.trim();
    if (!name) return;
    mark((p) => [...p, { id: uid(), name, active: true, _new: true }]);
    setNewType('');
  }

  function confirmDeactivate() {
    mark((p) => p.map((t) => t.id === deactivateModal.id ? { ...t, active: false } : t));
    setDeactivateModal(null);
  }
  function reactivateType(id) {
    mark((p) => p.map((t) => t.id === id ? { ...t, active: true } : t));
  }

  const activeTypes = types.filter((t) => t.active);
  const inactiveTypes = types.filter((t) => !t.active);

  return (
    <>
      {/* Add type input */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        <input
          className="inp inp-full"
          style={{ height: 40, fontSize: 13 }}
          placeholder="New sale type name…"
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addType()}
        />
        <button className="btn btn-primary" style={{ height: 40, padding: '0 20px', whiteSpace: 'nowrap' }}
          onClick={addType}>
          + Add
        </button>
      </div>

      <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 14 }}>
        {activeTypes.length} active · {inactiveTypes.length} inactive
      </div>

      {/* Active types */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {activeTypes.map((t, idx) => (
          <div key={t.id} style={{
            background: t._new ? '#fafaf5' : 'var(--surface)',
            border: `1px solid ${t._new ? '#d4b896' : 'var(--border)'}`,
            borderRadius: 8, padding: '12px 16px',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <span style={{ ...orderBadge, background: '#f3f4f6', color: '#555' }}>{idx + 1}</span>
            <span style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>
              {t.name}
              {t._new && <span style={{ fontSize: 10, color: '#b45309', marginLeft: 6, background: '#fef3c7', borderRadius: 4, padding: '1px 5px' }}>new</span>}
            </span>
            <button
              className="btn btn-sm"
              style={{ color: '#dc2626', border: '1px solid #dc2626', background: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, padding: '3px 10px', cursor: 'pointer' }}
              onClick={() => setDeactivateModal(t)}
            >
              Deactivate
            </button>
          </div>
        ))}
      </div>

      {/* Inactive section */}
      {inactiveTypes.length > 0 && (
        <>
          <SectionDivider label={`Inactive (${inactiveTypes.length})`} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {inactiveTypes.map((t) => (
              <div key={t.id} style={{
                background: 'var(--surface)', border: '1px solid #e5e7eb',
                borderRadius: 8, padding: '12px 16px',
                display: 'flex', alignItems: 'center', gap: 12, opacity: 0.65,
              }}>
                <span style={{ ...orderBadge, background: '#e5e7eb', color: '#9ca3af' }}>–</span>
                <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: '#9ca3af' }}>{t.name}</span>
                <button className="btn btn-sm btn-secondary"
                  style={{ color: '#059669', borderColor: '#059669' }}
                  onClick={() => reactivateType(t.id)}>
                  Reactivate
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Deactivate modal */}
      {deactivateModal && (
        <Modal
          title="Deactivate Sale Type"
          onClose={() => setDeactivateModal(null)}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setDeactivateModal(null)}>Cancel</button>
              <button className="btn btn-red" onClick={confirmDeactivate}>Deactivate</button>
            </>
          }
        >
          <p className="modal-msg">Deactivate <strong>"{deactivateModal.name}"</strong>?</p>
          <div className="modal-detail">
            This sale type will no longer be available to sellers when creating shows.
          </div>
        </Modal>
      )}

      {dirty && <SaveBar onSave={handleSave} onCancel={handleCancel} />}
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
    </>
  );
}

/* ═══════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════ */
const TABS = ['Live Category', 'Brand Tags', 'Sale Type'];

export default function CategoriesPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [tabDirty, setTabDirty] = useState([false, false, false]);
  const [navGuard, setNavGuard] = useState(null); // pending tab index

  function handleDirtyChange(tabIdx) {
    return (dirty) => {
      setTabDirty((p) => { const n = [...p]; n[tabIdx] = dirty; return n; });
    };
  }

  function tryChangeTab(idx) {
    if (tabDirty[activeTab]) {
      setNavGuard(idx);
    } else {
      setActiveTab(idx);
    }
  }

  function discardAndSwitch() {
    setTabDirty((p) => { const n = [...p]; n[activeTab] = false; return n; });
    setActiveTab(navGuard);
    setNavGuard(null);
  }

  return (
    <>
      <div style={subTabBarStyle}>
        {TABS.map((label, i) => (
          <SubTab key={label} label={label} active={activeTab === i} onClick={() => tryChangeTab(i)} />
        ))}
      </div>

      {activeTab === 0 && <LiveCategoryTab onDirtyChange={handleDirtyChange(0)} />}
      {activeTab === 1 && <BrandTagsTab onDirtyChange={handleDirtyChange(1)} />}
      {activeTab === 2 && <SaleTypeTab onDirtyChange={handleDirtyChange(2)} />}

      {/* Unsaved changes guard */}
      {navGuard !== null && (
        <Modal
          title="Unsaved Changes"
          onClose={() => setNavGuard(null)}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setNavGuard(null)}>Stay on page</button>
              <button className="btn btn-red" onClick={discardAndSwitch}>Discard & Switch</button>
            </>
          }
        >
          <p className="modal-msg">You have unsaved changes on this tab.</p>
          <div className="modal-detail">
            Switching tabs will discard your changes. Save first to keep them.
          </div>
        </Modal>
      )}
    </>
  );
}
