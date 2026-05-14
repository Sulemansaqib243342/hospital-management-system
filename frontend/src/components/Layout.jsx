import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/dashboard', icon: 'ti-layout-dashboard', label: 'Dashboard', exact: true },
  { to: '/dashboard/patients', icon: 'ti-users', label: 'Patients' },
  { to: '/dashboard/doctors', icon: 'ti-stethoscope', label: 'Doctors & Staff' },
  { to: '/dashboard/appointments', icon: 'ti-calendar', label: 'Appointments' },
  { to: '/dashboard/pharmacy', icon: 'ti-pill', label: 'Pharmacy' },
  { to: '/dashboard/billing', icon: 'ti-receipt', label: 'Billing' },
  { to: '/dashboard/analytics', icon: 'ti-chart-bar', label: 'Analytics' },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
              <i className="ti ti-hospital text-white text-base"></i>
            </div>
            <div>
              <div className="font-semibold text-gray-900 text-sm">SS pharmaceuticals</div>
              <div className="text-xs text-gray-400">Healthcare Management</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          <p className="text-xs text-gray-400 uppercase tracking-wider px-3 py-2 mt-1">Overview</p>
          {navItems.slice(0,1).map(item => (
            <NavLink key={item.to} to={item.to} end
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <i className={`ti ${item.icon} text-lg`}></i> {item.label}
            </NavLink>
          ))}
          <p className="text-xs text-gray-400 uppercase tracking-wider px-3 py-2 mt-2">Clinical</p>
          {navItems.slice(1,4).map(item => (
            <NavLink key={item.to} to={item.to}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <i className={`ti ${item.icon} text-lg`}></i> {item.label}
            </NavLink>
          ))}
          <p className="text-xs text-gray-400 uppercase tracking-wider px-3 py-2 mt-2">Operations</p>
          {navItems.slice(4).map(item => (
            <NavLink key={item.to} to={item.to}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <i className={`ti ${item.icon} text-lg`}></i> {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
              {user?.full_name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-gray-800 truncate">{user?.full_name || 'Admin'}</div>
              <div className="text-xs text-gray-400 capitalize">{user?.role || 'admin'}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full text-left text-xs text-red-500 hover:text-red-700 flex items-center gap-1.5">
            <i className="ti ti-logout text-sm"></i> Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0">
        {children}
      </main>
    </div>
  );
}
