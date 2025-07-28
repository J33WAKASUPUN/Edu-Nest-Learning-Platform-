// AuthContext.js එකක් සාදන්න
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const firstName = localStorage.getItem('firstName');
    const role = localStorage.getItem('role');
    
    if (token) {
      setUser({ firstName, role });
    }
  }, []);

  const login = (userData) => {
    localStorage.setItem('token', userData.token);
    localStorage.setItem('firstName', userData.firstName);
    localStorage.setItem('role', userData.role);
    setUser({ firstName: userData.firstName, role: userData.role });
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);