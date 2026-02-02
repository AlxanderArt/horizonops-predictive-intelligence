import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserMode = 'demo' | 'guest' | 'authenticated';

interface User {
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  mode: UserMode;
  user: User | null;
  isDemo: boolean;
  isGuest: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  enterDemoMode: () => void;
  enterGuestMode: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [mode, setMode] = useState<UserMode>(() => {
    const saved = sessionStorage.getItem('horizonops_mode');
    return (saved as UserMode) || 'guest';
  });

  const [user, setUser] = useState<User | null>(() => {
    const saved = sessionStorage.getItem('horizonops_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    sessionStorage.setItem('horizonops_mode', mode);
    if (user) {
      sessionStorage.setItem('horizonops_user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('horizonops_user');
    }
  }, [mode, user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // In production, this would call the real API
      // For now, simulate authentication
      if (email && password) {
        setUser({
          email,
          name: email.split('@')[0],
          role: 'operator'
        });
        setMode('authenticated');
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const enterDemoMode = () => {
    setUser({
      email: 'demo@horizonops.io',
      name: 'Demo User',
      role: 'demo'
    });
    setMode('demo');
  };

  const enterGuestMode = () => {
    setUser(null);
    setMode('guest');
  };

  const logout = () => {
    setUser(null);
    setMode('guest');
    sessionStorage.removeItem('horizonops_mode');
    sessionStorage.removeItem('horizonops_user');
  };

  const value: AuthContextType = {
    mode,
    user,
    isDemo: mode === 'demo',
    isGuest: mode === 'guest',
    isAuthenticated: mode === 'authenticated',
    login,
    enterDemoMode,
    enterGuestMode,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
