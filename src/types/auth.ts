export interface LocalUser {
  username: string;
  passwordHash: string;
  storageLimit: number; // in bytes
  createdAt: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: string | null;
  role: 'admin' | 'member' | null;
  storageLimit: number;
}

// Simple hash function for local use (not cryptographically secure, but fine for local storage demo)
export const hashPassword = (password: string): string => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36) + password.length.toString(36);
};

// Default users
export const DEFAULT_USERS: LocalUser[] = [
  {
    username: 'carte1',
    passwordHash: hashPassword('C@rter!23'),
    storageLimit: 500 * 1024 * 1024 * 1024, // 500GB
    createdAt: Date.now(),
  },
];
