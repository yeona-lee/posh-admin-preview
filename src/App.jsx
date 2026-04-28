import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import ShowsPage from './pages/ShowsPage';
import HostsPage from './pages/HostsPage';
import CategoriesPage from './pages/CategoriesPage';
import EventsPage from './pages/EventsPage';

function App() {
  return (
    <AdminLayout>
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
