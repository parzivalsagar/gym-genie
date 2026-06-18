import { useEffect, Component } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import api, { setAuthToken } from '../api/axios';

class AuthErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return this.props.children;
    return this.props.content;
  }
}

function AuthSyncInner({ children }) {
  const { getToken } = useAuth();
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    let mounted = true;
    async function loadToken() {
      try {
        const token = await getToken();
        if (mounted) setAuthToken(token);
      } catch {
        if (mounted) setAuthToken(null);
      }
    }
    loadToken();
    const interval = setInterval(loadToken, 60000);
    return () => { mounted = false; clearInterval(interval); };
  }, [getToken]);

  useEffect(() => {
    if (!isSignedIn || !user) return;
    api.post('/sync-user', {
      clerkId: user.id,
      name: user.fullName || user.username || 'User',
      email: user.primaryEmailAddress?.emailAddress || '',
      avatar: user.imageUrl,
    }).catch(console.error);
  }, [isSignedIn, user]);

  return children;
}

export default function AuthSync({ children }) {
  return (
    <AuthErrorBoundary children={children} content={<AuthSyncInner>{children}</AuthSyncInner>} />
  );
}
