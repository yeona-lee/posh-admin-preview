import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import ShowsPage from './pages/ShowsPage';
import HostsPage from './pages/HostsPage';
import CategoriesPage from './pages/CategoriesPage';
import EventsPage from './pages/EventsPage';

const TABS = [
  { path: '/shows',      label: 'Show Monitor'       },
  { path: '/hosts',      label: 'Host Management'     },
  { path: '/categories', label: 'Category Management' },
  { path: '/events',     label: 'Event Management'    },
];

function App() {
  return (
    <AdminLayout tabs={TABS}>
      <Routes>
        <Route path="/" element={<Navigate to="/shows" replace />} />
        <Route path="/shows"      element={<ShowsPage />} />
        <Route path="/hosts"      element={<HostsPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/events"     element={<EventsPage />} />
      </Routes>
    </AdminLayout>
  );
}

export default App;
