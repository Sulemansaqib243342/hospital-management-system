import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import PublicLayout from './components/PublicLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Doctors from './pages/Doctors';
import Appointments from './pages/Appointments';
import Pharmacy from './pages/Pharmacy';
import Billing from './pages/Billing';
import Analytics from './pages/Analytics';

import Home from './pages/public/Home';
import About from './pages/public/About';
import Services from './pages/public/Services';
import Contact from './pages/public/Contact';

import ScrollToTop from './components/ScrollToTop';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? <Layout>{children}</Layout> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
          <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
          
          <Route path="/login" element={<Login />} />
          
          {/* Private Routes (Admin Dashboard) */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/dashboard/patients" element={<PrivateRoute><Patients /></PrivateRoute>} />
          <Route path="/dashboard/doctors" element={<PrivateRoute><Doctors /></PrivateRoute>} />
          <Route path="/dashboard/appointments" element={<PrivateRoute><Appointments /></PrivateRoute>} />
          <Route path="/dashboard/pharmacy" element={<PrivateRoute><Pharmacy /></PrivateRoute>} />
          <Route path="/dashboard/billing" element={<PrivateRoute><Billing /></PrivateRoute>} />
          <Route path="/dashboard/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
