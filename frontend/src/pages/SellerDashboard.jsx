import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import api from '../api/axios';

function SellerDashboard() {
  const { isSignedIn } = useUser();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', description: '', category: 'Dumbbells', condition: 'New', price: '', quantity: '', location: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isSignedIn) { setLoading(false); return; }
    api.get('/products').then(res => setProducts(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, [isSignedIn]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/products', { ...form, price: Number(form.price), quantity: Number(form.quantity) });
      setProducts([res.data, ...products]);
      setForm({ title: '', description: '', category: 'Dumbbells', condition: 'New', price: '', quantity: '', location: '' });
    } catch (err) { console.error(err); } finally { setSubmitting(false); }
  };

  if (!isSignedIn) {
    return (
      <div className="py-8 sm:py-12 max-w-lg mx-auto">
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-heading)' }}>SELLER DASHBOARD</h1>
          <p className="text-dark-400 text-sm mb-6">Sign in to manage your products.</p>
          <Link to="/sign-in" className="bg-accent hover:bg-accent-hover text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-all shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:-translate-y-0.5">Sign In</Link>
        </div>
      </div>
    );
  }

  const inputClass = "w-full bg-dark-800 border border-border rounded-lg px-3.5 py-2.5 text-sm text-dark-100 placeholder-dark-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all";

  return (
    <div className="py-8 sm:py-12">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>SELLER DASHBOARD</h1>
        <p className="text-dark-400 text-sm mt-1">Manage your products and track sales</p>
      </div>

      <div className="mb-6 sm:mb-8">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total', value: products.length, color: 'text-accent' },
            { label: 'New', value: products.filter(p => p.condition === 'New').length, color: 'text-emerald-400' },
            { label: 'Used', value: products.filter(p => p.condition === 'Used').length, color: 'text-yellow-400' },
          ].map(s => (
            <div key={s.label} className="bg-surface border border-border rounded-xl p-4 text-center">
              <p className={`text-2xl sm:text-3xl font-bold ${s.color}`} style={{ fontFamily: 'var(--font-heading)' }}>{s.value}</p>
              <p className="text-dark-400 text-xs sm:text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface border border-border rounded-xl p-5 order-2 lg:order-1">
          <h2 className="text-lg font-bold text-white mb-4" style={{ fontFamily: 'var(--font-heading)' }}>ADD PRODUCT</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input type="text" placeholder="Product Name" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className={inputClass} required />
            <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className={`${inputClass} h-20 resize-none`} required />
            <div className="grid grid-cols-2 gap-3">
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className={inputClass}>
                {['Dumbbells','Barbells','Weight Plates','Kettlebells','Benches','Treadmills','Exercise Bikes','Resistance Bands','Home Gym Systems','Accessories'].map(c => <option key={c}>{c}</option>)}
              </select>
              <select value={form.condition} onChange={e => setForm({ ...form, condition: e.target.value })} className={inputClass}>
                <option>New</option><option>Used</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input type="number" placeholder="Price (₹)" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className={inputClass} required />
              <input type="number" placeholder="Qty" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} className={inputClass} required />
            </div>
            <input type="text" placeholder="Location (optional)" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className={inputClass} />
            <button type="submit" disabled={submitting} className="w-full bg-accent hover:bg-accent-hover text-white py-3 rounded-lg font-semibold text-sm transition-all shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">{submitting ? 'Adding...' : 'Add Product'}</button>
          </form>
        </div>

        <div className="bg-surface border border-border rounded-xl p-5 order-1 lg:order-2">
          <h2 className="text-lg font-bold text-white mb-4" style={{ fontFamily: 'var(--font-heading)' }}>ALL PRODUCTS ({products.length})</h2>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
              <div className="w-8 h-8 border-2 border-border border-t-accent rounded-full animate-spin" />
            </div>
          ) : products.length === 0 ? (
            <p className="text-dark-400 text-sm text-center py-8">No products yet.</p>
          ) : (
            <ul className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {products.map(p => (
                <li key={p._id} className="flex justify-between items-center bg-dark-800 border border-border/50 rounded-lg p-3 hover:border-accent/20 transition-all gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-white truncate">{p.title}</p>
                    <p className="text-[11px] text-dark-400">{p.category} · {p.condition}</p>
                  </div>
                  <span className="text-accent font-bold text-sm shrink-0">₹{p.price.toLocaleString('en-IN')}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default SellerDashboard;
