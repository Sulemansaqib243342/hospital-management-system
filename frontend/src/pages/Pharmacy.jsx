import { useEffect, useState } from 'react';
import API from '../services/api';

const stockBadge = (s) => {
  const map = { ok:'badge-green', low:'badge-amber', out_of_stock:'badge-red' };
  const lbl = { ok:'In Stock', low:'Low Stock', out_of_stock:'Out of Stock' };
  return <span className={`badge ${map[s]||'badge-gray'}`}>{lbl[s]||s}</span>;
};

export default function Pharmacy() {
  const [medicines, setMedicines] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('inventory');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name:'', category:'', unit:'', quantity:0, min_quantity:10, price:0, expiry_date:'', supplier:'' });
  const [saving, setSaving] = useState(false);

  const fetchAll = () => {
    API.get('/pharmacy/medicines').then(r => { setMedicines(r.data); setLoading(false); });
    API.get('/pharmacy/prescriptions').then(r => setPrescriptions(r.data));
  };

  useEffect(() => { fetchAll(); }, []);

  const handleOpenForm = (med = null) => {
    if (med) {
      setEditId(med.MEDICINE_ID);
      setForm({
        name: med.NAME || '',
        category: med.CATEGORY || '',
        unit: med.UNIT || '',
        quantity: med.QUANTITY || 0,
        min_quantity: med.MIN_QUANTITY || 10,
        price: med.PRICE || 0,
        expiry_date: med.EXPIRY_DATE ? med.EXPIRY_DATE.split('T')[0] : '',
        supplier: med.SUPPLIER || ''
      });
    } else {
      setEditId(null);
      setForm({ name:'', category:'', unit:'', quantity:0, min_quantity:10, price:0, expiry_date:'', supplier:'' });
    }
    setShowForm(true);
  };

  const handleAddMedicine = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editId) {
        await API.put(`/pharmacy/medicines/${editId}`, form);
      } else {
        await API.post('/pharmacy/medicines', form);
      }
      setShowForm(false);
      setEditId(null);
      setForm({ name:'', category:'', unit:'', quantity:0, min_quantity:10, price:0, expiry_date:'', supplier:'' });
      fetchAll();
    } catch(err) { alert(err.response?.data?.message || 'Error saving medicine'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this medicine? It will fail if it has been prescribed.')) return;
    try {
      await API.delete(`/pharmacy/medicines/${id}`);
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting medicine. It might be linked to existing prescriptions.');
    }
  };

  const lowStock = medicines.filter(m => m.STOCK_STATUS !== 'ok');

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Pharmacy & Inventory</h1>
          <p className="text-sm text-gray-500 mt-0.5">{medicines.length} medicines in stock</p>
        </div>
        <button className="btn-primary" onClick={()=>handleOpenForm()}><i className="ti ti-plus"></i> Add Medicine</button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card text-center"><div className="text-2xl font-semibold text-blue-700">{medicines.length}</div><div className="text-xs text-gray-500 mt-1">Total Medicines</div></div>
        <div className="card text-center"><div className="text-2xl font-semibold text-amber-500">{medicines.filter(m=>m.STOCK_STATUS==='low').length}</div><div className="text-xs text-gray-500 mt-1">Low Stock</div></div>
        <div className="card text-center"><div className="text-2xl font-semibold text-red-600">{medicines.filter(m=>m.STOCK_STATUS==='out_of_stock').length}</div><div className="text-xs text-gray-500 mt-1">Out of Stock</div></div>
      </div>

      {showForm && (
        <div className="card mb-6">
          <h3 className="font-medium text-gray-800 mb-4">{editId ? 'Edit Medicine Details' : 'Add New Medicine'}</h3>
          <form onSubmit={handleAddMedicine}>
            <div className="grid grid-cols-3 gap-4">
              <div className="form-group"><label className="form-label">Medicine Name *</label><input className="form-input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/></div>
              <div className="form-group"><label className="form-label">Category</label><input className="form-input" placeholder="Antibiotic, Analgesic..." value={form.category} onChange={e=>setForm({...form,category:e.target.value})}/></div>
              <div className="form-group"><label className="form-label">Unit</label><input className="form-input" placeholder="tablet, ml, strip..." value={form.unit} onChange={e=>setForm({...form,unit:e.target.value})}/></div>
              <div className="form-group"><label className="form-label">Quantity *</label><input type="number" className="form-input" value={form.quantity} onChange={e=>setForm({...form,quantity:e.target.value})} required/></div>
              <div className="form-group"><label className="form-label">Min Quantity</label><input type="number" className="form-input" value={form.min_quantity} onChange={e=>setForm({...form,min_quantity:e.target.value})}/></div>
              <div className="form-group"><label className="form-label">Price (per unit)</label><input type="number" step="0.01" className="form-input" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/></div>
              <div className="form-group"><label className="form-label">Expiry Date</label><input type="date" className="form-input" value={form.expiry_date} onChange={e=>setForm({...form,expiry_date:e.target.value})}/></div>
              <div className="form-group col-span-2"><label className="form-label">Supplier</label><input className="form-input" value={form.supplier} onChange={e=>setForm({...form,supplier:e.target.value})}/></div>
            </div>
            <div className="flex gap-3 mt-2">
              <button type="submit" className="btn-primary" disabled={saving}>{saving?'Saving...':(editId ? 'Save Changes' : 'Add Medicine')}</button>
              <button type="button" className="btn-secondary" onClick={()=>setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="flex gap-2 mb-4">
        {['inventory','prescriptions','low-stock'].map(t=>(
          <button key={t} onClick={()=>setTab(t)} className={`px-4 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${tab===t?'bg-blue-700 text-white':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{t.replace('-',' ')}</button>
        ))}
      </div>

      <div className="card">
        {loading ? <div className="text-center py-10 text-gray-400">Loading...</div> : tab === 'inventory' ? (
          <table>
            <thead><tr><th>Medicine</th><th>Category</th><th>Unit</th><th>Quantity</th><th>Min Qty</th><th>Price</th><th>Expiry</th><th>Stock</th><th>Actions</th></tr></thead>
            <tbody>
              {medicines.map(m=>(
                <tr key={m.MEDICINE_ID}>
                  <td className="font-medium">{m.NAME}</td>
                  <td className="text-gray-600">{m.CATEGORY||'—'}</td>
                  <td>{m.UNIT||'—'}</td>
                  <td className={m.STOCK_STATUS==='out_of_stock'?'text-red-600 font-semibold':m.STOCK_STATUS==='low'?'text-amber-600 font-semibold':''}>{m.QUANTITY}</td>
                  <td>{m.MIN_QUANTITY}</td>
                  <td>${Number(m.PRICE||0).toFixed(2)}</td>
                  <td>{m.EXPIRY_DATE ? new Date(m.EXPIRY_DATE).toLocaleDateString() : '—'}</td>
                  <td>{stockBadge(m.STOCK_STATUS)}</td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => handleOpenForm(m)} className="text-blue-600 hover:text-blue-800"><i className="ti ti-edit"></i></button>
                      <button onClick={() => handleDelete(m.MEDICINE_ID)} className="text-red-600 hover:text-red-800"><i className="ti ti-trash"></i></button>
                    </div>
                  </td>
                </tr>
              ))}
              {medicines.length===0&&<tr><td colSpan="9" className="text-center py-8 text-gray-400">No medicines found</td></tr>}
            </tbody>
          </table>
        ) : tab === 'prescriptions' ? (
          <table>
            <thead><tr><th>Patient</th><th>Doctor</th><th>Medicine</th><th>Qty</th><th>Dosage</th><th>Duration</th><th>Date</th><th>Dispensed</th></tr></thead>
            <tbody>
              {prescriptions.map(p=>(
                <tr key={p.PRESCRIPTION_ID}>
                  <td className="font-medium">{p.PATIENT_NAME}</td>
                  <td>{p.DOCTOR_NAME}</td>
                  <td>{p.MEDICINE_NAME}</td>
                  <td>{p.QUANTITY} {p.UNIT}</td>
                  <td>{p.DOSAGE||'—'}</td>
                  <td>{p.DURATION||'—'}</td>
                  <td>{new Date(p.PRESCRIBED_AT).toLocaleDateString()}</td>
                  <td><span className={`badge ${p.DISPENSED?'badge-green':'badge-amber'}`}>{p.DISPENSED?'Yes':'No'}</span></td>
                </tr>
              ))}
              {prescriptions.length===0&&<tr><td colSpan="8" className="text-center py-8 text-gray-400">No prescriptions found</td></tr>}
            </tbody>
          </table>
        ) : (
          <table>
            <thead><tr><th>Medicine</th><th>Category</th><th>Current Stock</th><th>Min Required</th><th>Expiry</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {lowStock.map(m=>(
                <tr key={m.MEDICINE_ID}>
                  <td className="font-medium">{m.NAME}</td>
                  <td>{m.CATEGORY||'—'}</td>
                  <td className="text-red-600 font-semibold">{m.QUANTITY}</td>
                  <td>{m.MIN_QUANTITY}</td>
                  <td>{m.EXPIRY_DATE ? new Date(m.EXPIRY_DATE).toLocaleDateString() : '—'}</td>
                  <td>{stockBadge(m.STOCK_STATUS)}</td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => handleOpenForm(m)} className="text-blue-600 hover:text-blue-800"><i className="ti ti-edit"></i></button>
                      <button onClick={() => handleDelete(m.MEDICINE_ID)} className="text-red-600 hover:text-red-800"><i className="ti ti-trash"></i></button>
                    </div>
                  </td>
                </tr>
              ))}
              {lowStock.length===0&&<tr><td colSpan="7" className="text-center py-8 text-gray-400">All medicines are well stocked!</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
