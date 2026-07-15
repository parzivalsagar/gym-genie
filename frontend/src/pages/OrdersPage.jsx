import { useUser } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

function OrdersPage() {
  const { isSignedIn } = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSignedIn) { setLoading(false); return; }
    api.get('/orders').then(res => setOrders(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, [isSignedIn]);

  if (!isSignedIn) {
    return (
      <div className="py-8 sm:py-12 max-w-lg mx-auto">
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-heading)' }}>MY ORDERS</h1>
          <p className="text-dark-400 text-sm mb-6">Sign in to view your orders.</p>
          <Link to="/sign-in" className="bg-accent hover:bg-accent-hover text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-all shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:-translate-y-0.5">Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 max-w-3xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>MY ORDERS</h1>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="w-8 h-8 border-2 border-border border-t-accent rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="w-14 h-14 rounded-xl bg-surface border border-border flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          </div>
          <p className="text-dark-400 text-sm mb-6">No orders yet.</p>
          <Link to="/products" className="bg-accent hover:bg-accent-hover text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-all shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:-translate-y-0.5">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map(order => (
            <div key={order._id} className="bg-surface border border-border rounded-xl p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <span className="text-xs text-dark-500 font-mono">#{order._id.slice(-6)}</span>
                <span className={`self-start sm:self-auto inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide ${order.status === 'Delivered' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : order.status === 'Cancelled' ? 'bg-red/15 text-red border border-red/20' : 'bg-yellow/15 text-yellow border border-yellow/20'}`}>{order.status}</span>
              </div>
              <div className="mb-3 space-y-2">
                {order.products.map((item, idx) => (
                  <div key={`${order._id}-${idx}`} className="text-sm text-dark-300">
                    {item.productId?.title || item.productId || 'Unknown Product'}
                    <span className="ml-2 text-dark-500">× {item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-end justify-between">
                <p className="text-xl sm:text-2xl font-bold text-accent" style={{ fontFamily: 'var(--font-heading)' }}>₹{order.totalPrice.toLocaleString('en-IN')}</p>
                <p className="text-[11px] text-dark-500">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrdersPage;
