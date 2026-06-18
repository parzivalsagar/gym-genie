import { SignUp, useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

function SignUpPage() {
  const { isSignedIn } = useUser();
  if (isSignedIn) return <Navigate to="/" replace />;

  return (
    <div className="py-8 sm:py-12 max-w-sm mx-auto">
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center mx-auto mb-5 shadow-lg shadow-accent/20">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>JOIN <span className="text-accent">GYM-GENIE</span></h1>
        <p className="text-dark-400 text-sm mt-1">Create your account and start trading</p>
      </div>
      <div className="bg-surface border border-border rounded-xl p-5 sm:p-6">
        <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" afterSignUpUrl="/" />
      </div>
    </div>
  );
}

export default SignUpPage;
