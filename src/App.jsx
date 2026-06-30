import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import ShowsPage from './pages/ShowsPage';
import HostsPage from './pages/HostsPage';
import CategoriesPage from './pages/CategoriesPage';
import EventsPage from './pages/EventsPage';
import CampaignProvider from './pages/campaign/store';
import CampaignListPage from './pages/campaign/CampaignListPage';
import CampaignCreatePage from './pages/campaign/CampaignCreatePage';
import CampaignEditPage from './pages/campaign/CampaignEditPage';

// The Posh Live admin (shared nav + banner).
function AdminApp() {
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

function App() {
  return (
    <Routes>
      {/* Standalone Campaign Units domain — own layout/provider */}
      <Route path="/campaign-units" element={<CampaignProvider />}>
        <Route index            element={<CampaignListPage />} />
        <Route path="new"       element={<CampaignCreatePage />} />
        <Route path=":id/edit"  element={<CampaignEditPage />} />
      </Route>

      {/* Everything else = Posh Live admin */}
      <Route path="/*" element={<AdminApp />} />
    </Routes>
  );
}

export default App;
