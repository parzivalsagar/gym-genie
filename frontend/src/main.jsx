import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import { BrowserRouter } from 'react-router-dom';
import AuthSync from './components/AuthSync';
import App from './App';
import './index.css';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function Root() {
  const content = (
    <BrowserRouter>
      <AuthSync>
        <App />
      </AuthSync>
    </BrowserRouter>
  );

  if (!PUBLISHABLE_KEY) {
    console.warn('Missing VITE_CLERK_PUBLISHABLE_KEY — running without auth');
    return <React.StrictMode>{content}</React.StrictMode>;
  }

  return (
    <React.StrictMode>
      <BrowserRouter>
        <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
          <AuthSync>
            <App />
          </AuthSync>
        </ClerkProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
