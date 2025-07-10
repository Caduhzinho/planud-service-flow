import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ClientsPage from './pages/clients/ClientsPage';
import AppointmentsPage from './pages/appointments/AppointmentsPage';
import ServiceNotesPage from './pages/serviceNotes/ServiceNotesPage';
import CompanySettingsPage from './pages/company/CompanySettingsPage';
import PreferencesPage from './pages/preferences/PreferencesPage';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthLayout />}>
            <Route index element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>
          
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="clients" element={<ClientsPage />} />
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="service-notes" element={<ServiceNotesPage />} />
            <Route path="company" element={<CompanySettingsPage />} />
            <Route path="preferences" element={<PreferencesPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
