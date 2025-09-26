import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  name: string;
  role: string;
  department: string;
  employeeId: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    // Récupérer les utilisateurs depuis l'AdminContext
    const savedUsers = localStorage.getItem('admin-users');
    const adminUsers = savedUsers ? JSON.parse(savedUsers) : [];
    
    const foundUser = adminUsers.find(
      (u: any) => u.username === username && u.password === password && u.isActive
    );

    if (foundUser) {
      const userForAuth = {
        id: foundUser.id,
        username: foundUser.username,
        name: `${foundUser.firstName} ${foundUser.lastName}`,
        role: foundUser.role,
        department: foundUser.role === 'admin' ? 'Administration' : 
                   foundUser.role === 'hr' ? 'Ressources Humaines' :
                   foundUser.role === 'manager' ? 'Management' :
                   foundUser.role === 'training' ? 'Formation' :
                   foundUser.role === 'budget' ? 'Budget' :
                   foundUser.role === 'director' ? 'Direction' : 'Employé',
        employeeId: foundUser.id
      };
      
      setUser(userForAuth);
      localStorage.setItem('currentUser', JSON.stringify(userForAuth));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};