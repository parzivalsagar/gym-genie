import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import api from '../api/axios';

function SellerDashboard() {
  const { isSignedIn } = useUser();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', description: '', category: 'Dumbbells', condition: 'New', price: '', quantity: '', location: '' });
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isSignedIn) { setLoading(false); return; }
    api.get('/products').then(res => setProducts(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, [isSignedIn]);

  useEffect(() => {
    const urls = files.map(f => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach(u => URL.revokeObjectURL(u));
  }, [files]);

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    if (files.length + selected.length > 5) {
      alert('Maximum 5 images allowed');
      return;
    }
    setFiles(prev => [...prev, ...selected]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let imageUrls = [];
      if (files.length > 0) {
        const formData = new FormData();
        files.forEach(f => formData.append('images', f));
        const uploadRes = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        imageUrls = uploadRes.data.urls;
      }
      const res = await api.post('/products', {
        ...form,
        price: Number(form.price),
        quantity: Number(form.quantity),
        images: imageUrls,
      });
      setProducts([res.data, ...products]);
      setForm({ title: '', description: '', category: 'Dumbbells', condition: 'New', price: '', quantity: '', location: '' });
      setFiles([]);
    } catch (err) { console.error(err); } finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
    } catch (err) { console.error(err); }
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
            <div className="space-y-2">
              <label className="text-sm text-dark-300 font-medium">Product Images (max 5)</label>
              {previews.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {previews.map((url, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-border group">
                      <img src={url} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeFile(i)} className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                        <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <label className="w-full border border-dashed border-border hover:border-accent/50 text-dark-400 hover:text-accent py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                {files.length > 0 ? `Add more images (${files.length}/5)` : 'Choose images'}
                <input type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
              </label>
            </div>
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
                  <div className="flex items-center gap-3 min-w-0">
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt={p.title} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-dark-700 border border-border flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-white truncate">{p.title}</p>
                      <p className="text-[11px] text-dark-400">{p.category} · {p.condition}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-accent font-bold text-sm">₹{p.price.toLocaleString('en-IN')}</span>
                    <button onClick={() => handleDelete(p._id)} className="p-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all" title="Delete product">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
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
