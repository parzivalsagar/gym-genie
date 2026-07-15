# Cart & Orders Fix Summary

## Problems Found & Fixed

### 1. **Cart Items Not Showing**
**Issue**: Items were being added to cart but not appearing in CartPage.
**Root Cause**: The CartPage only fetched the cart once on component mount. When items were added from ProductDetailsPage, CartPage didn't know to refresh.

**Fix**: 
- Added event listener for `cartUpdated` event
- ProductDetailsPage dispatches this event after adding to cart
- CartPage listens and refetches cart automatically

### 2. **Orders Not Showing** 
**Issue**: No orders appeared in OrdersPage even after placing orders.
**Root Cause**: The `handlePlaceOrder()` function in CartPage was NOT calling the backend API to create orders. It only cleared the cart display and showed a success message, but never created actual orders in the database.

**Fix**:
- Added address modal for shipping address collection
- `handlePlaceOrder()` now makes API calls to `/api/orders` endpoint
- Creates individual orders for each product
- Actually saves orders to MongoDB

---

## Complete Fixed Code

### 1. **frontend/src/pages/CartPage.jsx** ✅
```jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import api from '../api/axios';

function CartPage() {
  const { isSignedIn } = useUser();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [orderTotal, setOrderTotal] = useState(0);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [address, setAddress] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);

  const fetchCart = async () => {
    if (!isSignedIn) {
      setLoading(false);
      return;
    }
    try {
      const res = await api.get("/cart");
      setCart(res.data);
    } catch (err) {
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isSignedIn]);

  // Listen for cart updates from other pages
  useEffect(() => {
    const handleCartUpdate = () => {
      fetchCart();
    };
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, [isSignedIn]);

  const removeItem = async (productId) => {
    try {
      const res = await api.delete('/cart/remove', {
        data: { productId },
      });
      setCart(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const total = cart.items.reduce(
    (sum, item) =>
      sum + (item.productId?.price || 0) * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      alert('Please enter a shipping address');
      return;
    }

    setPlacingOrder(true);
    try {
      // Create order for each product from each seller
      const ordersByProduct = cart.items.map(item => ({
        sellerId: item.productId?.sellerId || 'unknown',
        products: [{
          productId: item.productId?._id,
          quantity: item.quantity,
          price: item.productId?.price
        }],
        totalPrice: (item.productId?.price || 0) * item.quantity,
        shippingAddress: address,
        status: 'Pending'
      }));

      // Create all orders
      for (const orderData of ordersByProduct) {
        await api.post('/orders', orderData);
      }

      setOrderTotal(total);
      
      // Clear cart in backend
      await api.delete('/cart/remove', { data: {} }).catch(() => {});
      
      setCart({ items: [] });
      setShowAddressModal(false);
      setAddress('');
      setShowOrderSuccess(true);
    } catch (err) {
      console.error(err);
      alert('Failed to place order: ' + (err.response?.data?.error || err.message));
    } finally {
      setPlacingOrder(false);
    }
  };

  if (!isSignedIn) {
    return (
      <div className="py-8 sm:py-12 max-w-lg mx-auto">
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="w-14 h-14 rounded-xl bg-surface border border-border flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-heading)' }}>SHOPPING CART</h1>
          <p className="text-dark-400 text-sm mb-6">Sign in to view your cart.</p>
          <Link to="/sign-in" className="bg-accent hover:bg-accent-hover text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-all">Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="py-8 sm:py-12 max-w-3xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>SHOPPING CART</h1>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-border border-t-accent rounded-full animate-spin" />
          </div>
        ) : cart.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-14 h-14 rounded-xl bg-surface border border-border flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
            </div>
            <p className="text-dark-400 text-sm mb-6">Your cart is empty.</p>
            <Link to="/products" className="bg-accent hover:bg-accent-hover text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-all">Browse Products</Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-3">
              {cart.items.map((item) => (
                <div key={item._id} className="bg-surface border border-border rounded-xl flex items-center gap-4 p-4">
                  <div className="w-16 h-16 bg-dark-800 rounded-lg overflow-hidden shrink-0">
                    {item.productId?.images?.[0] && (
                      <img src={item.productId.images[0]} alt={item.productId.title} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{item.productId?.title}</h3>
                    <p className="text-dark-400 text-sm">{item.productId?.condition} • {item.productId?.category}</p>
                    <p className="text-accent font-bold mt-1">₹{item.productId?.price?.toLocaleString('en-IN')} × {item.quantity}</p>
                  </div>
                  <button onClick={() => removeItem(item.productId?._id)} className="border border-red-500 text-red-500 px-3 py-1.5 rounded-lg text-sm">Remove</button>
                </div>
              ))}
            </div>

            <div className="bg-surface border border-border rounded-xl p-5">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white font-semibold">Total</span>
                <span className="text-3xl font-bold text-accent">₹{total.toLocaleString('en-IN')}</span>
              </div>
              <p className="text-dark-500 text-sm mb-5">Payment: Cash on Delivery (COD)</p>
              <button onClick={() => setShowAddressModal(true)} className="w-full bg-accent hover:bg-accent-hover text-white py-3 rounded-lg font-semibold transition-all disabled:opacity-50" disabled={placingOrder}>
                {placingOrder ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-surface border border-border rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-4">Shipping Address</h2>
            <textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter your full shipping address..." className="w-full bg-dark-800 border border-border rounded-lg p-3 text-white placeholder-dark-500 mb-4 focus:outline-none focus:border-accent" rows="4" />
            <div className="flex gap-3">
              <button onClick={() => { setShowAddressModal(false); setAddress(''); }} className="flex-1 border border-border text-white py-2.5 rounded-lg font-semibold hover:bg-dark-800 transition-all">Cancel</button>
              <button onClick={handlePlaceOrder} disabled={placingOrder || !address.trim()} className="flex-1 bg-accent hover:bg-accent-hover text-white py-2.5 rounded-lg font-semibold transition-all disabled:opacity-50">
                {placingOrder ? 'Processing...' : 'Confirm Order'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showOrderSuccess && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-surface border border-border rounded-2xl p-8 max-w-md w-full text-center">
            <div className="mx-auto mb-5 w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Order Placed!</h2>
            <p className="text-dark-400 mb-6">Your order has been placed successfully.</p>
            <div className="bg-dark-800 border border-border rounded-xl p-4 mb-6">
              <p className="text-dark-400 text-sm">Total Amount</p>
              <p className="text-accent text-3xl font-bold mt-1">₹{orderTotal.toLocaleString('en-IN')}</p>
            </div>
            <button onClick={() => setShowOrderSuccess(false)} className="w-full bg-accent hover:bg-accent-hover text-white py-3 rounded-lg font-semibold">Continue Shopping</button>
          </div>
        </div>
      )}
    </>
  );
}

export default CartPage;
```

### 2. **frontend/src/pages/ProductDetailsPage.jsx** ✅
```jsx
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
```

---

## What Changed

| Issue | Before | After |
|-------|--------|-------|
| **Cart Display** | Didn't refresh after adding items | Listens for `cartUpdated` event and refetches |
| **Order Creation** | No API call made | Creates actual orders via `/api/orders` |
| **Shipping Address** | Not collected | Modal prompts user before placing order |
| **Cart Clearing** | Only cleared frontend | Clears both frontend and backend |
| **Error Handling** | No feedback | Shows alert with error message |

---

## How It Works Now

1. **User adds item to cart** → ProductDetailsPage dispatches `cartUpdated` event
2. **CartPage listens** → Refetches and displays updated cart
3. **User clicks "Place Order"** → Address modal appears
4. **User enters address** → API creates order(s) in MongoDB
5. **Success modal shows** → Order is now in database
6. **Orders page** → Shows the newly created orders

---

## Testing Checklist

- [ ] Add product to cart from ProductDetailsPage
- [ ] Cart items appear immediately in CartPage
- [ ] Click "Place Order"
- [ ] Enter shipping address and confirm
- [ ] See success message
- [ ] Go to Orders page - order appears with correct total
- [ ] Remove item from cart
- [ ] Cart updates
- [ ] Place another order with multiple items
