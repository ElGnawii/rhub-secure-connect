import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';
import { useAdmin } from '@/contexts/AdminContext';

export interface WorkflowStep {
  id: string;
  name: string;
  approver: string;
  approverId: string;
  status: 'pending' | 'approved' | 'rejected';
  comment?: string;
  processedAt?: string;
  order: number;
}

export interface WorkflowRequest {
  id: string;
  type: 'leave' | 'training' | 'certificate' | 'complaint';
  title: string;
  description: string;
  requesterId: string;
  requesterName: string;
  startDate?: string;
  endDate?: string;
  duration?: string;
  status: 'draft' | 'submitted' | 'in_progress' | 'approved' | 'rejected';
  currentStep: number;
  steps: WorkflowStep[];
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}

interface WorkflowContextType {
  requests: WorkflowRequest[];
  approvals: WorkflowRequest[];
  createRequest: (request: Omit<WorkflowRequest, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateRequest: (id: string, updates: Partial<WorkflowRequest>) => void;
  approveStep: (requestId: string, stepId: string, comment?: string) => void;
  rejectStep: (requestId: string, stepId: string, comment: string) => void;
  submitRequest: (id: string) => void;
  getRequestsByStatus: (status: string) => WorkflowRequest[];
  getPendingApprovals: (approverId: string) => WorkflowRequest[];
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

// Mock workflow templates
const workflowTemplates = {
  leave: [
    { name: 'Validation Manager', approver: 'Sophie Martin', approverId: 'manager1', order: 1 },
    { name: 'Validation RH', approver: 'Thomas Leroy', approverId: 'hr1', order: 2 }
  ],
  training: [
    { name: 'Validation Manager', approver: 'Sophie Martin', approverId: 'manager1', order: 1 },
    { name: 'Validation Formation', approver: 'Marie Dubois', approverId: 'training1', order: 2 },
    { name: 'Validation Budgétaire', approver: 'Jean Dupont', approverId: 'budget1', order: 3 }
  ],
  certificate: [
    { name: 'Validation RH', approver: 'Thomas Leroy', approverId: 'hr1', order: 1 }
  ],
  complaint: [
    { name: 'Validation RH', approver: 'Thomas Leroy', approverId: 'hr1', order: 1 },
    { name: 'Validation Direction', approver: 'Pierre Durand', approverId: 'director1', order: 2 }
  ]
};

// Initial mock data
const initialRequests: WorkflowRequest[] = [
  {
    id: '1',
    type: 'leave',
    title: 'Congé payé - Vacances d\'automne',
    description: 'Demande de congé pour vacances d\'automne',
    requesterId: 'user1',
    requesterName: 'John Doe',
    startDate: '2024-10-15',
    endDate: '2024-10-20',
    duration: '5 jours',
    status: 'in_progress',
    currentStep: 1,
    steps: [
      {
        id: 'step1-1',
        name: 'Validation Manager',
        approver: 'Sophie Martin',
        approverId: 'manager1',
        status: 'pending',
        order: 1
      },
      {
        id: 'step1-2',
        name: 'Validation RH',
        approver: 'Thomas Leroy',
        approverId: 'hr1',
        status: 'pending',
        order: 2
      }
    ],
    createdAt: '2024-10-01T10:00:00Z',
    updatedAt: '2024-10-01T10:00:00Z'
  },
  {
    id: '2',
    type: 'certificate',
    title: 'Attestation de travail',
    description: 'Attestation pour démarche administrative',
    requesterId: 'user1',
    requesterName: 'John Doe',
    status: 'approved',
    currentStep: 1,
    steps: [
      {
        id: 'step2-1',
        name: 'Validation RH',
        approver: 'Thomas Leroy',
        approverId: 'hr1',
        status: 'approved',
        comment: 'Attestation générée et envoyée',
        processedAt: '2024-09-29T14:30:00Z',
        order: 1
      }
    ],
    createdAt: '2024-09-28T09:15:00Z',
    updatedAt: '2024-09-29T14:30:00Z'
  },
  {
    id: '3',
    type: 'training',
    title: 'Formation React Advanced',
    description: 'Formation technique React pour montée en compétences',
    requesterId: 'user1',
    requesterName: 'John Doe',
    startDate: '2024-11-05',
    endDate: '2024-11-07',
    duration: '3 jours',
    status: 'in_progress',
    currentStep: 2,
    steps: [
      {
        id: 'step3-1',
        name: 'Validation Manager',
        approver: 'Sophie Martin',
        approverId: 'manager1',
        status: 'approved',
        comment: 'Formation approuvée, bon pour le développement',
        processedAt: '2024-09-16T11:00:00Z',
        order: 1
      },
      {
        id: 'step3-2',
        name: 'Validation Formation',
        approver: 'Marie Dubois',
        approverId: 'training1',
        status: 'pending',
        order: 2
      },
      {
        id: 'step3-3',
        name: 'Validation Budgétaire',
        approver: 'Jean Dupont',
        approverId: 'budget1',
        status: 'pending',
        order: 3
      }
    ],
    createdAt: '2024-09-15T08:30:00Z',
    updatedAt: '2024-09-16T11:00:00Z',
    metadata: {
      trainingProvider: 'Tech Academy',
      cost: 1500,
      location: 'Paris'
    }
  }
];

export function WorkflowProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<WorkflowRequest[]>(initialRequests);
  const { getValidatorsByWorkflow } = useAdmin();

  const createRequest = (newRequest: Omit<WorkflowRequest, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = `req_${Date.now()}`;
    const validatorConfig = getValidatorsByWorkflow(newRequest.type);
    
    const steps: WorkflowStep[] = validatorConfig.map((validator) => ({
      id: `${id}_step_${validator.order}`,
      name: validator.stepName,
      approver: validator.validatorName,
      approverId: validator.validatorId,
      status: 'pending' as const,
      order: validator.order
    }));

    const request: WorkflowRequest = {
      ...newRequest,
      id,
      status: 'submitted',
      currentStep: 1,
      steps,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setRequests(prev => [...prev, request]);
    toast({
      title: "Demande créée et soumise",
      description: "Votre demande a été soumise et est en cours de traitement."
    });
  };

  const updateRequest = (id: string, updates: Partial<WorkflowRequest>) => {
    setRequests(prev => prev.map(req => 
      req.id === id 
        ? { ...req, ...updates, updatedAt: new Date().toISOString() }
        : req
    ));
  };

  const submitRequest = (id: string) => {
    setRequests(prev => prev.map(req => 
      req.id === id 
        ? { 
            ...req, 
            status: 'submitted' as const,
            currentStep: 1,
            updatedAt: new Date().toISOString()
          }
        : req
    ));
    
    toast({
      title: "Demande soumise",
      description: "Votre demande a été soumise et est en cours de traitement."
    });
  };

  const approveStep = (requestId: string, stepId: string, comment?: string) => {
    setRequests(prev => prev.map(req => {
      if (req.id !== requestId) return req;

      const updatedSteps = req.steps.map(step => 
        step.id === stepId 
          ? { 
              ...step, 
              status: 'approved' as const, 
              comment,
              processedAt: new Date().toISOString()
            }
          : step
      );

      const currentStepIndex = updatedSteps.findIndex(step => step.id === stepId);
      const nextStep = updatedSteps.find(step => step.order === currentStepIndex + 2);
      const allPreviousStepsApproved = updatedSteps
        .filter(step => step.order <= currentStepIndex + 1)
        .every(step => step.status === 'approved');

      let newStatus = req.status;
      let newCurrentStep = req.currentStep;

      if (allPreviousStepsApproved) {
        if (nextStep) {
          newStatus = 'in_progress';
          newCurrentStep = currentStepIndex + 2;
        } else {
          newStatus = 'approved';
          newCurrentStep = updatedSteps.length;
        }
      }

      return {
        ...req,
        steps: updatedSteps,
        status: newStatus,
        currentStep: newCurrentStep,
        updatedAt: new Date().toISOString()
      };
    }));

    toast({
      title: "Étape approuvée",
      description: "L'étape a été approuvée avec succès."
    });
  };

  const rejectStep = (requestId: string, stepId: string, comment: string) => {
    setRequests(prev => prev.map(req => {
      if (req.id !== requestId) return req;

      const updatedSteps = req.steps.map(step => 
        step.id === stepId 
          ? { 
              ...step, 
              status: 'rejected' as const, 
              comment,
              processedAt: new Date().toISOString()
            }
          : step
      );

      return {
        ...req,
        steps: updatedSteps,
        status: 'rejected' as const,
        updatedAt: new Date().toISOString()
      };
    }));

    toast({
      title: "Demande refusée",
      description: "La demande a été refusée.",
      variant: "destructive"
    });
  };

  const getRequestsByStatus = (status: string) => {
    if (status === 'all') return requests;
    if (status === 'pending') return requests.filter(r => r.status === 'submitted' || r.status === 'in_progress');
    if (status === 'approved') return requests.filter(r => r.status === 'approved');
    if (status === 'rejected') return requests.filter(r => r.status === 'rejected');
    return requests.filter(r => r.status === status);
  };

  const getPendingApprovals = (approverId: string) => {
    return requests.filter(req => 
      req.status === 'submitted' || req.status === 'in_progress'
    ).filter(req => {
      const currentStep = req.steps.find(step => step.order === req.currentStep);
      return currentStep && currentStep.approverId === approverId && currentStep.status === 'pending';
    });
  };

  // Mock approvals for current user (acting as different approvers)
  const approvals = [
    ...getPendingApprovals('manager1'),
    ...getPendingApprovals('hr1'),
    ...getPendingApprovals('training1'),
    ...getPendingApprovals('budget1'),
    ...getPendingApprovals('director1')
  ];

  return (
    <WorkflowContext.Provider value={{
      requests,
      approvals,
      createRequest,
      updateRequest,
      approveStep,
      rejectStep,
      submitRequest,
      getRequestsByStatus,
      getPendingApprovals
    }}>
      {children}
    </WorkflowContext.Provider>
  );
}

export function useWorkflow() {
  const context = useContext(WorkflowContext);
  if (context === undefined) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
}