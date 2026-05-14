import { useEffect, useState } from 'react';
import API from '../services/api';

const statusBadge = (s) => {
  const map = { scheduled:'badge-gray', confirmed:'badge-green', completed:'badge-teal', cancelled:'badge-red', missed:'badge-amber' };
  return <span className={`badge ${map[s]||'badge-gray'} capitalize`}>{s}</span>;
};

export default function Appointments() {
  const [appts, setAppts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Book Appt Form
  const [showForm, setShowForm] = useState(false);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({ patient_id:'', doctor_id:'', dept_id:'', appt_date:'', appt_time:'', reason:'', notes:'' });
  const [saving, setSaving] = useState(false);

  // Attend Patient Form
  const [attendModal, setAttendModal] = useState({ show: false, apptId: null });
  const [medicines, setMedicines] = useState([]);
  const [attendNotes, setAttendNotes] = useState('');
  const [prescriptions, setPrescriptions] = useState([]);
  const [attending, setAttending] = useState(false);

  const fetchAll = () => {
    API.get('/appointments').then(r => { setAppts(r.data); setLoading(false); }).catch(()=>setLoading(false));
  };

  useEffect(() => {
    fetchAll();
    API.get('/patients').then(r=>setPatients(r.data));
    API.get('/staff/doctors').then(r=>setDoctors(r.data));
    API.get('/pharmacy/medicines').then(r=>setMedicines(r.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      await API.post('/appointments', form);
      setShowForm(false); fetchAll();
    } catch(err) { alert(err.response?.data?.message || 'Error'); }
    finally { setSaving(false); }
  };

  const updateStatus = async (id, status) => {
    await API.put(`/appointments/${id}/status`, { status });
    fetchAll();
  };

  const openAttendModal = (apptId) => {
    setAttendModal({ show: true, apptId });
    setAttendNotes('');
    setPrescriptions([]);
  };

  const handleAddPrescription = () => {
    setPrescriptions([...prescriptions, { medicine_id: '', quantity: 1, dosage: '', duration: '' }]);
  };

  const handlePrescriptionChange = (index, field, value) => {
    const newP = [...prescriptions];
    newP[index][field] = value;
    setPrescriptions(newP);
  };

  const handleRemovePrescription = (index) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== index));
  };

  const submitAttend = async (e) => {
    e.preventDefault();
    setAttending(true);
    try {
      await API.post(`/appointments/${attendModal.apptId}/attend`, {
        notes: attendNotes,
        prescriptions: prescriptions.filter(p => p.medicine_id !== '')
      });
      setAttendModal({ show: false, apptId: null });
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || 'Error attending patient');
    } finally {
      setAttending(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Appointments</h1>
          <p className="text-sm text-gray-500 mt-0.5">{appts.length} total appointments</p>
        </div>
        <button className="btn-primary" onClick={()=>setShowForm(!showForm)}>
          <i className="ti ti-calendar-plus"></i> Book Appointment
        </button>
      </div>

      {showForm && (
        <div className="card mb-6">
          <h3 className="font-medium text-gray-800 mb-4">Book New Appointment</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-3 gap-4">
              <div className="form-group">
                <label className="form-label">Patient *</label>
                <select className="form-input" value={form.patient_id} onChange={e=>setForm({...form,patient_id:e.target.value})} required>
                  <option value="">Select patient</option>
                  {patients.map(p=><option key={p.PATIENT_ID} value={p.PATIENT_ID}>{p.FULL_NAME}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Doctor *</label>
                <select className="form-input" value={form.doctor_id} onChange={e=>setForm({...form,doctor_id:e.target.value})} required>
                  <option value="">Select doctor</option>
                  {doctors.map(d=><option key={d.STAFF_ID} value={d.STAFF_ID}>{d.FULL_NAME} — {d.DEPT_NAME}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Department *</label>
                <select className="form-input" value={form.dept_id} onChange={e=>setForm({...form,dept_id:e.target.value})} required>
                  <option value="">Select dept</option>
                  {[1,2,3,4,5,6].map(i=><option key={i} value={i}>Dept {i}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Date *</label>
                <input type="date" className="form-input" value={form.appt_date} onChange={e=>setForm({...form,appt_date:e.target.value})} required/>
              </div>
              <div className="form-group">
                <label className="form-label">Time *</label>
                <input type="time" className="form-input" value={form.appt_time} onChange={e=>setForm({...form,appt_time:e.target.value})} required/>
              </div>
              <div className="form-group">
                <label className="form-label">Reason</label>
                <input className="form-input" value={form.reason} onChange={e=>setForm({...form,reason:e.target.value})}/>
              </div>
            </div>
            <div className="flex gap-3 mt-2">
              <button type="submit" className="btn-primary" disabled={saving}>{saving?'Booking...':'Book Appointment'}</button>
              <button type="button" className="btn-secondary" onClick={()=>setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {attendModal.show && (
        <div className="card mb-6 border-blue-300 shadow-md">
          <h3 className="font-medium text-blue-800 mb-4 flex items-center gap-2">
            <i className="ti ti-stethoscope"></i> Attend Patient
          </h3>
          <form onSubmit={submitAttend}>
            <div className="mb-4">
              <label className="form-label">Consultation Notes / Diagnosis *</label>
              <textarea className="form-input h-24" value={attendNotes} onChange={e=>setAttendNotes(e.target.value)} required placeholder="Enter doctor's notes here..."></textarea>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="form-label mb-0">Prescriptions</label>
                <button type="button" className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200" onClick={handleAddPrescription}>
                  + Add Medicine
                </button>
              </div>
              {prescriptions.map((p, idx) => (
                <div key={idx} className="flex gap-2 mb-2 items-center">
                  <select className="form-input text-sm flex-1" value={p.medicine_id} onChange={e=>handlePrescriptionChange(idx, 'medicine_id', e.target.value)} required>
                    <option value="">Select Medicine</option>
                    {medicines.map(m=><option key={m.MEDICINE_ID} value={m.MEDICINE_ID}>{m.NAME} (Stock: {m.QUANTITY})</option>)}
                  </select>
                  <input type="number" className="form-input text-sm w-20" placeholder="Qty" value={p.quantity} onChange={e=>handlePrescriptionChange(idx, 'quantity', e.target.value)} required min="1"/>
                  <input className="form-input text-sm w-32" placeholder="Dosage (e.g. 1-0-1)" value={p.dosage} onChange={e=>handlePrescriptionChange(idx, 'dosage', e.target.value)} required/>
                  <input className="form-input text-sm w-24" placeholder="Days" value={p.duration} onChange={e=>handlePrescriptionChange(idx, 'duration', e.target.value)} required/>
                  <button type="button" className="text-red-500 hover:text-red-700 p-1" onClick={()=>handleRemovePrescription(idx)}>
                    <i className="ti ti-trash"></i>
                  </button>
                </div>
              ))}
              {prescriptions.length === 0 && <div className="text-xs text-gray-500 italic">No medicines prescribed yet.</div>}
            </div>

            <div className="flex gap-3">
              <button type="submit" className="btn-primary" disabled={attending}>{attending ? 'Processing...' : 'Complete & Prescribe'}</button>
              <button type="button" className="btn-secondary" onClick={()=>setAttendModal({show:false, apptId:null})}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        {loading ? <div className="text-center py-10 text-gray-400">Loading...</div> : (
          <table>
            <thead><tr><th>Patient</th><th>Doctor</th><th>Department</th><th>Date & Time</th><th>Reason</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {appts.map(a => (
                <tr key={a.APPT_ID}>
                  <td><div className="font-medium">{a.PATIENT_NAME}</div><div className="text-xs text-gray-400">{a.PATIENT_PHONE}</div></td>
                  <td>{a.DOCTOR_NAME}</td>
                  <td>{a.DEPT_NAME}</td>
                  <td><div>{new Date(a.APPT_DATE).toLocaleDateString()}</div><div className="text-xs text-gray-400">{a.APPT_TIME}</div></td>
                  <td className="text-gray-600">{a.REASON || '—'}</td>
                  <td>{statusBadge(a.STATUS)}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <select className="text-xs border border-gray-200 rounded px-2 py-1 bg-white w-24" value={a.STATUS} onChange={e=>updateStatus(a.APPT_ID,e.target.value)}>
                        {['scheduled','confirmed','completed','cancelled','missed'].map(s=><option key={s} value={s}>{s}</option>)}
                      </select>
                      {(a.STATUS === 'scheduled' || a.STATUS === 'confirmed') && (
                        <button onClick={()=>openAttendModal(a.APPT_ID)} className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 px-2 py-1 rounded font-medium">
                          Attend
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {appts.length===0 && <tr><td colSpan="7" className="text-center py-8 text-gray-400">No appointments found</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
