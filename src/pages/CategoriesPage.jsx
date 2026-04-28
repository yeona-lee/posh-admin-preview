import { useState } from 'react';
import { CATEGORIES } from '../data/sampleData';

const emptyForm = { name: '', slug: '', sortOrder: '', active: true };

export default function CategoriesPage() {
  const [categories, setCategories] = useState(CATEGORIES);
  const [formMode, setFormMode] = useState(null); // 'create' | 'edit'
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  function openCreate() {
    setForm(emptyForm);
    setEditId(null);
    setFormMode('create');
  }

  function openEdit(cat) {
    setForm({ name: cat.name, slug: cat.slug, sortOrder: cat.sortOrder, active: cat.active });
    setEditId(cat.id);
    setFormMode('edit');
  }

  function closeForm() {
    setFormMode(null);
    setForm(emptyForm);
    setEditId(null);
  }

  function handleSave() {
    if (!form.name.trim() || !form.slug.trim()) return;
    if (formMode === 'create') {
      const newCat = {
        id: `C${String(categories.length + 1).padStart(3, '0')}`,
        name: form.name,
        slug: form.slug,
        sortOrder: Number(form.sortOrder) || categories.length + 1,
        active: form.active,
        showCount: 0,
      };
      setCategories((prev) => [...prev, newCat]);
    } else {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editId
            ? { ...c, name: form.name, slug: form.slug, sortOrder: Number(form.sortOrder) || c.sortOrder, active: form.active }
            : c
        )
      );
    }
    closeForm();
  }

  function handleDelete(cat) {
    setConfirmDelete(cat);
  }

  function confirmDeleteAction() {
    setCategories((prev) => prev.filter((c) => c.id !== confirmDelete.id));
    setConfirmDelete(null);
  }

  return (
    <>
      <div className="sec-header">
        <span className="sec-count">{categories.length}개 카테고리</span>
        <button className="btn btn-primary btn-sm" onClick={openCreate}>+ 카테고리 추가</button>
      </div>

      {formMode && (
        <div className="form-panel">
          <div className="form-panel-title">{formMode === 'create' ? '새 카테고리' : '카테고리 수정'}</div>
          <div className="form-panel-body">
            <div className="form-row cols">
              <div className="form-col">
                <label className="form-label">이름 <span className="required">*</span></label>
                <input
                  className="inp inp-full"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="카테고리명"
                />
              </div>
              <div className="form-col">
                <label className="form-label">슬러그 <span className="required">*</span></label>
                <input
                  className="inp inp-full"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="예: womens-clothing"
                />
              </div>
              <div className="form-col" style={{ maxWidth: 100 }}>
                <label className="form-label">순서</label>
                <input
                  className="inp inp-sm"
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
                />
              </div>
              <div className="form-col" style={{ maxWidth: 100 }}>
                <label className="form-label">활성화</label>
                <select
                  className="inp"
                  value={form.active ? 'true' : 'false'}
                  onChange={(e) => setForm({ ...form, active: e.target.value === 'true' })}
                >
                  <option value="true">활성</option>
                  <option value="false">비활성</option>
                </select>
              </div>
            </div>
          </div>
          <div className="form-panel-footer">
            <button className="btn btn-secondary" onClick={closeForm}>취소</button>
            <button className="btn btn-primary" onClick={handleSave}>저장</button>
          </div>
        </div>
      )}

      <table className="tbl">
        <thead>
          <tr>
            <th>ID</th>
            <th>이름</th>
            <th>슬러그</th>
            <th className="c">순서</th>
            <th className="c">상태</th>
            <th className="r">방송수</th>
            <th className="c">액션</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id}>
              <td className="mono">{cat.id}</td>
              <td><strong>{cat.name}</strong></td>
              <td className="mono">{cat.slug}</td>
              <td className="c">{cat.sortOrder}</td>
              <td className="c">
                <span className={`badge ${cat.active ? 'badge-done' : 'badge-grey'}`}>
                  {cat.active ? '활성' : '비활성'}
                </span>
              </td>
              <td className="r">{cat.showCount}</td>
              <td className="c">
                <div className="actions" style={{ justifyContent: 'center' }}>
                  <button className="btn btn-sm btn-secondary" onClick={() => openEdit(cat)}>수정</button>
                  <button className="btn btn-sm btn-red" onClick={() => handleDelete(cat)}>삭제</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {confirmDelete && (
        <div className="overlay" onClick={() => setConfirmDelete(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">카테고리 삭제</span>
              <button className="modal-close" onClick={() => setConfirmDelete(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p className="modal-msg">"{confirmDelete.name}" 카테고리를 삭제하시겠습니까?</p>
              <div className="modal-detail">삭제 후 복구가 불가합니다.</div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>취소</button>
              <button className="btn btn-red" onClick={confirmDeleteAction}>삭제</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
