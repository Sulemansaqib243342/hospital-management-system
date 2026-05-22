import { useEffect, useState } from 'react';
import API from '../services/api';

const statusBadge = (s) => {
  const map = { paid:'badge-green', pending:'badge-amber', partial:'badge-blue', overdue:'badge-red' };
  return <span className={`badge ${map[s]||'badge-gray'} capitalize`}>{s}</span>;
};

const PAYMENT_METHODS = ['JazzCash', 'EasyPaisa', 'Sadapay', 'Online', 'Insurance'];

export default function Billing() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Create/Edit Invoice state
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ patient_id:'', admission_id:'', total_amount:'', paid_amount:'', payment_mode:'cash', notes:'' });
  const [saving, setSaving] = useState(false);
  const [calculating, setCalculating] = useState(false);
  
  // Add Payment state
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentBillId, setPaymentBillId] = useState(null);
  const [paymentForm, setPaymentForm] = useState({ amount:'', payment_mode:'cash' });
  const [addingPayment, setAddingPayment] = useState(false);

  const [patients, setPatients] = useState([]);

  const fetchAll = () => {
    API.get('/billing').then(r=>{setBills(r.data);setLoading(false);}).catch(()=>setLoading(false));
  };

  useEffect(() => {
    fetchAll();
    API.get('/patients').then(r=>setPatients(r.data));
  }, []);

  const handleOpenForm = (bill = null) => {
    if (bill) {
      setEditId(bill.BILL_ID);
      setForm({
        patient_id: bill.PATIENT_ID || '',
        admission_id: bill.ADMISSION_ID || '',
        total_amount: bill.TOTAL_AMOUNT || '',
        paid_amount: bill.PAID_AMOUNT || '',
        payment_mode: bill.PAYMENT_MODE || 'cash',
        notes: bill.NOTES || ''
      });
    } else {
      setEditId(null);
      setForm({ patient_id:'', admission_id:'', total_amount:'', paid_amount:'', payment_mode:'cash', notes:'' });
    }
    setShowForm(true);
    setShowPaymentForm(false);
  };

  const handleOpenPaymentForm = (bill) => {
    setPaymentBillId(bill.BILL_ID);
    setPaymentForm({ amount: bill.BALANCE || 0, payment_mode: 'cash' });
    setShowPaymentForm(true);
    setShowForm(false);
  };

  const handleAutoCalculate = async () => {
    if (!form.patient_id) {
      alert('Please select a patient first.');
      return;
    }
    setCalculating(true);
    try {
      const res = await API.get(`/billing/auto-calculate/${form.patient_id}`);
      setForm({ ...form, total_amount: res.data.suggested_total, notes: res.data.suggested_notes });
    } catch (err) {
      alert('Failed to auto-calculate bill.');
    } finally {
      setCalculating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editId) {
        await API.put(`/billing/${editId}`, form);
      } else {
        await API.post('/billing', form);
      }
      setShowForm(false); 
      setEditId(null);
      setForm({ patient_id:'', admission_id:'', total_amount:'', paid_amount:'', payment_mode:'cash', notes:'' });
      fetchAll();
    } catch(err) { alert(err.response?.data?.message||'Error saving bill'); }
    finally { setSaving(false); }
  };

  const handleAddPaymentSubmit = async (e) => {
    e.preventDefault(); setAddingPayment(true);
    try {
      await API.put(`/billing/${paymentBillId}/payment`, paymentForm);
      setShowPaymentForm(false);
      setPaymentBillId(null);
      setPaymentForm({ amount:'', payment_mode:'cash' });
      fetchAll();
    } catch(err) { alert(err.response?.data?.message||'Error adding payment'); }
    finally { setAddingPayment(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this invoice? This cannot be undone.')) return;
    try {
      await API.delete(`/billing/${id}`);
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting invoice.');
    }
  };

  const totalRevenue = bills.reduce((sum,b)=>sum+Number(b.PAID_AMOUNT||0),0);
  const totalPending = bills.reduce((sum,b)=>sum+Number(b.BALANCE||0),0);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Billing & Payments</h1>
          <p className="text-sm text-gray-500 mt-0.5">{bills.length} total invoices</p>
        </div>
        <button className="btn-primary" onClick={()=>handleOpenForm()}><i className="ti ti-receipt"></i> New Invoice</button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="card"><p className="text-xs text-gray-500 mb-1">Total Collected</p><p className="text-2xl font-semibold text-green-600">${totalRevenue.toLocaleString()}</p></div>
        <div className="card"><p className="text-xs text-gray-500 mb-1">Pending</p><p className="text-2xl font-semibold text-amber-500">${totalPending.toLocaleString()}</p></div>
        <div className="card"><p className="text-xs text-gray-500 mb-1">Paid Bills</p><p className="text-2xl font-semibold text-blue-700">{bills.filter(b=>b.STATUS==='paid').length}</p></div>
        <div className="card"><p className="text-xs text-gray-500 mb-1">Overdue</p><p className="text-2xl font-semibold text-red-600">{bills.filter(b=>b.STATUS==='overdue').length}</p></div>
      </div>

      {showPaymentForm && (
        <div className="card mb-6 border-blue-200 border-2">
          <h3 className="font-medium text-gray-800 mb-4">Add Payment to Invoice #{paymentBillId}</h3>
          <form onSubmit={handleAddPaymentSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group"><label className="form-label">Payment Amount *</label><input type="number" step="0.01" className="form-input" value={paymentForm.amount} onChange={e=>setPaymentForm({...paymentForm,amount:e.target.value})} required/></div>
              <div className="form-group">
                <label className="form-label">Payment Mode *</label>
                <select className="form-input" value={paymentForm.payment_mode} onChange={e=>setPaymentForm({...paymentForm,payment_mode:e.target.value})}>
                  {PAYMENT_METHODS.map(m=><option key={m} value={m} className="capitalize">{m}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button type="submit" className="btn-primary" disabled={addingPayment}>{addingPayment?'Processing...':'Submit Payment'}</button>
              <button type="button" className="btn-secondary" onClick={()=>setShowPaymentForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {showForm && (
        <div className="card mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-800">{editId ? 'Edit Invoice' : 'Create New Invoice'}</h3>
            <button type="button" onClick={handleAutoCalculate} disabled={calculating} className="text-sm bg-purple-100 text-purple-700 px-3 py-1.5 rounded hover:bg-purple-200 flex items-center gap-1 font-medium">
              <i className="ti ti-calculator"></i> {calculating ? 'Calculating...' : 'Auto-Calculate from History'}
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-3 gap-4">
              <div className="form-group">
                <label className="form-label">Patient *</label>
                <select className="form-input" value={form.patient_id} onChange={e=>setForm({...form,patient_id:e.target.value})} required disabled={!!editId}>
                  <option value="">Select patient</option>
                  {patients.map(p=><option key={p.PATIENT_ID} value={p.PATIENT_ID}>{p.FULL_NAME}</option>)}
                </select>
              </div>
              <div className="form-group"><label className="form-label">Total Amount *</label><input type="number" step="0.01" className="form-input" value={form.total_amount} onChange={e=>setForm({...form,total_amount:e.target.value})} required/></div>
              <div className="form-group"><label className="form-label">Paid Amount</label><input type="number" step="0.01" className="form-input" value={form.paid_amount} onChange={e=>setForm({...form,paid_amount:e.target.value})}/></div>
              <div className="form-group">
                <label className="form-label">Payment Mode</label>
                <select className="form-input" value={form.payment_mode} onChange={e=>setForm({...form,payment_mode:e.target.value})}>
                  {PAYMENT_METHODS.map(m=><option key={m} value={m} className="capitalize">{m}</option>)}
                </select>
              </div>
              <div className="form-group col-span-2"><label className="form-label">Notes</label><input className="form-input" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/></div>
            </div>
            <div className="flex gap-3 mt-2">
              <button type="submit" className="btn-primary" disabled={saving}>{saving?'Saving...':(editId ? 'Save Changes' : 'Create Invoice')}</button>
              <button type="button" className="btn-secondary" onClick={()=>setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        {loading ? <div className="text-center py-10 text-gray-400">Loading...</div> : (
          <table>
            <thead><tr><th>Invoice</th><th>Patient</th><th>Total</th><th>Paid</th><th>Balance</th><th>Mode</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {bills.map(b=>(
                <tr key={b.BILL_ID}>
                  <td className="text-gray-400 text-xs">#{b.BILL_ID}</td>
                  <td><div className="font-medium">{b.PATIENT_NAME}</div><div className="text-xs text-gray-400">{b.PATIENT_PHONE}</div></td>
                  <td className="font-medium">${Number(b.TOTAL_AMOUNT).toLocaleString()}</td>
                  <td className="text-green-600">${Number(b.PAID_AMOUNT||0).toLocaleString()}</td>
                  <td className={Number(b.BALANCE)>0?'text-red-500 font-medium':'text-gray-400'}>${Number(b.BALANCE||0).toLocaleString()}</td>
                  <td className="capitalize">{b.PAYMENT_MODE||'—'}</td>
                  <td>{new Date(b.BILL_DATE).toLocaleDateString()}</td>
                  <td>{statusBadge(b.STATUS)}</td>
                  <td>
                    <div className="flex gap-2">
                      {b.STATUS !== 'paid' && <button onClick={() => handleOpenPaymentForm(b)} className="text-green-600 hover:text-green-800" title="Add Payment"><i className="ti ti-cash"></i></button>}
                      <button onClick={() => handleOpenForm(b)} className="text-blue-600 hover:text-blue-800" title="Edit Bill"><i className="ti ti-edit"></i></button>
                      <button onClick={() => handleDelete(b.BILL_ID)} className="text-red-600 hover:text-red-800" title="Delete Bill"><i className="ti ti-trash"></i></button>
                    </div>
                  </td>
                </tr>
              ))}
              {bills.length===0&&<tr><td colSpan="9" className="text-center py-8 text-gray-400">No bills found</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
