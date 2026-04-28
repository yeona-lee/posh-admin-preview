import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import ShowsPage from './pages/ShowsPage';
import HostsPage from './pages/HostsPage';
import StatsPage from './pages/StatsPage';
import CategoriesPage from './pages/CategoriesPage';
import EventsPage from './pages/EventsPage';

const TABS = [
  { path: '/shows', label: '쇼 모니터링' },
  { path: '/hosts', label: '호스트 관리' },
  { path: '/stats', label: '통계 분석' },
  { path: '/categories', label: '카테고리 관리' },
  { path: '/events', label: '기획전 관리' },
];

function App() {
  return (
    <AdminLayout tabs={TABS}>
      <Routes>
        <Route path="/" element={<Navigate to="/shows" replace />} />
        <Route path="/shows" element={<ShowsPage />} />
        <Route path="/hosts" element={<HostsPage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/events" element={<EventsPage />} />
      </Routes>
    </AdminLayout>
  );
}

export default App;
