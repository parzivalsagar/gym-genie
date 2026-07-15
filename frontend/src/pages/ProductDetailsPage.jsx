import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import api from '../api/axios';

function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => { api.get(`/products/${id}`).then(res => setProduct(res.data)).catch(console.error); }, [id]);

  const addToCart = async () => {
    if (!isSignedIn) return navigate('/sign-in');
    setLoading(true);
    try {
      await api.post('/cart/add', { productId: id, quantity: 1 });
      setMsg('Added to cart!');
      // Dispatch custom event to refresh cart in other components
      window.dispatchEvent(new Event('cartUpdated'));
      setTimeout(() => setMsg(''), 2500);
    } catch (err) {
      setMsg(err.response?.data?.error || 'Failed to add');
      setTimeout(() => setMsg(''), 3000);
    } finally { setLoading(false); }
  };

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
        <div className="w-8 h-8 border-2 border-border border-t-accent rounded-full animate-spin" />
        <p className="text-dark-400 text-sm mt-4">Loading product...</p>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12">
      <Link to="/products" className="inline-flex items-center gap-1.5 text-dark-400 hover:text-accent transition-colors text-sm mb-8">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
        <div className="bg-surface border border-border rounded-xl overflow-hidden aspect-square flex items-center justify-center bg-dark-800">
          {product.images?.[0] ? (
            <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
          ) : null}
          <div className={`flex flex-col items-center text-dark-500 ${product.images?.[0] ? 'hidden' : 'flex'}`}>
            <svg className="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <span className="text-sm">No Image</span>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide bg-accent/15 text-accent border border-accent/20">{product.condition}</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide bg-dark-700 text-dark-300 border border-border">{product.category}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{product.title}</h1>
          <p className="text-3xl sm:text-4xl font-bold text-accent mb-6" style={{ fontFamily: 'var(--font-heading)' }}>₹{product.price.toLocaleString('en-IN')}</p>
          <p className="text-dark-300 text-sm leading-relaxed mb-6">{product.description}</p>

          <div className="space-y-3 mb-6">
            {[
              { label: 'Qty', value: `${product.quantity} in stock` },
              product.location && { label: 'Location', value: product.location },
              product.sellerId && { label: 'Seller', value: product.sellerId.name },
            ].filter(Boolean).map((row, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-dark-700 border border-border flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-dark-400">{row.label}: <span className="text-white font-medium">{row.value}</span></span>
              </div>
            ))}
          </div>

          {msg && (
            <div className={`px-4 py-2.5 rounded-lg text-sm font-medium mb-4 animate-scale-in ${msg.includes('Added') ? 'bg-accent/10 text-accent border border-accent/20' : 'bg-red/10 text-red border border-red/20'}`}>
              {msg}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 mt-auto pt-2">
            <button onClick={addToCart} disabled={loading} className="flex-1 bg-accent hover:bg-accent-hover text-white py-3 rounded-lg font-semibold text-sm transition-all shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
              {loading ? 'Adding...' : 'Add to Cart'}
            </button>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsPage;