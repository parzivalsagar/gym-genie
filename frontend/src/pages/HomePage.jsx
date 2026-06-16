import { Link } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';

const features = [
  { icon: '🛒', title: 'Buy & Sell', desc: 'Browse thousands of new and used gym equipment from verified sellers.' },
  { icon: '💰', title: 'Best Prices', desc: 'Compare prices across sellers and grab the best deals on quality gear.' },
  { icon: '💬', title: 'Direct Chat', desc: 'Message sellers directly, negotiate prices, and arrange delivery.' },
  { icon: '🛡️', title: 'Secure COD', desc: 'Pay cash on delivery. No online payment risks, no hidden charges.' },
];

const stats = [
  { value: '10K+', label: 'Products Listed' },
  { value: '5K+', label: 'Happy Buyers' },
  { value: '2K+', label: 'Active Sellers' },
  { value: '50+', label: 'Cities' },
];

function HomePage() {
  return (
    <div className="py-8 sm:py-12 space-y-16 sm:space-y-20">
      <section className="text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/20 bg-accent/5 text-accent text-xs font-medium mb-6 animate-fade-up">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            INDIA'S #1 GYM EQUIPMENT MARKETPLACE
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-[0.95] mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            YOUR <span className="text-accent">FITNESS</span><br />GEAR, YOUR PRICE
          </h1>
          <p className="text-dark-300 text-base sm:text-lg max-w-md mx-auto mb-8 animate-fade-up leading-relaxed" style={{ animationDelay: '0.2s' }}>
            Buy and sell new or used gym equipment. From dumbbells to treadmills, find everything you need.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/products" className="bg-accent hover:bg-accent-hover text-white px-8 py-3.5 rounded-lg font-semibold text-sm transition-all shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:-translate-y-0.5">
              Browse Equipment
            </Link>
            <SignedIn>
              <Link to="/seller" className="border border-border text-dark-200 px-8 py-3.5 rounded-lg font-semibold text-sm hover:bg-dark-700 hover:border-accent hover:text-white transition-all">
                Start Selling
              </Link>
            </SignedIn>
            <SignedOut>
              <Link to="/sign-up" className="border border-border text-dark-200 px-8 py-3.5 rounded-lg font-semibold text-sm hover:bg-dark-700 hover:border-accent hover:text-white transition-all">
                Sign Up to Sell
              </Link>
            </SignedOut>
          </div>
        </div>
      </section>

      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => (
            <div key={f.title} className="bg-surface border border-border rounded-xl p-6 hover:border-border hover:-translate-y-0.5 transition-all duration-200 group">
              <div className="w-11 h-11 rounded-xl bg-accent/10 text-2xl flex items-center justify-center mb-4">{f.icon}</div>
              <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
              <p className="text-dark-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="bg-surface border border-border rounded-xl p-8 sm:p-12 animate-pulse-glow">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
            {stats.map(s => (
              <div key={s.label} className="text-center">
                <p className="text-4xl sm:text-5xl font-bold text-accent" style={{ fontFamily: 'var(--font-heading)' }}>{s.value}</p>
                <p className="text-dark-400 text-sm mt-2">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="text-center pb-4">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>READY TO GEAR UP?</h2>
        <p className="text-dark-400 mb-8 text-sm sm:text-base max-w-md mx-auto">Join thousands of fitness enthusiasts buying and selling quality equipment.</p>
        <Link to="/products" className="bg-accent hover:bg-accent-hover text-white px-10 py-3.5 rounded-lg font-semibold text-sm transition-all shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:-translate-y-0.5">
          Explore Now
        </Link>
      </section>
    </div>
  );
}

export default HomePage;
