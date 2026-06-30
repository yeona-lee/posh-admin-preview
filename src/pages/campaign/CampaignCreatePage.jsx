import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCampaigns } from './store';
import CampaignFields from './CampaignFields';

const emptyForm = {
  internalTitle: '', title: '', startDate: '', endDate: '',
  image: '', bgColor: '#3a4a3f', closetSellers: [],
};

export default function CampaignCreatePage() {
  const { create } = useCampaigns();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);

  const valid = form.internalTitle.trim() && form.title.trim() && form.startDate && form.endDate;

  function register() {
    if (!valid) return;
    create(form);
    navigate('/campaign-units');
  }

  return (
    <div className="cu-form-page">
      <div className="cu-page-head">
        <button className="link" onClick={() => navigate('/campaign-units')}>‹ Back to list</button>
        <h1 className="cu-h1">New Campaign Unit</h1>
      </div>

      <div className="cu-panel" style={{ maxWidth: 640 }}>
        <CampaignFields form={form} setForm={setForm} />
      </div>

      <div className="cu-form-actions" style={{ maxWidth: 640 }}>
        <button className="btn btn-secondary" onClick={() => navigate('/campaign-units')}>Cancel</button>
        <button className="btn btn-primary" onClick={register} disabled={!valid}>Register</button>
      </div>
    </div>
  );
}
