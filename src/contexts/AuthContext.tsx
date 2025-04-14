
import React, { createContext, useState, useEffect, useContext } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('portfolio_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // Simple mock login function
  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, this would validate credentials with a backend
    const storedUsers = JSON.parse(localStorage.getItem('portfolio_users') || '[]');
    const foundUser = storedUsers.find(
      (u: any) => u.email === email && u.password === password
    );
    
    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      localStorage.setItem('portfolio_user', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  // Simple mock signup function
  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    // In a real app, this would create a new user in the backend
    const storedUsers = JSON.parse(localStorage.getItem('portfolio_users') || '[]');
    
    // Check if user already exists
    if (storedUsers.some((u: any) => u.email === email)) {
      return false;
    }

    const newUser = {
      id: `user_${Date.now()}`,
      email,
      password,
      name,
    };
    
    storedUsers.push(newUser);
    localStorage.setItem('portfolio_users', JSON.stringify(storedUsers));
    
    // Auto login after signup
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    setIsAuthenticated(true);
    localStorage.setItem('portfolio_user', JSON.stringify(userWithoutPassword));
    
    return true;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('portfolio_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
