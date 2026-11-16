import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  onIdTokenChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import { auth, googleAuthProvider } from '../lib/firebase';

export interface DbUserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  role: string;
}

interface AuthContextValue {
  firebaseUser: User | null;
  dbUser: DbUserProfile | null;
  idToken: string | null;
  loading: boolean;
  authError: string | null;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  getFreshToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [dbUser, setDbUser] = useState<DbUserProfile | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const syncProfile = useCallback(async (user: User | null) => {
    if (!user) {
      setIdToken(null);
      setDbUser(null);
      setLoading(false);
      return;
    }

    try {
      const token = await user.getIdToken();
      setIdToken(token);

      const res = await fetch('/api/v1/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || 'Unable to verify session with server.');
      }

      const data = await res.json();
      setDbUser(data.user);
      setAuthError(null);
    } catch (error) {
      setAuthError(
        error instanceof Error ? error.message : 'Authentication verification failed.',
      );
      setDbUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, (user) => {
      setFirebaseUser(user);
      void syncProfile(user);
    });
    return () => unsubscribe();
  }, [syncProfile]);

  const signInWithGoogle = useCallback(async () => {
    setAuthError(null);
    setLoading(true);
    try {
      const credential = await signInWithPopup(auth, googleAuthProvider);
      await syncProfile(credential.user);
    } catch (error) {
      setLoading(false);
      setAuthError(
        error instanceof Error
          ? error.message
          : 'Google sign-in was cancelled or blocked.',
      );
    }
  }, [syncProfile]);

  const logout = useCallback(async () => {
    try {
      if (idToken) {
        await fetch('/api/v1/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${idToken}` },
        }).catch(() => undefined);
      }
    } finally {
      await signOut(auth);
      setDbUser(null);
      setIdToken(null);
      setAuthError(null);
    }
  }, [idToken]);

  const getFreshToken = useCallback(async () => {
    if (!auth.currentUser) return null;
    const fresh = await auth.currentUser.getIdToken();
    setIdToken(fresh);
    return fresh;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        dbUser,
        idToken,
        loading,
        authError,
        signInWithGoogle,
        logout,
        getFreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
}
