import React, { useEffect } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { DevHelper } from './components/DevHelper';
import { Layout } from './components/layout/Layout';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { seedInitialData } from './data/mockData';
import { DonationCallback } from './pages/DonationCallback';

// Auth Pages
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';

// Member Pages
import { Dashboard } from './pages/member/Dashboard';
import { Donate } from './pages/member/Donate';
import { DonationHistory } from './pages/member/DonationHistory';
import { Events } from './pages/member/Events';
import { Profile } from './pages/member/Profile';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProfile } from './pages/admin/AdminProfile';
import { Communications } from './pages/admin/Communications';
import { Donations } from './pages/admin/Donations';
import { EventsManagement } from './pages/admin/EventsManagement';
import { Members } from './pages/admin/Members';

// Loading Spinner
import { LoadingSpinner } from './components/ui/LoadingSpinner';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Main App Component
function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />

      {/* Payment Callback Routes */}
      <Route path="/DonationCallback" element={<DonationCallback />} />
      <Route path="/donate/callback" element={<DonationCallback />} />

      {/* Protected Member Routes */}
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/donation-history" element={<DonationHistory />} />
        <Route path="/events" element={<Events />} />
      </Route>

      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute adminOnly><Layout /></ProtectedRoute>}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/members" element={<Members />} />
        <Route path="/admin/donations" element={<Donations />} />
        <Route path="/admin/events" element={<EventsManagement />} />
        <Route path="/admin/comms" element={<Communications />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
      </Route>

      {/* Default Redirect */}
      <Route path="/" element={<Navigate to={isAuthenticated ? (JSON.parse(localStorage.getItem('currentUser') || '{}')?.role === 'admin' ? '/admin' : '/dashboard') : '/login'} />} />
    </Routes>
  );
}

function App() {
  useEffect(() => {
    // Initialize localStorage with mock data if empty
    if (!localStorage.getItem('users')) {
      seedInitialData();
    }
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        {/* Add future flags to remove warnings */}
        <Router
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Toaster position="top-right" richColors />
          <AppRoutes />
          <DevHelper />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;