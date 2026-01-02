import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { AuthState } from '@/types/auth';

const API_URL = import.meta.env.VITE_API_URL || '/api';

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    currentUser: null,
    role: null,
    storageLimit: 0,
  });

  // Check if we have a session (simplified: just check memory or maybe sessionStorage if we wanted persist)
  // For now, reload = logout, unless we persist to sessionStorage. Let's strictly follow "check if username is... then let in" from user prompt.
  // We won't auto-persist for now to keep it extremely simple and secure-ish for a local tool.
  // Actually, user said "remember them". We should probably persist to localStorage OR rely on the server session.
  // Given the simplicity, let's just persist "isLoggedIn" in localStorage so refresh doesn't kill it.

  useEffect(() => {
    const storedUser = localStorage.getItem('cartercloud_user');
    const storedRole = localStorage.getItem('cartercloud_role') as 'admin' | 'member' | null;
    if (storedUser) {
      setAuthState({
        isAuthenticated: true,
        currentUser: storedUser,
        role: storedRole || 'member',
        storageLimit: 100 * 1024 * 1024 * 1024 // 100GB dummy limit
      });
    }
  }, []);

  const login = useCallback(async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (data.success) {
        const newState: AuthState = {
          isAuthenticated: true,
          currentUser: data.user.username,
          role: data.user.role,
          storageLimit: data.user.storageLimit,
        };
        setAuthState(newState);
        localStorage.setItem('cartercloud_user', data.user.username);
        localStorage.setItem('cartercloud_role', data.user.role);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Incorrect username or password' };
      }
    } catch (e) {
      return { success: false, error: 'Connection to server failed' };
    }
  }, []);

  const logout = useCallback(() => {
    setAuthState({
      isAuthenticated: false,
      currentUser: null,
      role: null,
      storageLimit: 0,
    });
    localStorage.removeItem('cartercloud_user');
    localStorage.removeItem('cartercloud_role');
  }, []);

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
