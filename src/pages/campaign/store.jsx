import { createContext, useContext, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { CAMPAIGN_UNITS } from '../../data/sampleData';
import { genId } from './utils';
import CampaignLayout from './CampaignLayout';

const Ctx = createContext(null);
export const useCampaigns = () => useContext(Ctx);

// the operator currently signed in (last-editor stamp)
const CURRENT_USER = 'yeona';

export default function CampaignProvider() {
  const [units, setUnits] = useState(CAMPAIGN_UNITS);

  const api = {
    units,
    currentUser: CURRENT_USER,
    get: (id) => units.find((u) => u.id === id),
    create: (data) => {
      const unit = {
        id: genId('CU'),
        createdAt: new Date().toISOString().slice(0, 19),
        lastEditor: CURRENT_USER,
        stopped: false,
        excludedShows: [],
        bgColor: '#3a4a3f',
        ...data,
      };
      setUnits((prev) => [unit, ...prev]);
      return unit;
    },
    update: (id, data) =>
      setUnits((prev) => prev.map((u) => (u.id === id ? { ...u, ...data, lastEditor: CURRENT_USER } : u))),
    stop: (id) =>
      setUnits((prev) => prev.map((u) => (u.id === id ? { ...u, stopped: true, lastEditor: CURRENT_USER } : u))),
    resume: (id) =>
      setUnits((prev) => prev.map((u) => (u.id === id ? { ...u, stopped: false, lastEditor: CURRENT_USER } : u))),
    // commit a new relative order for a subset of units (the currently-live rows),
    // keeping every other unit in its existing slot
    reorderLive: (orderedIds) =>
      setUnits((prev) => {
        const byId = Object.fromEntries(prev.map((u) => [u.id, u]));
        const queue = orderedIds.map((id) => byId[id]).filter(Boolean);
        let qi = 0;
        return prev.map((u) => (orderedIds.includes(u.id) ? queue[qi++] : u));
      }),
  };

  return (
    <Ctx.Provider value={api}>
      <CampaignLayout><Outlet /></CampaignLayout>
    </Ctx.Provider>
  );
}
