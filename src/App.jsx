import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { AppDataProvider } from './context/AppDataContext';
import { DashboardLayout } from './layouts/DashboardLayout';
import { OverviewPage } from './pages/OverviewPage';
import { GenerateContentPage } from './pages/GenerateContentPage';
import { WorkflowPage } from './pages/WorkflowPage';
import { ContentHistoryPage } from './pages/ContentHistoryPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { BenchmarkingPage } from './pages/BenchmarkingPage';
import { SettingsPage } from './pages/SettingsPage';
import { ForgotPasswordPage, LoginPage, RegisterPage } from './pages/AuthPages';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <AppDataProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<OverviewPage />} />
                  <Route path="generate" element={<GenerateContentPage />} />
                  <Route path="workflow" element={<WorkflowPage />} />
                  <Route path="history" element={<ContentHistoryPage />} />
                  <Route path="analytics" element={<AnalyticsPage />} />
                  <Route path="benchmarking" element={<BenchmarkingPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </AppDataProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
