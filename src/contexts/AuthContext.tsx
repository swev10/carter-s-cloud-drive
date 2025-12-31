import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { LocalUser, AuthState, hashPassword, DEFAULT_USERS } from '@/types/auth';

const USERS_STORAGE_KEY = 'cartercloud_users';
const AUTH_STORAGE_KEY = 'cartercloud_auth';

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  register: (username: string, password: string) => { success: boolean; error?: string };
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const getUsers = (): LocalUser[] => {
  const stored = localStorage.getItem(USERS_STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  // Initialize with default users
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
  return DEFAULT_USERS;
};

const saveUsers = (users: LocalUser[]) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    currentUser: null,
    storageLimit: 50 * 1024 * 1024, // Default 50MB
  });

  // Load auth state on mount
  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      const users = getUsers();
      const user = users.find(u => u.username === parsed.currentUser);
      if (user) {
        setAuthState({
          isAuthenticated: true,
          currentUser: user.username,
          storageLimit: user.storageLimit,
        });
      }
    }
  }, []);

  const login = useCallback((username: string, password: string): { success: boolean; error?: string } => {
    const users = getUsers();
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    if (user.passwordHash !== hashPassword(password)) {
      return { success: false, error: 'Incorrect password' };
    }

    const newAuthState: AuthState = {
      isAuthenticated: true,
      currentUser: user.username,
      storageLimit: user.storageLimit,
    };

    setAuthState(newAuthState);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newAuthState));
    
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setAuthState({
      isAuthenticated: false,
      currentUser: null,
      storageLimit: 50 * 1024 * 1024,
    });
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  const register = useCallback((username: string, password: string): { success: boolean; error?: string } => {
    if (username.length < 3) {
      return { success: false, error: 'Username must be at least 3 characters' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }

    const users = getUsers();
    const existingUser = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    
    if (existingUser) {
      return { success: false, error: 'Username already taken' };
    }

    const newUser: LocalUser = {
      username,
      passwordHash: hashPassword(password),
      storageLimit: 50 * 1024 * 1024, // 50MB for new users
      createdAt: Date.now(),
    };

    users.push(newUser);
    saveUsers(users);

    // Auto login after registration
    const newAuthState: AuthState = {
      isAuthenticated: true,
      currentUser: newUser.username,
      storageLimit: newUser.storageLimit,
    };

    setAuthState(newAuthState);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newAuthState));
    
    return { success: true };
  }, []);

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
