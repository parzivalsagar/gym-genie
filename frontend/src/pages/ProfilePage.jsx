import { SignIn, useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

function SignInPage() {
  const { isSignedIn } = useUser();
  if (isSignedIn) return <Navigate to="/" replace />;

  return (
    <div className="py-8 sm:py-12 max-w-sm mx-auto">
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center mx-auto mb-5 shadow-lg shadow-accent/20">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>WELCOME <span className="text-accent">BACK</span></h1>
        <p className="text-dark-400 text-sm mt-1">Sign in to your GymGear account</p>
      </div>
      <div className="bg-surface border border-border rounded-xl p-5 sm:p-6">
        <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" afterSignInUrl="/" />
      </div>
    </div>
  );
}

export default SignInPage;
