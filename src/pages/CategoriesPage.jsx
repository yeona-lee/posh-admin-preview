import { useState } from 'react';
import { LIVE_CATEGORIES, BRAND_TAGS, SALE_TYPES } from '../data/sampleData';

/* ── helpers ── */
function uid() { return Math.random().toString(36).slice(2, 8).toUpperCase(); }

/* ── sub-tab styles (inline, minimal) ── */
const subTabBar = {
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

/* ═══════════════════════════════════════
   LIVE CATEGORY
═══════════════════════════════════════ */
function LiveCategoryTab() {
  const [cats, setCats] = useState(LIVE_CATEGORIES);
  const [newParent, setNewParent] = useState('');
  const [subInputs, setSubInputs] = useState({});   // { catId: string }
  const [collapsed, setCollapsed] = useState({});    // { catId: bool }
  const [editState, setEditState] = useState(null);  // { id, parentId?, value }
  const [confirmDel, setConfirmDel] = useState(null);

  /* parent ops */
  function addParent() {
    const name = newParent.trim();
    if (!name) return;
    setCats((p) => [...p, { id: uid(), name, contents: 0, subs: [] }]);
    setNewParent('');
  }
  function moveParent(idx, dir) {
    setCats((p) => {
      const a = [...p];
      const swap = idx + dir;
      if (swap < 0 || swap >= a.length) return a;
      [a[idx], a[swap]] = [a[swap], a[idx]];
      return a;
    });
  }
  function deleteParent(cat) { setConfirmDel({ type: 'parent', target: cat }); }
  function startEditParent(cat) { setEditState({ id: cat.id, value: cat.name }); }

  /* sub ops */
  function addSub(catId) {
    const name = (subInputs[catId] || '').trim();
    if (!name) return;
    setCats((p) => p.map((c) =>
      c.id === catId
        ? { ...c, subs: [...c.subs, { id: uid(), name, contents: 0 }] }
        : c
    ));
    setSubInputs((p) => ({ ...p, [catId]: '' }));
  }
  function moveSub(catId, idx, dir) {
    setCats((p) => p.map((c) => {
      if (c.id !== catId) return c;
      const subs = [...c.subs];
      const swap = idx + dir;
      if (swap < 0 || swap >= subs.length) return c;
      [subs[idx], subs[swap]] = [subs[swap], subs[idx]];
      return { ...c, subs };
    }));
  }
  function deleteSub(catId, sub) { setConfirmDel({ type: 'sub', catId, target: sub }); }
  function startEditSub(catId, sub) { setEditState({ id: sub.id, parentId: catId, value: sub.name }); }

  function saveEdit() {
    const { id, parentId, value } = editState;
    if (!value.trim()) { setEditState(null); return; }
    if (parentId) {
      setCats((p) => p.map((c) =>
        c.id === parentId
          ? { ...c, subs: c.subs.map((s) => s.id === id ? { ...s, name: value } : s) }
          : c
      ));
    } else {
      setCats((p) => p.map((c) => c.id === id ? { ...c, name: value } : c));
    }
    setEditState(null);
  }

  function confirmDelete() {
    if (!confirmDel) return;
    if (confirmDel.type === 'parent') {
      setCats((p) => p.filter((c) => c.id !== confirmDel.target.id));
    } else {
      setCats((p) => p.map((c) =>
        c.id === confirmDel.catId
          ? { ...c, subs: c.subs.filter((s) => s.id !== confirmDel.target.id) }
          : c
      ));
    }
    setConfirmDel(null);
  }

  return (
    <>
      {/* Add parent input */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        <input
          className="inp inp-full"
          style={{ height: 40, fontSize: 13 }}
          placeholder="New parent category..."
          value={newParent}
          onChange={(e) => setNewParent(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addParent()}
        />
        <button
          className="btn btn-primary"
          style={{ height: 40, padding: '0 20px', whiteSpace: 'nowrap' }}
          onClick={addParent}
        >
          + Add
        </button>
      </div>

      <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 14 }}>
        {cats.length} parent categories
      </div>

      {cats.map((cat, idx) => {
        const isCollapsed = collapsed[cat.id];
        return (
          <div key={cat.id} style={{ marginBottom: 8 }}>
            {/* Parent row */}
            <div style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 8, padding: '12px 14px',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ color: '#ccc', fontSize: 15, cursor: 'grab' }}>⠿</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <button onClick={() => moveParent(idx, -1)} style={arrowBtn} disabled={idx === 0}>▲</button>
                <button onClick={() => moveParent(idx, 1)} style={arrowBtn} disabled={idx === cats.length - 1}>▼</button>
              </div>
              <span style={orderBadge}>{idx + 1}</span>

              {editState?.id === cat.id && !editState.parentId ? (
                <input
                  className="inp"
                  autoFocus
                  style={{ flex: 1, height: 28, fontSize: 13, fontWeight: 700 }}
                  value={editState.value}
                  onChange={(e) => setEditState((p) => ({ ...p, value: e.target.value }))}
                  onBlur={saveEdit}
                  onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                />
              ) : (
                <span style={{ flex: 1, fontWeight: 700, fontSize: 14 }}>{cat.name}</span>
              )}

              <span style={{ color: '#7c6fff', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>
                {cat.contents} contents
              </span>
              <span style={{ fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                {cat.subs.length} sub
              </span>
              <button
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--muted)', padding: '0 2px' }}
                onClick={() => setCollapsed((p) => ({ ...p, [cat.id]: !p[cat.id] }))}
              >
                {isCollapsed ? '▶' : '▼'}
              </button>
              <button className="btn btn-sm btn-secondary" onClick={() => startEditParent(cat)}>Edit</button>
              <button className="btn btn-sm btn-red" onClick={() => deleteParent(cat)}>Delete</button>
            </div>

            {/* Subcategories */}
            {!isCollapsed && (
              <div style={{ paddingLeft: 32, marginTop: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {cat.subs.map((sub, si) => (
                  <div key={sub.id} style={{
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: 8, padding: '10px 14px',
                    display: 'flex', alignItems: 'center', gap: 10,
                  }}>
                    <span style={{ color: '#ccc', fontSize: 14, cursor: 'grab' }}>⠿</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <button onClick={() => moveSub(cat.id, si, -1)} style={arrowBtn} disabled={si === 0}>▲</button>
                      <button onClick={() => moveSub(cat.id, si, 1)} style={arrowBtn} disabled={si === cat.subs.length - 1}>▼</button>
                    </div>
                    <span style={{ ...orderBadge, background: '#e8e6ff', color: '#7c6fff' }}>{si + 1}</span>

                    {editState?.id === sub.id && editState.parentId === cat.id ? (
                      <input
                        className="inp"
                        autoFocus
                        style={{ flex: 1, height: 26, fontSize: 13 }}
                        value={editState.value}
                        onChange={(e) => setEditState((p) => ({ ...p, value: e.target.value }))}
                        onBlur={saveEdit}
                        onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                      />
                    ) : (
                      <span style={{ flex: 1, fontSize: 13 }}>{sub.name}</span>
                    )}

                    <span style={{ color: '#7c6fff', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {sub.contents} contents
                    </span>
                    <button className="btn btn-sm btn-secondary" onClick={() => startEditSub(cat.id, sub)}>Edit</button>
                    <button className="btn btn-sm btn-red" onClick={() => deleteSub(cat.id, sub)}>Delete</button>
                  </div>
                ))}

                {/* Add sub input */}
                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                  <input
                    className="inp inp-full"
                    style={{ height: 36, fontSize: 12 }}
                    placeholder={`Add subcategory to ${cat.name}...`}
                    value={subInputs[cat.id] || ''}
                    onChange={(e) => setSubInputs((p) => ({ ...p, [cat.id]: e.target.value }))}
                    onKeyDown={(e) => e.key === 'Enter' && addSub(cat.id)}
                  />
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ height: 36, padding: '0 16px' }}
                    onClick={() => addSub(cat.id)}
                  >
                    + Add
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Delete confirm modal */}
      {confirmDel && (
        <div className="overlay" onClick={() => setConfirmDel(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">삭제 확인</span>
              <button className="modal-close" onClick={() => setConfirmDel(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p className="modal-msg">"{confirmDel.target.name}"을 삭제하시겠습니까?</p>
              {confirmDel.type === 'parent' && (
                <div className="modal-detail">소분류 전체가 함께 삭제됩니다.</div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setConfirmDel(null)}>취소</button>
              <button className="btn btn-red" onClick={confirmDelete}>삭제</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ═══════════════════════════════════════
   BRAND TAGS
═══════════════════════════════════════ */
function BrandTagsTab() {
  const [tags, setTags] = useState(BRAND_TAGS);
  const [newTag, setNewTag] = useState('');
  const [search, setSearch] = useState('');
  const [confirmDel, setConfirmDel] = useState(null);

  function addTag() {
    const name = newTag.trim();
    if (!name || tags.find((t) => t.name.toLowerCase() === name.toLowerCase())) return;
    setTags((p) => [...p, { id: uid(), name, contents: 0 }]);
    setNewTag('');
  }

  const filtered = tags
    .filter((t) => t.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  // Group by first letter
  const grouped = {};
  filtered.forEach((t) => {
    const letter = t.name[0].toUpperCase();
    if (!grouped[letter]) grouped[letter] = [];
    grouped[letter].push(t);
  });

  return (
    <>
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        <input
          className="inp inp-full"
          style={{ height: 40, fontSize: 13 }}
          placeholder="New brand tag name..."
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTag()}
        />
        <button
          className="btn btn-primary"
          style={{ height: 40, padding: '0 20px', whiteSpace: 'nowrap' }}
          onClick={addTag}
        >
          + Add Tag
        </button>
      </div>

      <div style={{ position: 'relative', marginBottom: 14 }}>
        <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }}>🔍</span>
        <input
          className="inp inp-full"
          style={{ height: 40, fontSize: 13, paddingLeft: 32 }}
          placeholder="Search tags..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 14 }}>
        Select all · <strong>{filtered.length}</strong> tags shown
      </div>

      {Object.keys(grouped).sort().map((letter) => (
        <div key={letter} style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginBottom: 6, paddingLeft: 2 }}>{letter}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {grouped[letter].map((tag) => (
              <div key={tag.id} style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 8, padding: '10px 14px',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#7c6fff', flexShrink: 0 }} />
                <span style={{ fontWeight: 700, fontSize: 13, flex: 1 }}>{tag.name}</span>
                <span style={{ fontSize: 12, color: 'var(--muted)' }}>Contents</span>
                <span style={{
                  background: '#e8e6ff', color: '#7c6fff',
                  borderRadius: 12, padding: '2px 8px', fontSize: 12, fontWeight: 700,
                }}>
                  {tag.contents}
                </span>
                <button
                  className="btn btn-sm btn-red"
                  onClick={() => setConfirmDel(tag)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {confirmDel && (
        <div className="overlay" onClick={() => setConfirmDel(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">브랜드 태그 삭제</span>
              <button className="modal-close" onClick={() => setConfirmDel(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p className="modal-msg">"{confirmDel.name}" 태그를 삭제하시겠습니까?</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setConfirmDel(null)}>취소</button>
              <button className="btn btn-red" onClick={() => {
                setTags((p) => p.filter((t) => t.id !== confirmDel.id));
                setConfirmDel(null);
              }}>삭제</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ═══════════════════════════════════════
   SALE TYPE
═══════════════════════════════════════ */
function SaleTypeTab() {
  const [types, setTypes] = useState(SALE_TYPES);
  const [newType, setNewType] = useState('');
  const [confirmDel, setConfirmDel] = useState(null);

  function addType() {
    const name = newType.trim();
    if (!name) return;
    setTypes((p) => [...p, { id: uid(), name }]);
    setNewType('');
  }

  return (
    <>
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        <input
          className="inp inp-full"
          style={{ height: 40, fontSize: 13 }}
          placeholder="New sale type..."
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addType()}
        />
        <button
          className="btn btn-primary"
          style={{ height: 40, padding: '0 20px', whiteSpace: 'nowrap' }}
          onClick={addType}
        >
          + Add
        </button>
      </div>

      <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 14 }}>
        {types.length} sale types
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {types.map((t, idx) => (
          <div key={t.id} style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 8, padding: '12px 16px',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <span style={{ ...orderBadge, background: '#f3f4f6', color: '#555' }}>{idx + 1}</span>
            <span style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{t.name}</span>
            <button
              className="btn btn-sm btn-red"
              onClick={() => setConfirmDel(t)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {confirmDel && (
        <div className="overlay" onClick={() => setConfirmDel(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Sale Type 삭제</span>
              <button className="modal-close" onClick={() => setConfirmDel(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p className="modal-msg">"{confirmDel.name}"을 삭제하시겠습니까?</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setConfirmDel(null)}>취소</button>
              <button className="btn btn-red" onClick={() => {
                setTypes((p) => p.filter((t) => t.id !== confirmDel.id));
                setConfirmDel(null);
              }}>삭제</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
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

/* ═══════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════ */
const TABS = ['Live Category', 'Brand Tags', 'Sale Type'];

export default function CategoriesPage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <div style={subTabBar}>
        {TABS.map((label, i) => (
          <SubTab key={label} label={label} active={activeTab === i} onClick={() => setActiveTab(i)} />
        ))}
      </div>

      {activeTab === 0 && <LiveCategoryTab />}
      {activeTab === 1 && <BrandTagsTab />}
      {activeTab === 2 && <SaleTypeTab />}
    </>
  );
}
