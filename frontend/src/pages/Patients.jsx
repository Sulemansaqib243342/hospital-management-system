import { useEffect, useState } from 'react';
import API from '../services/api';

const statusBadge = (s) => {
  const map = { admitted:'badge-blue', stable:'badge-green', critical:'badge-red', monitoring:'badge-amber', discharged:'badge-gray' };
  return <span className={`badge ${map[s] || 'badge-gray'}`}>{s || 'OPD'}</span>;
};

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ full_name:'', dob:'', gender:'male', blood_group:'', phone:'', email:'', address:'', emergency_contact:'' });
  const [saving, setSaving] = useState(false);

  const fetchPatients = () => {
    API.get('/patients').then(r => { setPatients(r.data); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchPatients(); }, []);

  const filtered = patients.filter(p =>
    p.FULL_NAME?.toLowerCase().includes(search.toLowerCase()) ||
    p.PHONE?.includes(search)
  );

  const handleOpenForm = (patient = null) => {
    if (patient) {
      setEditId(patient.PATIENT_ID);
      setForm({
        full_name: patient.FULL_NAME || '',
        dob: patient.DOB ? patient.DOB.split('T')[0] : '',
        gender: patient.GENDER || 'male',
        blood_group: patient.BLOOD_GROUP || '',
        phone: patient.PHONE || '',
        email: patient.EMAIL || '',
        address: patient.ADDRESS || '',
        emergency_contact: patient.EMERGENCY_CONTACT || ''
      });
    } else {
      setEditId(null);
      setForm({ full_name:'', dob:'', gender:'male', blood_group:'', phone:'', email:'', address:'', emergency_contact:'' });
    }
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editId) {
        await API.put(`/patients/${editId}`, form);
      } else {
        await API.post('/patients', form);
      }
      setShowForm(false);
      setForm({ full_name:'', dob:'', gender:'male', blood_group:'', phone:'', email:'', address:'', emergency_contact:'' });
      setEditId(null);
      fetchPatients();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving patient');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this patient? This will fail if they have existing appointments or bills.')) return;
    try {
      await API.delete(`/patients/${id}`);
      fetchPatients();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting patient. They might have related records preventing deletion.');
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Patients</h1>
          <p className="text-sm text-gray-500 mt-0.5">{patients.length} total registered patients</p>
        </div>
        <button className="btn-primary" onClick={() => handleOpenForm()}>
          <i className="ti ti-user-plus"></i> Register Patient
        </button>
      </div>

      {showForm && (
        <div className="card mb-6">
          <h3 className="font-medium text-gray-800 mb-4">{editId ? 'Edit Patient' : 'New Patient Registration'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-3 gap-4">
              <div className="form-group"><label className="form-label">Full Name *</label><input className="form-input" value={form.full_name} onChange={e=>setForm({...form,full_name:e.target.value})} required/></div>
              <div className="form-group"><label className="form-label">Date of Birth</label><input type="date" className="form-input" value={form.dob} onChange={e=>setForm({...form,dob:e.target.value})}/></div>
              <div className="form-group"><label className="form-label">Gender</label>
                <select className="form-input" value={form.gender} onChange={e=>setForm({...form,gender:e.target.value})}>
                  <option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
                </select>
              </div>
              <div className="form-group"><label className="form-label">Blood Group</label><input className="form-input" placeholder="A+" value={form.blood_group} onChange={e=>setForm({...form,blood_group:e.target.value})}/></div>
              <div className="form-group"><label className="form-label">Phone *</label><input className="form-input" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} required/></div>
              <div className="form-group"><label className="form-label">Email</label><input type="email" className="form-input" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div>
              <div className="form-group col-span-2"><label className="form-label">Address</label><input className="form-input" value={form.address} onChange={e=>setForm({...form,address:e.target.value})}/></div>
              <div className="form-group"><label className="form-label">Emergency Contact</label><input className="form-input" value={form.emergency_contact} onChange={e=>setForm({...form,emergency_contact:e.target.value})}/></div>
            </div>
            <div className="flex gap-3 mt-2">
              <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : (editId ? 'Save Changes' : 'Register Patient')}</button>
              <button type="button" className="btn-secondary" onClick={()=>setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 flex-1">
            <i className="ti ti-search text-gray-400"></i>
            <input className="bg-transparent text-sm outline-none flex-1" placeholder="Search patients..." value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
        </div>
        {loading ? <div className="text-center py-10 text-gray-400">Loading...</div> : (
          <div className="overflow-x-auto">
            <table>
              <thead><tr><th>Patient</th><th>Age / Gender</th><th>Blood</th><th>Phone</th><th>Ward</th><th>Doctor</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.PATIENT_ID}>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-medium">{p.FULL_NAME?.charAt(0)}</div>
                        <div><div className="font-medium">{p.FULL_NAME}</div><div className="text-xs text-gray-400">#{p.PATIENT_ID}</div></div>
                      </div>
                    </td>
                    <td>{p.DOB ? `${new Date().getFullYear() - new Date(p.DOB).getFullYear()} yrs` : '—'} / <span className="capitalize">{p.GENDER}</span></td>
                    <td><span className="badge badge-blue">{p.BLOOD_GROUP || '—'}</span></td>
                    <td>{p.PHONE}</td>
                    <td>{p.WARD || '—'}</td>
                    <td>{p.DOCTOR_NAME || '—'}</td>
                    <td>{statusBadge(p.STATUS)}</td>
                    <td>
                      <div className="flex gap-2">
                        <button onClick={() => handleOpenForm(p)} className="text-blue-600 hover:text-blue-800"><i className="ti ti-edit"></i></button>
                        <button onClick={() => handleDelete(p.PATIENT_ID)} className="text-red-600 hover:text-red-800"><i className="ti ti-trash"></i></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan="8" className="text-center py-8 text-gray-400">No patients found</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
