import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ path, label }) => (
    <Link
      to={path}
      className={`relative px-4 py-2 text-[13px] font-medium rounded-lg transition-all duration-200 ${
        isActive(path)
          ? 'text-accent bg-accent-muted'
          : 'text-dark-300 hover:text-white hover:bg-dark-700/50'
      }`}
    >
      {label}
      {isActive(path) && (
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-accent rounded-full" />
      )}
    </Link>
  );

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-surface/80 backdrop-blur-xl border border-border shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            <Link to="/" className="flex items-center gap-3 shrink-0">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-wider hidden sm:block" style={{ fontFamily: 'var(--font-heading)' }}>
                GYM-<span className="text-accent">GENIE</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              <NavLink path="/products" label="Browse" />
              <SignedIn>
                <NavLink path="/cart" label="Cart" />
                <NavLink path="/orders" label="Orders" />
                <NavLink path="/seller" label="Sell" />
                <NavLink path="/chat" label="Chat" />
              </SignedIn>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <SignedIn>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: 'w-9 h-9 ring-2 ring-dark-600 hover:ring-accent transition-all duration-300',
                    }
                  }}
                />
              </SignedIn>
              <SignedOut>
                <Link to="/sign-in" className="text-[13px] font-medium text-dark-300 hover:text-white transition-colors px-4 py-2">
                  Sign In
                </Link>
                <Link to="/sign-up" className="bg-accent hover:bg-accent-hover text-white px-5 py-2 rounded-lg font-semibold text-[13px] transition-all shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:-translate-y-0.5">
                  Get Started
                </Link>
              </SignedOut>
            </div>

            <div className="flex md:hidden items-center gap-2">
              <SignedIn>
                <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: 'w-8 h-8' } }} />
              </SignedIn>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-dark-700/50 transition-colors"
              >
                <div className="w-5 flex flex-col gap-[5px]">
                  <span className={`block h-[1.5px] bg-dark-200 rounded-full transition-all duration-300 origin-center ${mobileOpen ? 'rotate-45 translate-y-[3.25px]' : ''}`} />
                  <span className={`block h-[1.5px] bg-dark-200 rounded-full transition-all duration-300 ${mobileOpen ? 'opacity-0 scale-0' : ''}`} />
                  <span className={`block h-[1.5px] bg-dark-200 rounded-full transition-all duration-300 origin-center ${mobileOpen ? '-rotate-45 -translate-y-[3.25px]' : ''}`} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden animate-fade-in" onClick={() => setMobileOpen(false)} />
      )}

      <div className={`fixed top-0 right-0 z-50 w-72 h-full bg-surface/95 backdrop-blur-xl border-l border-border md:hidden transition-transform duration-300 ease-out ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-5 border-b border-border">
          <span className="text-lg font-bold tracking-wider" style={{ fontFamily: 'var(--font-heading)' }}>MENU</span>
          <button onClick={() => setMobileOpen(false)} className="w-8 h-8 rounded-lg hover:bg-dark-700 flex items-center justify-center text-dark-300">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="flex flex-col p-5 gap-1">
          <SignedOut>
            <div className="mb-4 space-y-2">
              <Link to="/sign-up" className="block text-center bg-accent hover:bg-accent-hover text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-all shadow-lg shadow-accent/25">Get Started</Link>
              <Link to="/sign-in" className="block text-center text-dark-400 hover:text-dark-100 hover:bg-dark-700 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all">Sign In</Link>
            </div>
            <div className="border-t border-border mb-2" />
          </SignedOut>
          <NavLink path="/products" label="Browse" />
          <SignedIn>
            <NavLink path="/cart" label="Cart" />
            <NavLink path="/orders" label="Orders" />
            <NavLink path="/seller" label="Sell" />
            <NavLink path="/chat" label="Chat" />
          </SignedIn>
          <SignedIn>
            <div className="border-t border-border mt-3 pt-4">
              <div className="flex items-center gap-3 px-2">
                <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: 'w-9 h-9' } }} />
                <span className="text-sm text-dark-300">Account</span>
              </div>
            </div>
          </SignedIn>
        </div>
      </div>
    </>
  );
}

export default Navbar;
