import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface Admin {
  id: string;
  username: string;
  name: string;
}

interface AuthContextValue {
  admin: Admin | null;
  accessToken: string | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin]               = useState<Admin | null>(null);
  const [accessToken, setAccessToken]   = useState<string | null>(null);
  const [isLoading, setIsLoading]       = useState(true);

  // On mount, try to restore session via refresh token (stored in httpOnly cookie)
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${BASE}/api/auth/refresh`, {
          method: 'POST',
          credentials: 'include', // sends the httpOnly cookie
        });
        if (res.ok) {
          const json = await res.json();
          setAdmin(json.data.admin);
          setAccessToken(json.data.accessToken);
        }
      } catch {
        // No session — stay logged out
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // Auto-refresh access token every 13 minutes (access token lives 15m)
  useEffect(() => {
    if (!accessToken) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${BASE}/api/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
        });
        if (res.ok) {
          const json = await res.json();
          setAccessToken(json.data.accessToken);
        } else {
          setAdmin(null);
          setAccessToken(null);
        }
      } catch {
        setAdmin(null);
        setAccessToken(null);
      }
    }, 13 * 60 * 1000);
    return () => clearInterval(interval);
  }, [accessToken]);

  const login = useCallback(async (username: string, password: string) => {
    const res = await fetch(`${BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, password }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error ?? 'Login failed');
    setAdmin(json.data.admin);
    setAccessToken(json.data.accessToken);
  }, []);

  const logout = useCallback(async () => {
    await fetch(`${BASE}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    setAdmin(null);
    setAccessToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      admin,
      accessToken,
      isAdmin: !!admin,
      isLoading,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
