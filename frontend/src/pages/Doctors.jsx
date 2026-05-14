import { useEffect, useState } from 'react';
import API from '../services/api';

const roleBadge = (r) => {
  const map = { doctor:'badge-blue', nurse:'badge-teal', admin:'badge-purple', pharmacist:'badge-green' };
  return <span className={`badge ${map[r] || 'badge-gray'} capitalize`}>{r}</span>;
};
const shiftBadge = (s) => {
  const map = { morning:'badge-blue', evening:'badge-amber', night:'badge-gray' };
  return <span className={`badge ${map[s] || 'badge-gray'} capitalize`}>{s}</span>;
};

export default function Doctors() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    full_name: '', email: '', password: '', role: 'doctor', phone: '', designation: '', dept_id: '1', shift: 'morning', status: 'active'
  });

  const fetchStaff = () => {
    API.get('/staff').then(r => { setStaff(r.data); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleOpenForm = (person = null) => {
    if (person) {
      setEditId(person.STAFF_ID);
      setForm({
        full_name: person.FULL_NAME || '',
        email: person.EMAIL || '',
        password: '',
        role: person.ROLE || 'doctor',
        phone: person.PHONE || '',
        designation: person.DESIGNATION || '',
        dept_id: person.DEPT_ID || '1',
        shift: person.SHIFT || 'morning',
        status: person.STATUS || 'active'
      });
    } else {
      setEditId(null);
      setForm({ full_name: '', email: '', password: '', role: 'doctor', phone: '', designation: '', dept_id: '1', shift: 'morning', status: 'active' });
    }
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        await API.put(`/staff/${editId}`, form);
      } else {
        await API.post('/auth/register', form);
      }
      setShowForm(false);
      setForm({ full_name: '', email: '', password: '', role: 'doctor', phone: '', designation: '', dept_id: '1', shift: 'morning', status: 'active' });
      setEditId(null);
      fetchStaff();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving staff');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this staff member? This will fail if they are linked to appointments or prescriptions.')) return;
    try {
      await API.delete(`/staff/${id}`);
      fetchStaff();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting staff. They might have related records preventing deletion.');
    }
  };

  const filtered = filter === 'all' ? staff : staff.filter(s => s.ROLE === filter);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Doctors & Staff</h1>
          <p className="text-sm text-gray-500 mt-0.5">{staff.length} staff members</p>
        </div>
        <button className="btn-primary" onClick={() => handleOpenForm()}>
          <i className="ti ti-user-plus"></i> Add Staff
        </button>
      </div>

      {showForm && (
        <div className="card mb-6">
          <h3 className="font-medium text-gray-800 mb-4">{editId ? 'Edit Staff Details' : 'Register New Staff'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-3 gap-4">
              <div className="form-group"><label className="form-label">Full Name *</label><input className="form-input" value={form.full_name} onChange={e=>setForm({...form,full_name:e.target.value})} required/></div>
              {!editId && <div className="form-group"><label className="form-label">Email *</label><input type="email" className="form-input" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required/></div>}
              {!editId && <div className="form-group"><label className="form-label">Password *</label><input type="password" className="form-input" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required/></div>}
              {!editId && <div className="form-group"><label className="form-label">Role</label>
                <select className="form-input" value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
                  <option value="doctor">Doctor</option><option value="nurse">Nurse</option><option value="admin">Admin</option><option value="pharmacist">Pharmacist</option>
                </select>
              </div>}
              <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></div>
              <div className="form-group"><label className="form-label">Designation</label><input className="form-input" value={form.designation} onChange={e=>setForm({...form,designation:e.target.value})} placeholder="e.g. Senior Surgeon"/></div>
              {!editId && <div className="form-group"><label className="form-label">Department</label>
                <select className="form-input" value={form.dept_id} onChange={e=>setForm({...form,dept_id:e.target.value})}>
                  {[1,2,3,4,5,6].map(i=><option key={i} value={i}>Dept {i}</option>)}
                </select>
              </div>}
              <div className="form-group"><label className="form-label">Shift</label>
                <select className="form-input" value={form.shift} onChange={e=>setForm({...form,shift:e.target.value})}>
                  <option value="morning">Morning</option><option value="evening">Evening</option><option value="night">Night</option>
                </select>
              </div>
              {editId && <div className="form-group"><label className="form-label">Status</label>
                <select className="form-input" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
                  <option value="active">Active</option><option value="inactive">Inactive</option>
                </select>
              </div>}
            </div>
            <div className="flex gap-3 mt-2">
              <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : (editId ? 'Save Changes' : 'Register Staff')}</button>
              <button type="button" className="btn-secondary" onClick={()=>setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label:'Doctors', count: staff.filter(s=>s.ROLE==='doctor').length, color:'text-blue-700', icon:'ti-stethoscope' },
          { label:'Nurses', count: staff.filter(s=>s.ROLE==='nurse').length, color:'text-teal-600', icon:'ti-heart-rate-monitor' },
          { label:'Admins', count: staff.filter(s=>s.ROLE==='admin').length, color:'text-purple-600', icon:'ti-shield' },
          { label:'Pharmacists', count: staff.filter(s=>s.ROLE==='pharmacist').length, color:'text-green-600', icon:'ti-pill' },
        ].map(s => (
          <div key={s.label} className="card text-center cursor-pointer hover:border-blue-200" onClick={()=>setFilter(s.label.toLowerCase().slice(0,-1))}>
            <i className={`ti ${s.icon} text-2xl ${s.color} mb-2`}></i>
            <div className={`text-2xl font-semibold ${s.color}`}>{s.count}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="flex gap-2 mb-4">
          {['all','doctor','nurse','admin','pharmacist'].map(f => (
            <button key={f} onClick={()=>setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${filter===f ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{f==='all'?'All Staff':f+'s'}</button>
          ))}
        </div>
        {loading ? <div className="text-center py-10 text-gray-400">Loading...</div> : (
          <table>
            <thead><tr><th>Staff Member</th><th>Role</th><th>Department</th><th>Designation</th><th>Shift</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.STAFF_ID}>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-medium">{s.FULL_NAME?.charAt(0)}</div>
                      <div><div className="font-medium">{s.FULL_NAME}</div><div className="text-xs text-gray-400">{s.EMAIL}</div></div>
                    </div>
                  </td>
                  <td>{roleBadge(s.ROLE)}</td>
                  <td>{s.DEPT_NAME || '—'}</td>
                  <td className="text-gray-600">{s.DESIGNATION || '—'}</td>
                  <td>{s.SHIFT ? shiftBadge(s.SHIFT) : '—'}</td>
                  <td><span className={`badge ${s.STATUS==='active'?'badge-green':'badge-gray'}`}>{s.STATUS}</span></td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => handleOpenForm(s)} className="text-blue-600 hover:text-blue-800"><i className="ti ti-edit"></i></button>
                      <button onClick={() => handleDelete(s.STAFF_ID)} className="text-red-600 hover:text-red-800"><i className="ti ti-trash"></i></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan="7" className="text-center py-8 text-gray-400">No staff found</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
