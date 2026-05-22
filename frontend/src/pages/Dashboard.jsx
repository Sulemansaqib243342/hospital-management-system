import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

const StatCard = ({ label, value, sub, color, icon }) => (
  <div className="card">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs text-gray-500 mb-2">{label}</p>
        <p className={`text-3xl font-semibold ${color}`}>{value}</p>
        <p className="text-xs text-gray-400 mt-1.5">{sub}</p>
      </div>
      <i className={`ti ${icon} text-3xl opacity-20`}></i>
    </div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/billing/stats').then(r => { setStats(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Welcome back · {new Date().toDateString()}</p>
        </div>
        <button className="btn-primary"><i className="ti ti-plus"></i> New Admission</button>
        <Link to="/" className="btn-secondary ml-2"><i className="ti ti-arrow-left"></i> Back to Site</Link>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading dashboard...</div>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <StatCard label="Total Patients" value={stats?.totalPatients || '—'} sub="Registered patients" color="text-blue-700" icon="ti-users"/>
            <StatCard label="Inpatients" value={stats?.inpatients || '—'} sub="Currently admitted" color="text-amber-500" icon="ti-bed"/>
            <StatCard label="Today's Appointments" value={stats?.todayAppointments || '—'} sub="Scheduled today" color="text-teal-600" icon="ti-calendar"/>
            <StatCard label="Monthly Revenue" value={stats?.revenue ? `$${Number(stats.revenue.TOTAL_REVENUE).toLocaleString()}` : '—'} sub="This month" color="text-green-600" icon="ti-currency-dollar"/>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="card">
              <h3 className="font-medium text-gray-800 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon:'ti-user-plus', label:'Register Patient', color:'bg-blue-50 text-blue-700', to:'/dashboard/patients' },
                  { icon:'ti-calendar-plus', label:'Book Appointment', color:'bg-teal-50 text-teal-700', to:'/dashboard/appointments' },
                  { icon:'ti-pill', label:'Pharmacy', color:'bg-green-50 text-green-700', to:'/dashboard/pharmacy' },
                  { icon:'ti-receipt', label:'Create Bill', color:'bg-amber-50 text-amber-700', to:'/dashboard/billing' },
                ].map(a => (
                  <Link key={a.label} to={a.to}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl ${a.color} cursor-pointer hover:opacity-80 transition-opacity text-center`}>
                    <i className={`ti ${a.icon} text-2xl`}></i>
                    <span className="text-xs font-medium">{a.label}</span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="card">
              <h3 className="font-medium text-gray-800 mb-4">Billing Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Total Revenue (Month)</span>
                  <span className="font-semibold text-green-600">${Number(stats?.revenue?.TOTAL_REVENUE || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Pending Payments</span>
                  <span className="font-semibold text-amber-500">${Number(stats?.revenue?.PENDING_AMOUNT || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">Total Invoices</span>
                  <span className="font-semibold text-blue-700">{stats?.revenue?.TOTAL_BILLS || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
