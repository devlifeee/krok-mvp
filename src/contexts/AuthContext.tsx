import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '@/types/auth';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUser: User = {
  id: '1',
  email: 'admin@krokos.com',
  name: 'Администратор',
  role: 'Admin'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: mockUser,
    isAuthenticated: true,
    token: 'mock_jwt_token'
  });

  useEffect(() => {
    // Автоматически авторизуем пользователя как Admin
    const token = 'mock_jwt_token';
    setAuthState({
      user: mockUser,
      isAuthenticated: true,
      token
    });
    
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_data', JSON.stringify(mockUser));
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Всегда возвращаем true, так как пользователь уже авторизован
    return true;
  };

  const logout = () => {
    // При выходе сразу авторизуем снова
    const token = 'mock_jwt_token';
    setAuthState({
      user: mockUser,
      isAuthenticated: true,
      token
    });
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_data', JSON.stringify(mockUser));
  };

  const updateUser = (userData: Partial<User>) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, ...userData };
      setAuthState(prev => ({ ...prev, user: updatedUser }));
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      logout,
      updateUser
    }}>
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
