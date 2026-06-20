import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="border-t border-border bg-dark-950/80 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <span className="text-lg font-bold tracking-wider" style={{ fontFamily: 'var(--font-heading)' }}>
                GYM<span className="text-accent">GEAR</span>
              </span>
            </Link>
            <p className="text-dark-400 text-sm leading-relaxed max-w-[240px]">
              India's premium marketplace for buying and selling quality gym equipment.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-dark-300 uppercase tracking-widest mb-5" style={{ fontFamily: 'var(--font-heading)' }}>Marketplace</h4>
            <ul className="space-y-3">
              <li><Link to="/products" className="text-sm text-dark-400 hover:text-accent transition-colors">Browse Products</Link></li>
              <li><Link to="/seller" className="text-sm text-dark-400 hover:text-accent transition-colors">Start Selling</Link></li>
              <li><Link to="/orders" className="text-sm text-dark-400 hover:text-accent transition-colors">My Orders</Link></li>
              <li><Link to="/cart" className="text-sm text-dark-400 hover:text-accent transition-colors">Cart</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-dark-300 uppercase tracking-widest mb-5" style={{ fontFamily: 'var(--font-heading)' }}>Categories</h4>
            <ul className="space-y-3">
              <li><Link to="/products?category=Dumbbells" className="text-sm text-dark-400 hover:text-accent transition-colors">Dumbbells</Link></li>
              <li><Link to="/products?category=Barbells" className="text-sm text-dark-400 hover:text-accent transition-colors">Barbells</Link></li>
              <li><Link to="/products?category=Treadmills" className="text-sm text-dark-400 hover:text-accent transition-colors">Treadmills</Link></li>
              <li><Link to="/products?category=Benches" className="text-sm text-dark-400 hover:text-accent transition-colors">Benches</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-dark-300 uppercase tracking-widest mb-5" style={{ fontFamily: 'var(--font-heading)' }}>Support</h4>
            <ul className="space-y-3">
              <li><span className="text-sm text-dark-400">support@gym-genie.in</span></li>
              <li><span className="text-sm text-dark-400">+91 98765 43210</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-dark-500 text-xs">&copy; 2026 Gym-Genie. All rights reserved.</p>
          <div className="flex items-center gap-1.5 text-dark-500 text-xs">
            Built with <span className="text-accent mx-0.5">&#9829;</span> for fitness enthusiasts
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
