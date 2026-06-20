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

  useEffect(() => {
<<<<<<< HEAD
    if (!isSignedIn) {
      setLoading(false);
      return;
    }

    api
      .get('/cart')
      .then((res) => setCart(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isSignedIn]);
=======
  if (!isSignedIn) {
    setLoading(false);
    return;
  }

  // If order was placed, keep cart empty
  if (localStorage.getItem("cartCleared") === "true") {
    setCart({ items: [] });
    setLoading(false);
    return;
  }

  api
    .get("/cart")
    .then((res) => {
      setCart(res.data);
    })
    .catch(() => {
      setCart({ items: [] });
    })
    .finally(() => setLoading(false));
}, [isSignedIn]);
>>>>>>> e2318f6 (Initial commit)

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

  const handlePlaceOrder = () => {
<<<<<<< HEAD
    setOrderTotal(total);
    setCart({ items: [] });
    setShowOrderSuccess(true);
  };
=======
  setOrderTotal(total);

  // Clear cart permanently in frontend
  localStorage.setItem("cartCleared", "true");

  setCart({ items: [] });

  setShowOrderSuccess(true);
};
>>>>>>> e2318f6 (Initial commit)

  if (!isSignedIn) {
    return (
      <div className="py-8 sm:py-12 max-w-lg mx-auto">
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="w-14 h-14 rounded-xl bg-surface border border-border flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-dark-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
              />
            </svg>
          </div>

          <h1
            className="text-3xl font-bold text-white mb-2"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            SHOPPING CART
          </h1>

          <p className="text-dark-400 text-sm mb-6">
            Sign in to view your cart.
          </p>

          <Link
            to="/sign-in"
            className="bg-accent hover:bg-accent-hover text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-all"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="py-8 sm:py-12 max-w-3xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1
            className="text-3xl sm:text-4xl font-bold text-white"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            SHOPPING CART
          </h1>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-border border-t-accent rounded-full animate-spin" />
          </div>
        ) : cart.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-14 h-14 rounded-xl bg-surface border border-border flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-dark-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
                />
              </svg>
            </div>

            <p className="text-dark-400 text-sm mb-6">
              Your cart is empty.
            </p>

            <Link
              to="/products"
              className="bg-accent hover:bg-accent-hover text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-all"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-3">
              {cart.items.map((item) => (
                <div
                  key={item._id}
                  className="bg-surface border border-border rounded-xl flex items-center gap-4 p-4"
                >
                  <div className="w-16 h-16 bg-dark-800 rounded-lg overflow-hidden shrink-0">
                    {item.productId?.images?.[0] && (
                      <img
                        src={item.productId.images[0]}
                        alt={item.productId.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-white">
                      {item.productId?.title}
                    </h3>

                    <p className="text-dark-400 text-sm">
                      {item.productId?.condition} •{' '}
                      {item.productId?.category}
                    </p>

                    <p className="text-accent font-bold mt-1">
                      ₹
                      {item.productId?.price?.toLocaleString('en-IN')} ×{' '}
                      {item.quantity}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      removeItem(item.productId?._id)
                    }
                    className="border border-red-500 text-red-500 px-3 py-1.5 rounded-lg text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-surface border border-border rounded-xl p-5">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white font-semibold">
                  Total
                </span>

                <span className="text-3xl font-bold text-accent">
                  ₹{total.toLocaleString('en-IN')}
                </span>
              </div>

              <p className="text-dark-500 text-sm mb-5">
                Payment: Cash on Delivery (COD)
              </p>

              <button
                onClick={handlePlaceOrder}
                className="w-full bg-accent hover:bg-accent-hover text-white py-3 rounded-lg font-semibold transition-all"
              >
                Place Order
              </button>
            </div>
          </div>
        )}
      </div>

      {showOrderSuccess && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-surface border border-border rounded-2xl p-8 max-w-md w-full text-center">

            <div className="mx-auto mb-5 w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h2 className="text-3xl font-bold text-white mb-2">
              Order Placed!
            </h2>

            <p className="text-dark-400 mb-6">
              Your order has been placed successfully.
            </p>

            <div className="bg-dark-800 border border-border rounded-xl p-4 mb-6">
              <p className="text-dark-400 text-sm">
                Total Amount
              </p>

              <p className="text-accent text-3xl font-bold mt-1">
                ₹{orderTotal.toLocaleString('en-IN')}
              </p>
            </div>

            <button
              onClick={() => setShowOrderSuccess(false)}
              className="w-full bg-accent hover:bg-accent-hover text-white py-3 rounded-lg font-semibold"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default CartPage;