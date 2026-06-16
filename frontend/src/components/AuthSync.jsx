import { useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import api, { setAuthToken } from '../api/axios';

export default function AuthSync({ children }) {
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
