import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';

import LandingPage    from './pages/LandingPage';
import LoginPage      from './pages/LoginPage';
import DashboardPage  from './pages/DashboardPage';
import MembersPage    from './pages/MembersPage';
import MemberCardPage from './pages/MemberCardPage';
import PlansPage      from './pages/PlansPage';
import VerifyPage     from './pages/VerifyPage';
import HistoryPage    from './pages/HistoryPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <Routes>
            {/* Public */}
            <Route path="/"      element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Protected */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard"        element={<DashboardPage />} />
                <Route path="/members"          element={<MembersPage />} />
                <Route path="/members/:id"      element={<MemberCardPage />} />
                <Route path="/plans"            element={<PlansPage />} />
                <Route path="/verify"           element={<VerifyPage />} />
                <Route path="/history"          element={<HistoryPage />} />
              </Route>
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
