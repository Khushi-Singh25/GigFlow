import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  const checkUserLoggedIn = async () => {
    try {
      const { data } = await axios.get('http://localhost:5001/api/auth/profile');
      setUser(data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const { data } = await axios.post('http://localhost:5001/api/auth/login', { email, password });
    setUser(data);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await axios.post('http://localhost:5001/api/auth/register', { name, email, password });
    setUser(data);
    return data;
  };

  const logout = async () => {
    await axios.post('http://localhost:5001/api/auth/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

