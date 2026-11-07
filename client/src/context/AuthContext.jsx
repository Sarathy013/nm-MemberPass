import { createContext, useContext, useState, useEffect } from 'react';
import { DEMO_USERS } from '../data/demoData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('mp_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { localStorage.removeItem('mp_user'); }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Try backend first; fall back to demo data
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const data = await res.json();
        const userData = { ...data.user, token: data.token };
        setUser(userData);
        localStorage.setItem('mp_user', JSON.stringify(userData));
        return { success: true };
      }
    } catch {
      // Backend unavailable — use demo mode
    }

    // Demo mode fallback
    const found = DEMO_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (found) {
      const userData = { id: found.id, name: found.name, email: found.email, role: found.role, demo: true };
      setUser(userData);
      localStorage.setItem('mp_user', JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, message: 'Invalid email or password' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mp_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isDemo: user?.demo === true }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
