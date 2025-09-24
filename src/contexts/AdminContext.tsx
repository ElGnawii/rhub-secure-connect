import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

export interface User {
  id: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'manager' | 'hr' | 'employee' | 'director' | 'training' | 'budget';
  isActive: boolean;
  createdAt: string;
}

export interface WorkflowValidator {
  id: string;
  workflowType: 'leave' | 'training' | 'certificate' | 'complaint';
  stepName: string;
  validatorId: string;
  validatorName: string;
  order: number;
}

interface AdminContextType {
  users: User[];
  validators: WorkflowValidator[];
  createUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  getUsersByRole: (role: string) => User[];
  createValidator: (validator: Omit<WorkflowValidator, 'id'>) => void;
  updateValidator: (id: string, updates: Partial<WorkflowValidator>) => void;
  deleteValidator: (id: string) => void;
  getValidatorsByWorkflow: (workflowType: string) => WorkflowValidator[];
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Données initiales
const initialUsers: User[] = [
  {
    id: 'admin1',
    username: 'admin',
    password: 'admin123',
    firstName: 'Administrateur',
    lastName: 'Système',
    email: 'admin@company.com',
    role: 'admin',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'manager1',
    username: 'smartin',
    password: 'manager123',
    firstName: 'Sophie',
    lastName: 'Martin',
    email: 'sophie.martin@company.com',
    role: 'manager',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'hr1',
    username: 'tleroy',
    password: 'hr123',
    firstName: 'Thomas',
    lastName: 'Leroy',
    email: 'thomas.leroy@company.com',
    role: 'hr',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'training1',
    username: 'mdubois',
    password: 'training123',
    firstName: 'Marie',
    lastName: 'Dubois',
    email: 'marie.dubois@company.com',
    role: 'training',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'budget1',
    username: 'jdupont',
    password: 'budget123',
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@company.com',
    role: 'budget',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'director1',
    username: 'pdurand',
    password: 'director123',
    firstName: 'Pierre',
    lastName: 'Durand',
    email: 'pierre.durand@company.com',
    role: 'director',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'user1',
    username: 'jdoe',
    password: 'employee123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@company.com',
    role: 'employee',
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

const initialValidators: WorkflowValidator[] = [
  // Congés
  { id: 'v1', workflowType: 'leave', stepName: 'Validation Manager', validatorId: 'manager1', validatorName: 'Sophie Martin', order: 1 },
  { id: 'v2', workflowType: 'leave', stepName: 'Validation RH', validatorId: 'hr1', validatorName: 'Thomas Leroy', order: 2 },
  
  // Formation
  { id: 'v3', workflowType: 'training', stepName: 'Validation Manager', validatorId: 'manager1', validatorName: 'Sophie Martin', order: 1 },
  { id: 'v4', workflowType: 'training', stepName: 'Validation Formation', validatorId: 'training1', validatorName: 'Marie Dubois', order: 2 },
  { id: 'v5', workflowType: 'training', stepName: 'Validation Budgétaire', validatorId: 'budget1', validatorName: 'Jean Dupont', order: 3 },
  
  // Attestation
  { id: 'v6', workflowType: 'certificate', stepName: 'Validation RH', validatorId: 'hr1', validatorName: 'Thomas Leroy', order: 1 },
  
  // Réclamation
  { id: 'v7', workflowType: 'complaint', stepName: 'Validation RH', validatorId: 'hr1', validatorName: 'Thomas Leroy', order: 1 },
  { id: 'v8', workflowType: 'complaint', stepName: 'Validation Direction', validatorId: 'director1', validatorName: 'Pierre Durand', order: 2 }
];

export function AdminProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [validators, setValidators] = useState<WorkflowValidator[]>([]);

  // Charger les données depuis localStorage
  useEffect(() => {
    const savedUsers = localStorage.getItem('admin-users');
    const savedValidators = localStorage.getItem('admin-validators');
    
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      setUsers(initialUsers);
      localStorage.setItem('admin-users', JSON.stringify(initialUsers));
    }
    
    if (savedValidators) {
      setValidators(JSON.parse(savedValidators));
    } else {
      setValidators(initialValidators);
      localStorage.setItem('admin-validators', JSON.stringify(initialValidators));
    }
  }, []);

  // Sauvegarder les utilisateurs
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('admin-users', JSON.stringify(users));
    }
  }, [users]);

  // Sauvegarder les validateurs
  useEffect(() => {
    if (validators.length > 0) {
      localStorage.setItem('admin-validators', JSON.stringify(validators));
    }
  }, [validators]);

  const createUser = (newUser: Omit<User, 'id' | 'createdAt'>) => {
    const id = `user_${Date.now()}`;
    const user: User = {
      ...newUser,
      id,
      createdAt: new Date().toISOString()
    };

    setUsers(prev => [...prev, user]);
    toast({
      title: "Utilisateur créé",
      description: `L'utilisateur ${user.firstName} ${user.lastName} a été créé avec succès.`
    });
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(user => 
      user.id === id ? { ...user, ...updates } : user
    ));
    toast({
      title: "Utilisateur modifié",
      description: "Les informations de l'utilisateur ont été mises à jour."
    });
  };

  const deleteUser = (id: string) => {
    const user = users.find(u => u.id === id);
    setUsers(prev => prev.filter(user => user.id !== id));
    
    // Supprimer les validateurs associés
    setValidators(prev => prev.filter(validator => validator.validatorId !== id));
    
    toast({
      title: "Utilisateur supprimé",
      description: user ? `${user.firstName} ${user.lastName} a été supprimé.` : "Utilisateur supprimé.",
      variant: "destructive"
    });
  };

  const getUsersByRole = (role: string) => {
    return users.filter(user => user.role === role && user.isActive);
  };

  const createValidator = (newValidator: Omit<WorkflowValidator, 'id'>) => {
    const id = `validator_${Date.now()}`;
    const validator: WorkflowValidator = {
      ...newValidator,
      id
    };

    setValidators(prev => [...prev, validator]);
    toast({
      title: "Validateur ajouté",
      description: `${validator.validatorName} a été ajouté comme validateur.`
    });
  };

  const updateValidator = (id: string, updates: Partial<WorkflowValidator>) => {
    setValidators(prev => prev.map(validator => 
      validator.id === id ? { ...validator, ...updates } : validator
    ));
    toast({
      title: "Validateur modifié",
      description: "Le validateur a été mis à jour."
    });
  };

  const deleteValidator = (id: string) => {
    const validator = validators.find(v => v.id === id);
    setValidators(prev => prev.filter(v => v.id !== id));
    toast({
      title: "Validateur supprimé",
      description: validator ? `${validator.validatorName} a été supprimé.` : "Validateur supprimé.",
      variant: "destructive"
    });
  };

  const getValidatorsByWorkflow = (workflowType: string) => {
    return validators
      .filter(validator => validator.workflowType === workflowType)
      .sort((a, b) => a.order - b.order);
  };

  return (
    <AdminContext.Provider value={{
      users,
      validators,
      createUser,
      updateUser,
      deleteUser,
      getUsersByRole,
      createValidator,
      updateValidator,
      deleteValidator,
      getValidatorsByWorkflow
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}