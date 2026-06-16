import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import api from '../api/axios';

function CartPage() {
  const { isSignedIn } = useUser();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSignedIn) { setLoading(false); return; }
    api.get('/cart').then(res => setCart(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, [isSignedIn]);

  const removeItem = async (productId) => {
    try { const res = await api.delete('/cart/remove', { data: { productId } }); setCart(res.data); } catch (err) { console.error(err); }
  };

  const total = cart.items.reduce((sum, item) => sum + (item.productId?.price || 0) * item.quantity, 0);

  if (!isSignedIn) {
    return (
      <div className="py-8 sm:py-12 max-w-lg mx-auto">
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="w-14 h-14 rounded-xl bg-surface border border-border flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-heading)' }}>SHOPPING CART</h1>
          <p className="text-dark-400 text-sm mb-6">Sign in to view your cart.</p>
          <Link to="/sign-in" className="bg-accent hover:bg-accent-hover text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-all shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:-translate-y-0.5">Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 max-w-3xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>SHOPPING CART</h1>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="w-8 h-8 border-2 border-border border-t-accent rounded-full animate-spin" />
        </div>
      ) : cart.items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="w-14 h-14 rounded-xl bg-surface border border-border flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
          </div>
          <p className="text-dark-400 text-sm mb-6">Your cart is empty.</p>
          <Link to="/products" className="bg-accent hover:bg-accent-hover text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-all shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:-translate-y-0.5">Browse Products</Link>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-3">
            {cart.items.map((item) => (
              <div key={item._id} className="bg-surface border border-border rounded-xl flex items-center gap-4 p-4">
                <div className="w-16 h-16 bg-dark-800 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                  {item.productId?.images?.[0] ? <img src={item.productId.images[0]} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} /> : null}
                  <svg className={`w-6 h-6 text-dark-500 ${item.productId?.images?.[0] ? 'hidden' : 'flex'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white text-sm truncate">{item.productId?.title || 'Product'}</h3>
                  <p className="text-[11px] text-dark-400 mt-0.5">{item.productId?.condition} · {item.productId?.category}</p>
                  <p className="text-accent font-bold text-sm mt-1">₹{item.productId?.price?.toLocaleString('en-IN')} × {item.quantity}</p>
                </div>
                <button onClick={() => removeItem(item.productId?._id)} className="shrink-0 border border-red/25 text-red px-3 py-1.5 rounded-lg font-semibold text-xs hover:bg-red/10 hover:border-red/50 transition-all">Remove</button>
              </div>
            ))}
          </div>
          <div className="bg-surface border border-border rounded-xl p-5">
            <div className="flex justify-between items-center mb-3">
              <span className="text-base font-semibold text-white">Total</span>
              <span className="text-2xl sm:text-3xl font-bold text-accent" style={{ fontFamily: 'var(--font-heading)' }}>₹{total.toLocaleString('en-IN')}</span>
            </div>
            <p className="text-xs text-dark-500 mb-5">Payment: Cash on Delivery (COD)</p>
            <button className="w-full bg-accent hover:bg-accent-hover text-white py-3 rounded-lg font-semibold text-sm transition-all shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:-translate-y-0.5">Place Order</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;
