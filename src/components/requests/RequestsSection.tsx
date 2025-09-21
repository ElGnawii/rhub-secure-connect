import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  FileText, 
  Plus, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Building,
  GraduationCap,
  ArrowLeft
} from "lucide-react";
import { useWorkflow } from '@/contexts/WorkflowContext';
import { RequestForm } from '@/components/workflow/RequestForm';
import { RequestDetails } from '@/components/workflow/RequestDetails';

const quickRequestTypes = [
  {
    title: "Demande de congé",
    description: "Vacances, RTT, congé maladie",
    icon: Calendar,
    color: "text-primary",
    bgColor: "bg-primary/10",
    type: "leave" as const
  },
  {
    title: "Attestation",
    description: "Attestation de travail, salaire",
    icon: FileText,
    color: "text-info",
    bgColor: "bg-info/10",
    type: "certificate" as const
  },
  {
    title: "Formation",
    description: "Demande de formation",
    icon: GraduationCap,
    color: "text-success",
    bgColor: "bg-success/10",
    type: "training" as const
  },
  {
    title: "Réclamation",
    description: "Signaler un problème",
    icon: AlertCircle,
    color: "text-warning",
    bgColor: "bg-warning/10",
    type: "complaint" as const
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'submitted':
    case 'in_progress': return Clock;
    case 'approved': return CheckCircle;
    case 'rejected': return XCircle;
    default: return Clock;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'draft': return "bg-muted text-muted-foreground";
    case 'submitted':
    case 'in_progress': return "bg-warning text-warning-foreground";
    case 'approved': return "bg-success text-success-foreground";
    case 'rejected': return "bg-destructive text-destructive-foreground";
    default: return "bg-muted text-muted-foreground";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'draft': return 'Brouillon';
    case 'submitted': return 'Soumise';
    case 'in_progress': return 'En cours';
    case 'approved': return 'Approuvée';
    case 'rejected': return 'Refusée';
    default: return status;
  }
};

export function RequestsSection() {
  const { requests, getRequestsByStatus } = useWorkflow();
  const [currentView, setCurrentView] = useState<'list' | 'form' | 'details'>('list');
  const [formType, setFormType] = useState<'leave' | 'training' | 'certificate' | 'complaint'>('leave');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  const handleNewRequest = (type: 'leave' | 'training' | 'certificate' | 'complaint') => {
    setFormType(type);
    setCurrentView('form');
  };

  const handleViewDetails = (request: any) => {
    setSelectedRequest(request);
    setCurrentView('details');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setFormType('leave');
    setSelectedRequest(null);
  };

  const handleFormSubmit = () => {
    setCurrentView('list');
  };

  if (currentView === 'form') {
    return (
      <RequestForm 
        type={formType} 
        onBack={handleBackToList}
        onSubmit={handleFormSubmit}
      />
    );
  }

  if (currentView === 'details' && selectedRequest) {
    return (
      <RequestDetails 
        request={selectedRequest}
        onBack={handleBackToList}
      />
    );
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mes demandes</h1>
          <p className="text-muted-foreground mt-1">
            Gérez vos demandes RH et suivez leur avancement
          </p>
        </div>
        <Button 
          className="gradient-primary text-primary-foreground shadow-corporate"
          onClick={() => handleNewRequest('leave')}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle demande
        </Button>
      </div>

      {/* Quick actions */}
      <Card className="gradient-card shadow-corporate">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="w-5 h-5 text-primary" />
            <span>Actions rapides</span>
          </CardTitle>
          <CardDescription>
            Créez rapidement une nouvelle demande
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickRequestTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  className="h-24 flex flex-col space-y-2 transition-smooth hover:shadow-md hover:scale-105"
                  onClick={() => handleNewRequest(type.type)}
                >
                  <div className={`p-2 rounded-lg ${type.bgColor}`}>
                    <Icon className={`w-6 h-6 ${type.color}`} />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-sm">{type.title}</p>
                    <p className="text-xs text-muted-foreground">{type.description}</p>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Toutes</TabsTrigger>
          <TabsTrigger value="pending">En attente</TabsTrigger>
          <TabsTrigger value="approved">Approuvées</TabsTrigger>
          <TabsTrigger value="rejected">Refusées</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card className="gradient-card shadow-corporate">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-primary" />
                <span>Historique des demandes</span>
              </CardTitle>
              <CardDescription>
                Toutes vos demandes avec leur statut actuel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getRequestsByStatus('all').map((request) => {
                  const StatusIcon = getStatusIcon(request.status);
                  const currentStep = request.steps.find(step => step.order === request.currentStep);
                  
                  return (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-4 bg-accent/30 rounded-lg border border-border transition-smooth hover:bg-accent/50 cursor-pointer"
                      onClick={() => handleViewDetails(request)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <StatusIcon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-semibold text-foreground">{request.title}</h3>
                          <p className="text-sm text-muted-foreground">{request.description}</p>
                          {request.startDate && (
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <span>Du {new Date(request.startDate).toLocaleDateString('fr-FR')} au {new Date(request.endDate!).toLocaleDateString('fr-FR')}</span>
                              <span>•</span>
                              <span>{request.duration}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <span>Créée le {new Date(request.createdAt).toLocaleDateString('fr-FR')}</span>
                            {currentStep && (
                              <>
                                <span>•</span>
                                <span>Étape: {currentStep.name}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Badge className={getStatusColor(request.status)}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {getStatusLabel(request.status)}
                        </Badge>
                        <Button variant="outline" size="sm" onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(request);
                        }}>
                          Détails
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card className="gradient-card shadow-corporate">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-warning" />
                <span>Demandes en attente</span>
              </CardTitle>
              <CardDescription>
                Demandes qui nécessitent une validation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getRequestsByStatus('pending').map((request) => {
                  const StatusIcon = getStatusIcon(request.status);
                  const currentStep = request.steps.find(step => step.order === request.currentStep);
                  
                  return (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-4 bg-warning/5 border border-warning/20 rounded-lg cursor-pointer"
                      onClick={() => handleViewDetails(request)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                          <StatusIcon className="w-6 h-6 text-warning" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-semibold text-foreground">{request.title}</h3>
                          <p className="text-sm text-muted-foreground">{request.description}</p>
                          {request.startDate && (
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <span>Du {new Date(request.startDate).toLocaleDateString('fr-FR')} au {new Date(request.endDate!).toLocaleDateString('fr-FR')}</span>
                              <span>•</span>
                              <span>{request.duration}</span>
                            </div>
                          )}
                          {currentStep && (
                            <div className="text-xs text-muted-foreground">
                              En attente: {currentStep.name} ({currentStep.approver})
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Badge className={getStatusColor(request.status)}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {getStatusLabel(request.status)}
                        </Badge>
                        <Button variant="outline" size="sm" onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(request);
                        }}>
                          Détails
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          <Card className="gradient-card shadow-corporate">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <span>Demandes approuvées</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getRequestsByStatus('approved').map((request) => {
                  const StatusIcon = getStatusIcon(request.status);
                  
                  return (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-4 bg-success/5 border border-success/20 rounded-lg cursor-pointer"
                      onClick={() => handleViewDetails(request)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                          <StatusIcon className="w-6 h-6 text-success" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-semibold text-foreground">{request.title}</h3>
                          <p className="text-sm text-muted-foreground">{request.description}</p>
                          <div className="text-xs text-muted-foreground">
                            Approuvée le {new Date(request.updatedAt).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      </div>
                      
                      <Badge className={getStatusColor(request.status)}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {getStatusLabel(request.status)}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected">
          <Card className="gradient-card shadow-corporate">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <XCircle className="w-5 h-5 text-destructive" />
                <span>Demandes refusées</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getRequestsByStatus('rejected').length === 0 ? (
                  <div className="text-center py-8">
                    <XCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Aucune demande refusée</p>
                  </div>
                ) : (
                  getRequestsByStatus('rejected').map((request) => {
                    const StatusIcon = getStatusIcon(request.status);
                  
                    return (
                      <div
                        key={request.id}
                        className="flex items-center justify-between p-4 bg-destructive/5 border border-destructive/20 rounded-lg cursor-pointer"
                        onClick={() => handleViewDetails(request)}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center">
                            <StatusIcon className="w-6 h-6 text-destructive" />
                          </div>
                          <div className="space-y-1">
                            <h3 className="font-semibold text-foreground">{request.title}</h3>
                            <p className="text-sm text-muted-foreground">{request.description}</p>
                            <div className="text-xs text-muted-foreground">
                              Refusée le {new Date(request.updatedAt).toLocaleDateString('fr-FR')}
                            </div>
                          </div>
                        </div>
                        
                        <Badge className={getStatusColor(request.status)}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {getStatusLabel(request.status)}
                        </Badge>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}