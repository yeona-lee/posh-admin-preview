import { useState } from 'react';
import { Link } from 'react-router-dom';
import { THEME_UNITS } from '../data/sampleData';
import ThemeUnits from './feed/ThemeUnits';

export default function EventsPage() {
  const [themeUnits, setThemeUnits] = useState(THEME_UNITS);

  return (
    <>
      <div className="tabs">
        <div className="tab active">
          <span className="tab-label">Browse by Theme</span>
          <span className="tab-sub">Themed lives</span>
        </div>
        <Link to="/campaign-units" className="tab" style={{ textDecoration: 'none' }}>
          <span className="tab-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            Campaign Units <span style={{ fontSize: 9 }}>↗</span>
          </span>
          <span className="tab-sub">Moved to its own page</span>
        </Link>
      </div>

      <ThemeUnits units={themeUnits} setUnits={setThemeUnits} />
    </>
  );
}
