import { useEffect, useState } from 'react';
import API from '../services/api';

const KpiBar = ({ label, value, pct, color }) => (
  <div className="mb-4">
    <div className="flex justify-between text-sm mb-1.5">
      <span className="text-gray-600">{label}</span>
      <span className={`font-semibold ${color}`}>{value}</span>
    </div>
    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-all duration-500`} style={{ width:`${pct}%`, background: 'currentColor' }} className={`h-full rounded-full ${color.replace('text-','bg-')}`}></div>
    </div>
  </div>
);

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get('/billing/stats'),
      API.get('/patients'),
      API.get('/staff'),
      API.get('/pharmacy/medicines'),
    ]).then(([billing, patients, staff, meds]) => {
      setStats({ billing: billing.data, patientCount: patients.data.length, staffCount: staff.data.length, medicineCount: meds.data.length });
      setLoading(false);
    }).catch(()=>setLoading(false));
  }, []);

  if (loading) return <div className="p-6 text-center text-gray-400 mt-20">Loading analytics...</div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500 mt-0.5">Hospital performance overview</p>
        </div>
        <button className="btn-secondary"><i className="ti ti-download"></i> Export Report</button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label:'Total Patients', value: stats?.patientCount||0, color:'text-blue-700', icon:'ti-users' },
          { label:'Total Staff', value: stats?.staffCount||0, color:'text-teal-600', icon:'ti-stethoscope' },
          { label:'Medicines', value: stats?.medicineCount||0, color:'text-green-600', icon:'ti-pill' },
          { label:'Monthly Revenue', value: `$${Number(stats?.billing?.revenue?.TOTAL_REVENUE||0).toLocaleString()}`, color:'text-amber-500', icon:'ti-chart-bar' },
        ].map(s=>(
          <div key={s.label} className="card">
            <p className="text-xs text-gray-500 mb-2">{s.label} <i className={`ti ${s.icon} float-right text-xl opacity-20`}></i></p>
            <p className={`text-3xl font-semibold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="card">
          <h3 className="font-medium text-gray-800 mb-5">Key Performance Indicators</h3>
          <div>
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1.5"><span className="text-gray-600">Bill Collection Rate</span><span className="font-semibold text-green-600">
                {stats?.billing?.revenue?.TOTAL_BILLS > 0
                  ? Math.round((Number(stats.billing.revenue.TOTAL_REVENUE) / (Number(stats.billing.revenue.TOTAL_REVENUE) + Number(stats.billing.revenue.PENDING_AMOUNT))) * 100) + '%'
                  : '—'}
              </span></div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-green-500" style={{width:'86%'}}></div>
              </div>
            </div>
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1.5"><span className="text-gray-600">OPD Appointment Fill Rate</span><span className="font-semibold text-blue-700">91%</span></div>
              <div className="h-2 bg-gray-100 rounded-full"><div className="h-full rounded-full bg-blue-500" style={{width:'91%'}}></div></div>
            </div>
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1.5"><span className="text-gray-600">Surgery Success Rate</span><span className="font-semibold text-teal-600">97%</span></div>
              <div className="h-2 bg-gray-100 rounded-full"><div className="h-full rounded-full bg-teal-500" style={{width:'97%'}}></div></div>
            </div>
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1.5"><span className="text-gray-600">Staff Attendance Rate</span><span className="font-semibold text-green-600">95%</span></div>
              <div className="h-2 bg-gray-100 rounded-full"><div className="h-full rounded-full bg-green-400" style={{width:'95%'}}></div></div>
            </div>
            <div className="mb-0">
              <div className="flex justify-between text-sm mb-1.5"><span className="text-gray-600">Patient Satisfaction</span><span className="font-semibold text-amber-500">94%</span></div>
              <div className="h-2 bg-gray-100 rounded-full"><div className="h-full rounded-full bg-amber-400" style={{width:'94%'}}></div></div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-medium text-gray-800 mb-5">Financial Summary</h3>
          <div className="space-y-4">
            {[
              { label:'Total Revenue (Month)', value:`$${Number(stats?.billing?.revenue?.TOTAL_REVENUE||0).toLocaleString()}`, color:'text-green-600' },
              { label:'Pending Payments', value:`$${Number(stats?.billing?.revenue?.PENDING_AMOUNT||0).toLocaleString()}`, color:'text-amber-500' },
              { label:'Total Invoices', value: stats?.billing?.revenue?.TOTAL_BILLS||0, color:'text-blue-700' },
              { label:'Total Patients', value: stats?.patientCount||0, color:'text-blue-700' },
              { label:'Active Staff', value: stats?.staffCount||0, color:'text-teal-600' },
              { label:'Medicine Types', value: stats?.medicineCount||0, color:'text-green-600' },
            ].map(item=>(
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-600">{item.label}</span>
                <span className={`font-semibold ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
