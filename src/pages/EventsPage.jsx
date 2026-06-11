import { useState } from 'react';
import { CAMPAIGN_UNITS, THEME_UNITS } from '../data/sampleData';
import CampaignUnits from './feed/CampaignUnits';
import ThemeUnits from './feed/ThemeUnits';

const TABS = [
  { key: 'campaign', label: 'Campaign Units', sub: 'Hero carousel' },
  { key: 'theme',    label: 'Browse by Theme', sub: 'Themed lives' },
];

export default function EventsPage() {
  const [tab, setTab] = useState('campaign');
  const [campaignUnits, setCampaignUnits] = useState(CAMPAIGN_UNITS);
  const [themeUnits, setThemeUnits] = useState(THEME_UNITS);

  return (
    <>
      <div className="tabs">
        {TABS.map((t) => (
          <button key={t.key} className={`tab${tab === t.key ? ' active' : ''}`} onClick={() => setTab(t.key)}>
            <span className="tab-label">{t.label}</span>
            <span className="tab-sub">{t.sub}</span>
          </button>
        ))}
      </div>

      {tab === 'campaign' && <CampaignUnits units={campaignUnits} setUnits={setCampaignUnits} />}
      {tab === 'theme'    && <ThemeUnits   units={themeUnits}    setUnits={setThemeUnits} />}
    </>
  );
}
